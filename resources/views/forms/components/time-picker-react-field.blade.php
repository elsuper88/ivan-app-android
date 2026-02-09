<x-dynamic-component :component="$getFieldWrapperView()" :field="$field">
    <div wire:ignore>
        @livewire(\App\Livewire\Mingles\TimePickerReact::class, [
            'value' => $getState(),
        ], key($field->getStatePath() . '-time-picker'))
    </div>

    {{-- Hidden input to sync state with Filament form --}}
    <div
        x-data="{
            time: @js($getState() ?? ''),
            init() {
                Livewire.on('time-updated', (event) => {
                    this.time = event.time ?? '';
                    $wire.set('{{ $getStatePath() }}', this.time || null);
                });
            }
        }"
    >
        <input type="hidden" name="{{ $getStatePath() }}" x-bind:value="time">
    </div>
</x-dynamic-component>
