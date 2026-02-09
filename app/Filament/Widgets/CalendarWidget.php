<?php

namespace App\Filament\Widgets;

use Filament\Facades\Filament;
use Filament\Widgets\Widget;

class CalendarWidget extends Widget
{
    protected static ?int $sort = 0;

    protected string $view = 'filament.widgets.calendar-widget';

    protected int|string|array $columnSpan = [
        'default' => 'full',
        'lg' => 1,
    ];

    public static function canView(): bool
    {
        return Filament::auth()->check();
    }
}
