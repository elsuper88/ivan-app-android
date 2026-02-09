<?php

namespace App\Livewire\Mingles;

use App\Forms\Components\ColorPickerReactField;
use App\Forms\Components\TimePickerReactField;
use App\Models\CalendarEvent;
use Filament\Actions\Action;
use Filament\Actions\Concerns\InteractsWithActions;
use Filament\Actions\Contracts\HasActions;
use Filament\Facades\Filament;
use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Notifications\Notification;
use Filament\Schemas\Concerns\InteractsWithSchemas;
use Filament\Schemas\Contracts\HasSchemas;
use Ijpatricio\Mingle\Concerns\InteractsWithMingles;
use Ijpatricio\Mingle\Contracts\HasMingles;
use Illuminate\Contracts\View\View;
use Livewire\Component;

class CalendarReact extends Component implements HasActions, HasMingles, HasSchemas
{
    use InteractsWithActions;
    use InteractsWithMingles;
    use InteractsWithSchemas;

    public ?string $selectedDate = null;

    public ?int $editingEventId = null;

    public function component(): string
    {
        return 'resources/js/Mingles/CalendarReact.jsx';
    }

    public function render(): View
    {
        return view('livewire.mingles.calendar-react');
    }

    public function mingleData(): array
    {
        return [
            'events' => $this->getEvents(),
        ];
    }

    protected function getEvents(): array
    {
        $user = Filament::auth()->user();

        if (! $user) {
            return [];
        }

        return $user->calendarEvents()
            ->get()
            ->map(fn (CalendarEvent $event) => [
                'id' => (string) $event->id,
                'title' => $event->title,
                'date' => $event->date->format('Y-m-d'),
                'time' => $event->time,
                'color' => $event->color,
                'description' => $event->description,
            ])
            ->toArray();
    }

    public function openAddModal(string $date): void
    {
        $this->selectedDate = $date;
        $this->editingEventId = null;
        $this->mountAction('createEvent');
    }

    public function openEditModal(int $eventId): void
    {
        $this->editingEventId = $eventId;
        $this->mountAction('editEvent');
    }

    public function createEventAction(): Action
    {
        return Action::make('createEvent')
            ->label('Nuevo evento')
            ->modalHeading('Nuevo evento')
            ->modalWidth('md')
            ->schema([
                DatePicker::make('date')
                    ->label('Fecha')
                    ->required()
                    ->default(fn () => $this->selectedDate ?? now()->format('Y-m-d'))
                    ->displayFormat('l, d F Y')
                    ->native(false),

                TextInput::make('title')
                    ->label('Titulo del evento')
                    ->placeholder('Ej. Reunion de equipo')
                    ->required()
                    ->maxLength(255)
                    ->autofocus(),

                TimePickerReactField::make('time')
                    ->label('Hora (opcional)'),

                ColorPickerReactField::make('color')
                    ->label('Color')
                    ->colors(['violet', 'blue', 'emerald', 'amber', 'rose']),

                Textarea::make('description')
                    ->label('Descripcion (opcional)')
                    ->placeholder('Agrega una descripcion...')
                    ->rows(3),
            ])
            ->action(function (array $data): void {
                $user = Filament::auth()->user();

                if (! $user) {
                    Notification::make()
                        ->title('Error')
                        ->body('Usuario no autenticado')
                        ->danger()
                        ->send();

                    return;
                }

                $calendarEvent = $user->calendarEvents()->create([
                    'title' => trim($data['title']),
                    'date' => $data['date'],
                    'time' => $data['time'] ?? null,
                    'color' => $data['color'] ?? 'violet',
                    'description' => trim($data['description'] ?? '') ?: null,
                ]);

                $this->dispatch('calendar-event-created', eventData: [
                    'id' => (string) $calendarEvent->id,
                    'title' => $calendarEvent->title,
                    'date' => $calendarEvent->date->format('Y-m-d'),
                    'time' => $calendarEvent->time,
                    'color' => $calendarEvent->color,
                    'description' => $calendarEvent->description,
                ]);

                Notification::make()
                    ->title('Evento creado')
                    ->success()
                    ->send();
            })
            ->modalSubmitActionLabel('Agregar');
    }

    public function editEventAction(): Action
    {
        return Action::make('editEvent')
            ->label('Editar evento')
            ->modalHeading('Editar evento')
            ->modalWidth('md')
            ->fillForm(function (): array {
                $user = Filament::auth()->user();
                $event = $user?->calendarEvents()->find($this->editingEventId);

                if (! $event) {
                    return [];
                }

                return [
                    'date' => $event->date->format('Y-m-d'),
                    'title' => $event->title,
                    'time' => $event->time,
                    'color' => $event->color,
                    'description' => $event->description,
                ];
            })
            ->schema([
                DatePicker::make('date')
                    ->label('Fecha')
                    ->required()
                    ->displayFormat('l, d F Y')
                    ->native(false),

                TextInput::make('title')
                    ->label('Titulo del evento')
                    ->placeholder('Ej. Reunion de equipo')
                    ->required()
                    ->maxLength(255)
                    ->autofocus(),

                TimePickerReactField::make('time')
                    ->label('Hora (opcional)'),

                ColorPickerReactField::make('color')
                    ->label('Color')
                    ->colors(['violet', 'blue', 'emerald', 'amber', 'rose']),

                Textarea::make('description')
                    ->label('Descripcion (opcional)')
                    ->placeholder('Agrega una descripcion...')
                    ->rows(3),
            ])
            ->action(function (array $data): void {
                $user = Filament::auth()->user();
                $calendarEvent = $user?->calendarEvents()->find($this->editingEventId);

                if (! $calendarEvent) {
                    Notification::make()
                        ->title('Error')
                        ->body('Evento no encontrado')
                        ->danger()
                        ->send();

                    return;
                }

                $calendarEvent->update([
                    'title' => trim($data['title']),
                    'date' => $data['date'],
                    'time' => $data['time'] ?? null,
                    'color' => $data['color'] ?? $calendarEvent->color,
                    'description' => trim($data['description'] ?? '') ?: null,
                ]);

                $this->dispatch('calendar-event-updated', eventData: [
                    'id' => (string) $calendarEvent->id,
                    'title' => $calendarEvent->title,
                    'date' => $calendarEvent->date->format('Y-m-d'),
                    'time' => $calendarEvent->time,
                    'color' => $calendarEvent->color,
                    'description' => $calendarEvent->description,
                ]);

                Notification::make()
                    ->title('Evento actualizado')
                    ->success()
                    ->send();
            })
            ->modalSubmitActionLabel('Guardar');
    }

    // Keep existing methods for React optimistic updates
    public function addEvent(string $tempId, array $eventData): ?string
    {
        $this->skipRender();

        $user = Filament::auth()->user();

        if (! $user || empty(trim($eventData['title'] ?? ''))) {
            return null;
        }

        $event = $user->calendarEvents()->create([
            'title' => trim($eventData['title']),
            'date' => $eventData['date'],
            'time' => $eventData['time'] ?? null,
            'color' => $eventData['color'] ?? 'violet',
            'description' => trim($eventData['description'] ?? '') ?: null,
        ]);

        return (string) $event->id;
    }

    public function updateEvent(string $id, array $eventData): void
    {
        $this->skipRender();

        $user = Filament::auth()->user();
        $event = $user?->calendarEvents()->find($id);

        if ($event && ! empty(trim($eventData['title'] ?? ''))) {
            $event->update([
                'title' => trim($eventData['title']),
                'date' => $eventData['date'] ?? $event->date,
                'time' => $eventData['time'] ?? null,
                'color' => $eventData['color'] ?? $event->color,
                'description' => trim($eventData['description'] ?? '') ?: null,
            ]);
        }
    }

    public function deleteEvent(string $id): void
    {
        $this->skipRender();

        $user = Filament::auth()->user();
        $event = $user?->calendarEvents()->find($id);

        $event?->delete();
    }

    public function duplicateEvent(string $id): ?array
    {
        $this->skipRender();

        $user = Filament::auth()->user();
        $event = $user?->calendarEvents()->find($id);

        if (! $event) {
            return null;
        }

        $duplicate = $user->calendarEvents()->create([
            'title' => $event->title.' (copia)',
            'date' => $event->date,
            'time' => $event->time,
            'color' => $event->color,
            'description' => $event->description,
        ]);

        return [
            'id' => (string) $duplicate->id,
            'title' => $duplicate->title,
            'date' => $duplicate->date->format('Y-m-d'),
            'time' => $duplicate->time,
            'color' => $duplicate->color,
            'description' => $duplicate->description,
        ];
    }
}
