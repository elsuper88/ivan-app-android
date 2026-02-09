<?php

namespace App\Forms\Components;

use Filament\Forms\Components\Field;

class TimePickerReactField extends Field
{
    protected string $view = 'forms.components.time-picker-react-field';

    protected function setUp(): void
    {
        parent::setUp();

        $this->default(null);

        $this->dehydrateStateUsing(function ($state) {
            if (empty($state)) {
                return null;
            }

            return $state;
        });
    }
}
