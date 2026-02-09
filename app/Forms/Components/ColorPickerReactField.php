<?php

namespace App\Forms\Components;

use Filament\Forms\Components\Field;

class ColorPickerReactField extends Field
{
    protected string $view = 'forms.components.color-picker-react-field';

    protected array $colors = ['violet', 'blue', 'emerald', 'amber', 'rose'];

    protected function setUp(): void
    {
        parent::setUp();

        $this->default('violet');

        $this->dehydrateStateUsing(function ($state) {
            return $state ?? 'violet';
        });
    }

    public function colors(array $colors): static
    {
        $this->colors = $colors;

        return $this;
    }

    public function getColors(): array
    {
        return $this->colors;
    }
}
