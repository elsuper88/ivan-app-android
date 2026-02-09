<?php

namespace App\Livewire\Mingles;

use Ijpatricio\Mingle\Concerns\InteractsWithMingles;
use Livewire\Component;

class ColorPickerReact extends Component
{
    use InteractsWithMingles;

    public string $value = 'violet';

    public array $colors = ['violet', 'blue', 'emerald', 'amber', 'rose'];

    public function component(): string
    {
        return 'resources/js/Mingles/ColorPickerReact.jsx';
    }

    public function mingleData(): array
    {
        return [
            'value' => $this->value,
            'colors' => $this->colors,
        ];
    }

    public function updateColor(string $color): void
    {
        $this->value = $color;
        $this->dispatch('color-updated', color: $color);
    }
}
