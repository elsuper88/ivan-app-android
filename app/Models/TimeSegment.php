<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TimeSegment extends Model
{
    protected $fillable = [
        'time_entry_id',
        'start_time',
        'end_time',
        'duration',
    ];

    protected function casts(): array
    {
        return [
            'start_time' => 'datetime',
            'end_time' => 'datetime',
            'duration' => 'integer',
        ];
    }

    public function timeEntry(): BelongsTo
    {
        return $this->belongsTo(TimeEntry::class);
    }

    /**
     * Transform the model to API format for React component.
     */
    public function toApiFormat(): array
    {
        return [
            'id' => (string) $this->id,
            'startTime' => $this->start_time->toISOString(),
            'endTime' => $this->end_time?->toISOString(),
            'duration' => $this->duration,
        ];
    }
}
