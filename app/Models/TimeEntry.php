<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class TimeEntry extends Model
{
    protected $fillable = [
        'user_id',
        'timekeeper_client_id',
        'description',
        'start_time',
        'end_time',
        'duration',
        'is_running',
        'is_paused',
    ];

    protected function casts(): array
    {
        return [
            'start_time' => 'datetime',
            'end_time' => 'datetime',
            'duration' => 'integer',
            'is_running' => 'boolean',
            'is_paused' => 'boolean',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function client(): BelongsTo
    {
        return $this->belongsTo(TimekeeperClient::class, 'timekeeper_client_id');
    }

    public function segments(): HasMany
    {
        return $this->hasMany(TimeSegment::class)->orderBy('start_time');
    }

    /**
     * Transform the model to API format for React component.
     */
    public function toApiFormat(): array
    {
        return [
            'id' => (string) $this->id,
            'clientId' => (string) $this->timekeeper_client_id,
            'clientName' => $this->client->name,
            'description' => $this->description ?? '',
            'startTime' => $this->start_time->toISOString(),
            'endTime' => $this->end_time?->toISOString(),
            'duration' => $this->duration,
            'isRunning' => $this->is_running,
            'isPaused' => $this->is_paused,
            'segments' => $this->segments->map(fn (TimeSegment $segment) => $segment->toApiFormat())->toArray(),
        ];
    }
}
