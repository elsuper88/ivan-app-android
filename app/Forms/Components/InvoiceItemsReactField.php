<?php

namespace App\Forms\Components;

use Filament\Forms\Components\Field;

class InvoiceItemsReactField extends Field
{
    protected string $view = 'forms.components.invoice-items-react-field';

    protected function setUp(): void
    {
        parent::setUp();

        $this->default([]);

        $this->dehydrateStateUsing(function ($state) {
            if (is_string($state)) {
                return json_decode($state, true) ?? [];
            }

            return $state ?? [];
        });

        $this->afterStateHydrated(function (InvoiceItemsReactField $component, $state) {
            if (is_string($state)) {
                $component->state(json_decode($state, true) ?? []);
            }
        });
    }

    public function getItems(): array
    {
        $state = $this->getState();

        if (is_string($state)) {
            return json_decode($state, true) ?? [];
        }

        return $state ?? [];
    }

    public function calculateTotal(): float
    {
        $items = $this->getItems();

        return collect($items)->sum(function ($item) {
            return ($item['quantity'] ?? 1) * ($item['price'] ?? 0);
        });
    }
}
