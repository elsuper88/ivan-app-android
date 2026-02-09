<x-dynamic-component :component="$getFieldWrapperView()" :field="$field">
    <div wire:ignore>
        @livewire(\App\Livewire\Mingles\ColorPickerReact::class, [
            'value' => $getState() ?? 'violet',
            'colors' => $getColors(),
        ], key($field->getStatePath() . '-color-picker'))
    </div>

    {{-- Hidden input to sync state with Filament form --}}
    <div
        x-data="{
            color: @js($getState() ?? 'violet'),
            init() {
                Livewire.on('color-updated', (event) => {
                    this.color = event.color;
                    $wire.set('{{ $getStatePath() }}', this.color);
                });
            }
        }"
    >
        <input type="hidden" name="{{ $getStatePath() }}" x-bind:value="color">
    </div>
</x-dynamic-component>
