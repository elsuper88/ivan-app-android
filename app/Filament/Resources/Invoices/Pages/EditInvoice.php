<?php

namespace App\Filament\Resources\Invoices\Pages;

use App\Filament\Resources\Invoices\InvoiceResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditInvoice extends EditRecord
{
    protected static string $resource = InvoiceResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }

    protected function mutateFormDataBeforeFill(array $data): array
    {
        // Load existing items for the form
        $items = $this->record->items->map(fn ($item) => [
            'id' => (string) $item->id,
            'name' => $item->name,
            'description' => $item->description,
            'quantity' => $item->quantity,
            'price' => (float) $item->price,
            'weight' => $item->weight,
        ])->toArray();

        $data['items_data'] = $items;

        return $data;
    }

    protected function mutateFormDataBeforeSave(array $data): array
    {
        // Calculate totals from items
        $itemsData = $this->parseItemsData($data['items_data'] ?? null);
        $subtotal = collect($itemsData)->sum(fn ($item) => ($item['price'] ?? 0) * ($item['quantity'] ?? 1));
        $data['subtotal'] = $subtotal;
        $data['total'] = $subtotal + ($data['tax'] ?? 0);

        // Remove items_data from invoice data (handled separately)
        unset($data['items_data']);

        return $data;
    }

    protected function afterSave(): void
    {
        $formData = $this->form->getRawState();
        $itemsData = $this->parseItemsData($formData['items_data'] ?? null);

        // Delete existing items and recreate
        $this->record->items()->delete();

        foreach ($itemsData as $item) {
            $this->record->items()->create([
                'name' => $item['name'],
                'description' => $item['description'] ?? null,
                'quantity' => (int) ($item['quantity'] ?? 1),
                'price' => (float) ($item['price'] ?? 0),
                'weight' => $item['weight'] ?? null,
                'total' => (float) ($item['price'] ?? 0) * (int) ($item['quantity'] ?? 1),
            ]);
        }
    }

    protected function parseItemsData(mixed $itemsData): array
    {
        if (empty($itemsData)) {
            return [];
        }

        if (is_string($itemsData)) {
            $decoded = json_decode($itemsData, true);

            return is_array($decoded) ? $decoded : [];
        }

        return is_array($itemsData) ? $itemsData : [];
    }
}
