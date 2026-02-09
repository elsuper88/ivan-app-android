<?php

namespace App\Livewire\Mingles;

use Ijpatricio\Mingle\Concerns\InteractsWithMingles;
use Livewire\Component;

class TimePickerReact extends Component
{
    use InteractsWithMingles;

    public ?string $value = null;

    public function component(): string
    {
        return 'resources/js/Mingles/TimePickerReact.jsx';
    }

    public function mingleData(): array
    {
        return [
            'value' => $this->value,
        ];
    }

    public function updateTime(?string $time): void
    {
        $this->value = $time ?: null;
        $this->dispatch('time-updated', time: $this->value);
    }
}
