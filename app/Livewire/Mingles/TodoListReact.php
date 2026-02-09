<?php

namespace App\Livewire\Mingles;

use App\Models\Todo;
use Filament\Facades\Filament;
use Ijpatricio\Mingle\Concerns\InteractsWithMingles;
use Ijpatricio\Mingle\Contracts\HasMingles;
use Livewire\Component;

class TodoListReact extends Component implements HasMingles
{
    use InteractsWithMingles;

    public function component(): string
    {
        return 'resources/js/Mingles/TodoListReact.jsx';
    }

    public function mingleData(): array
    {
        return [
            'todos' => $this->getTodos(),
        ];
    }

    protected function getTodos(): array
    {
        $user = Filament::auth()->user();

        if (! $user) {
            return [];
        }

        return $user->todos()
            ->orderBy('sort_order')
            ->get()
            ->map(fn (Todo $todo) => [
                'id' => (string) $todo->id,
                'text' => $todo->text,
                'completed' => $todo->completed,
            ])
            ->toArray();
    }

    public function addTodo(string $tempId, string $text): ?string
    {
        $this->skipRender();

        $user = Filament::auth()->user();

        if (! $user || empty(trim($text))) {
            return null;
        }

        $maxOrder = $user->todos()->max('sort_order') ?? 0;

        $todo = $user->todos()->create([
            'text' => trim($text),
            'completed' => false,
            'sort_order' => $maxOrder + 1,
        ]);

        // Return real ID so React can update the temp ID
        return (string) $todo->id;
    }

    public function toggleTodo(string $id): void
    {
        $this->skipRender();

        $user = Filament::auth()->user();
        $todo = $user?->todos()->find($id);

        if ($todo) {
            $todo->update(['completed' => ! $todo->completed]);
        }
    }

    public function updateTodo(string $id, string $text): void
    {
        $this->skipRender();

        $user = Filament::auth()->user();
        $todo = $user?->todos()->find($id);

        if ($todo && ! empty(trim($text))) {
            $todo->update(['text' => trim($text)]);
        }
    }

    public function deleteTodo(string $id): void
    {
        $this->skipRender();

        $user = Filament::auth()->user();
        $todo = $user?->todos()->find($id);

        $todo?->delete();
    }

    public function reorderTodos(array $orderedIds): void
    {
        $this->skipRender();

        $user = Filament::auth()->user();

        if (! $user) {
            return;
        }

        foreach ($orderedIds as $index => $id) {
            $user->todos()->where('id', $id)->update(['sort_order' => $index]);
        }
    }
}
