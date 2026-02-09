<x-dynamic-component :component="$getFieldWrapperView()" :field="$field">
    <div wire:ignore>
        @livewire(\App\Livewire\Mingles\InvoiceItemsReact::class, [
            'items' => $getState() ?? []
        ], key($field->getStatePath()))
    </div>

    {{-- Hidden input to sync state with Filament form --}}
    <div
        x-data="{
            items: @js($getState() ?? []),
            init() {
                Livewire.on('items-updated', (event) => {
                    this.items = event.items;
                    $wire.set('{{ $getStatePath() }}', JSON.stringify(this.items));
                });
            }
        }"
    >
        <input type="hidden" name="{{ $getStatePath() }}" x-bind:value="JSON.stringify(items)">
    </div>
</x-dynamic-component>
