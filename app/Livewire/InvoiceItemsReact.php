<?php

namespace App\Livewire;

use Ijpatricio\Mingle\Concerns\InteractsWithMingles;
use Ijpatricio\Mingle\Contracts\HasMingles;
use Livewire\Attributes\Modelable;
use Livewire\Component;

class InvoiceItemsReact extends Component implements HasMingles
{
    use InteractsWithMingles;

    #[Modelable]
    public array $items = [];

    public function component(): string
    {
        return 'resources/js/Mingles/InvoiceItemsReact.jsx';
    }

    public function mingleData(): array
    {
        return [
            'items' => $this->items,
        ];
    }

    public function updateItems(array $items): void
    {
        $this->items = $items;
        $this->dispatch('items-updated', items: $items);
    }

    public function getTotal(): float
    {
        return collect($this->items)->sum(fn ($item) => ($item['price'] ?? 0) * ($item['quantity'] ?? 1));
    }
}
