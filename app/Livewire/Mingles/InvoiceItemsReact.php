<?php

namespace App\Livewire\Mingles;

use Ijpatricio\Mingle\Concerns\InteractsWithMingles;
use Livewire\Component;

class InvoiceItemsReact extends Component
{
    use InteractsWithMingles;

    public array $items = [];

    public function component(): string
    {
        return 'resources/js/Mingles/InvoiceItemsReact.jsx';
    }

    public function mingleData(): array
    {
        return [
            'items' => $this->items,
            'wire' => $this->getId(),
        ];
    }

    public function updateItems(array $items): void
    {
        $this->items = $items;
        $this->dispatch('items-updated', items: $items);
    }

    public function getItems(): array
    {
        return $this->items;
    }
}
