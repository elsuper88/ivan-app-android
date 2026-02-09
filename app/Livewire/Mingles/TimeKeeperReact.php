<?php

namespace App\Livewire\Mingles;

use App\Models\TimeEntry;
use App\Models\TimekeeperClient;
use Carbon\Carbon;
use Filament\Facades\Filament;
use Ijpatricio\Mingle\Concerns\InteractsWithMingles;
use Ijpatricio\Mingle\Contracts\HasMingles;
use Livewire\Component;

class TimeKeeperReact extends Component implements HasMingles
{
    use InteractsWithMingles;

    public function component(): string
    {
        return 'resources/js/Mingles/TimeKeeperReact.jsx';
    }

    public function mingleData(): array
    {
        $user = Filament::auth()->user();

        if (! $user) {
            return [
                'clients' => [],
                'activeEntry' => null,
            ];
        }

        return [
            'clients' => $this->getClients(),
            'activeEntry' => $this->getActiveEntry(),
        ];
    }

    protected function getClients(): array
    {
        $user = Filament::auth()->user();

        if (! $user) {
            return [];
        }

        return $user->timekeeperClients()
            ->get()
            ->map(fn (TimekeeperClient $client) => [
                'id' => (string) $client->id,
                'name' => $client->name,
            ])
            ->toArray();
    }

    protected function getActiveEntry(): ?array
    {
        $user = Filament::auth()->user();

        if (! $user) {
            return null;
        }

        $activeEntry = $user->timeEntries()
            ->where('is_running', true)
            ->with(['client', 'segments'])
            ->first();

        return $activeEntry?->toApiFormat();
    }

    /**
     * Fetch entries for a specific date with pagination.
     */
    public function getEntriesForDate(string $date, int $page = 1, int $pageSize = 25): array
    {
        $this->skipRender();

        $user = Filament::auth()->user();

        if (! $user) {
            return $this->emptyPaginatedResponse($page, $pageSize);
        }

        $dateCarbon = Carbon::parse($date)->startOfDay();
        $nextDay = $dateCarbon->copy()->addDay();

        $baseQuery = $user->timeEntries()
            ->where('start_time', '>=', $dateCarbon)
            ->where('start_time', '<', $nextDay);

        // Calculate total day duration (sum of all entries, not just paginated)
        $totalDayDuration = (clone $baseQuery)->sum('duration');

        $query = (clone $baseQuery)
            ->with(['client', 'segments'])
            ->orderByDesc('start_time');

        $totalItems = $query->count();
        $totalPages = max(1, (int) ceil($totalItems / $pageSize));

        $entries = $query
            ->skip(($page - 1) * $pageSize)
            ->take($pageSize)
            ->get()
            ->map(fn (TimeEntry $entry) => $entry->toApiFormat())
            ->toArray();

        return [
            'data' => $entries,
            'totalDayDuration' => $totalDayDuration,
            'pagination' => [
                'page' => $page,
                'pageSize' => $pageSize,
                'totalItems' => $totalItems,
                'totalPages' => $totalPages,
                'hasNextPage' => $page < $totalPages,
                'hasPrevPage' => $page > 1,
            ],
        ];
    }

    /**
     * Start a new time entry.
     */
    public function startTimer(string $clientId, string $description): ?array
    {
        $this->skipRender();

        $user = Filament::auth()->user();

        if (! $user) {
            return null;
        }

        // Stop any currently running entry first
        $this->stopActiveEntry();

        $client = $user->timekeeperClients()->find($clientId);

        if (! $client) {
            return null;
        }

        $now = now();

        $entry = $user->timeEntries()->create([
            'timekeeper_client_id' => $clientId,
            'description' => trim($description) ?: null,
            'start_time' => $now,
            'duration' => 0,
            'is_running' => true,
            'is_paused' => false,
        ]);

        // Create first segment
        $entry->segments()->create([
            'start_time' => $now,
            'duration' => 0,
        ]);

        $entry->load(['client', 'segments']);

        return $entry->toApiFormat();
    }

    /**
     * Pause the active time entry.
     */
    public function pauseTimer(string $entryId): ?array
    {
        $this->skipRender();

        $user = Filament::auth()->user();
        $entry = $user?->timeEntries()->with(['client', 'segments'])->find($entryId);

        if (! $entry || ! $entry->is_running || $entry->is_paused) {
            return null;
        }

        $now = now();

        // Close the current segment
        $activeSegment = $entry->segments()->whereNull('end_time')->first();

        if ($activeSegment) {
            $segmentDuration = $activeSegment->start_time->diffInSeconds($now, false);
            $activeSegment->update([
                'end_time' => $now,
                'duration' => $segmentDuration,
            ]);
        }

        $entry->update(['is_paused' => true]);
        $entry->refresh();

        return $entry->toApiFormat();
    }

    /**
     * Resume a paused time entry.
     */
    public function resumeTimer(string $entryId): ?array
    {
        $this->skipRender();

        $user = Filament::auth()->user();
        $entry = $user?->timeEntries()->with(['client', 'segments'])->find($entryId);

        if (! $entry) {
            return null;
        }

        // If resuming a different entry, stop the current active one
        $currentActive = $user->timeEntries()
            ->where('is_running', true)
            ->where('id', '!=', $entryId)
            ->first();

        if ($currentActive) {
            $this->stopTimer((string) $currentActive->id);
        }

        $now = now();

        // Create a new segment
        $entry->segments()->create([
            'start_time' => $now,
            'duration' => 0,
        ]);

        $entry->update([
            'is_running' => true,
            'is_paused' => false,
            'end_time' => null,
        ]);

        $entry->refresh();

        return $entry->toApiFormat();
    }

    /**
     * Stop a time entry completely.
     */
    public function stopTimer(string $entryId): ?array
    {
        $this->skipRender();

        $user = Filament::auth()->user();
        $entry = $user?->timeEntries()->with(['client', 'segments'])->find($entryId);

        if (! $entry) {
            return null;
        }

        $now = now();

        // Close any active segment
        $activeSegment = $entry->segments()->whereNull('end_time')->first();

        if ($activeSegment) {
            $segmentDuration = $activeSegment->start_time->diffInSeconds($now, false);
            $activeSegment->update([
                'end_time' => $now,
                'duration' => $segmentDuration,
            ]);
        }

        // Calculate total duration from all segments
        $totalDuration = $entry->segments()->sum('duration');

        $entry->update([
            'is_running' => false,
            'is_paused' => false,
            'end_time' => $now,
            'duration' => $totalDuration,
        ]);

        $entry->refresh();

        return $entry->toApiFormat();
    }

    /**
     * Update entry duration (called from React every second while running).
     */
    public function incrementDuration(string $entryId): ?array
    {
        $this->skipRender();

        $user = Filament::auth()->user();
        $entry = $user?->timeEntries()->with(['client', 'segments'])->find($entryId);

        if (! $entry || ! $entry->is_running || $entry->is_paused) {
            return null;
        }

        // Update the active segment duration
        $activeSegment = $entry->segments()->whereNull('end_time')->first();

        if ($activeSegment) {
            $segmentDuration = $activeSegment->start_time->diffInSeconds(now(), false);
            $activeSegment->update(['duration' => $segmentDuration]);
        }

        // Calculate total duration from all segments
        $totalDuration = $entry->segments()->sum('duration');
        $entry->update(['duration' => $totalDuration]);

        $entry->refresh();

        return $entry->toApiFormat();
    }

    /**
     * Edit an existing time entry.
     */
    public function editEntry(string $entryId, string $clientId, string $description): ?array
    {
        $this->skipRender();

        $user = Filament::auth()->user();
        $entry = $user?->timeEntries()->with(['client', 'segments'])->find($entryId);

        if (! $entry) {
            return null;
        }

        $client = $user->timekeeperClients()->find($clientId);

        if (! $client) {
            return null;
        }

        $entry->update([
            'timekeeper_client_id' => $clientId,
            'description' => trim($description) ?: null,
        ]);

        $entry->refresh();

        return $entry->toApiFormat();
    }

    /**
     * Delete a time entry.
     */
    public function deleteEntry(string $entryId): void
    {
        $this->skipRender();

        $user = Filament::auth()->user();
        $entry = $user?->timeEntries()->find($entryId);

        $entry?->delete();
    }

    /**
     * Add a new client.
     */
    public function addClient(string $name): ?array
    {
        $this->skipRender();

        $user = Filament::auth()->user();

        if (! $user || empty(trim($name))) {
            return null;
        }

        $client = $user->timekeeperClients()->create([
            'name' => trim($name),
        ]);

        return [
            'id' => (string) $client->id,
            'name' => $client->name,
        ];
    }

    /**
     * Stop any active entry for the current user.
     */
    protected function stopActiveEntry(): void
    {
        $user = Filament::auth()->user();

        if (! $user) {
            return;
        }

        $activeEntry = $user->timeEntries()->where('is_running', true)->first();

        if ($activeEntry) {
            $this->stopTimer((string) $activeEntry->id);
        }
    }

    protected function emptyPaginatedResponse(int $page, int $pageSize): array
    {
        return [
            'data' => [],
            'pagination' => [
                'page' => $page,
                'pageSize' => $pageSize,
                'totalItems' => 0,
                'totalPages' => 1,
                'hasNextPage' => false,
                'hasPrevPage' => false,
            ],
        ];
    }
}
