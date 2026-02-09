{{-- Custom view for CalendarReact with Filament actions support --}}
<div>
    {{-- Mingle container for React component --}}
    <div
        x-init="
            window.Mingle.Elements['{{ $this->component() }}']
                .boot(
                    '{{ $this->mingleId }}',
                    '{{ $_instance->getId() }}',
                )
        "
    >
        <div id="{{ $this->mingleId }}-container" wire:ignore x-ignore>
            <div
                id="{{ $this->mingleId }}"
                data-mingle-data="{{ json_encode($this->mingleData()) }}"
            ></div>
        </div>
    </div>

    {{-- Filament actions modal container --}}
    <x-filament-actions::modals />
</div>
