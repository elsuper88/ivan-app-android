<?php

namespace App\Filament\Resources\Invoices\Pages;

use App\Filament\Resources\Invoices\InvoiceResource;
use App\Models\Invoice;
use Filament\Resources\Pages\CreateRecord;

class CreateInvoice extends CreateRecord
{
    protected static string $resource = InvoiceResource::class;

    protected function mutateFormDataBeforeCreate(array $data): array
    {
        $data['invoice_number'] = Invoice::generateInvoiceNumber();

        // Calculate totals from items
        $itemsData = $this->parseItemsData($data['items_data'] ?? null);
        $subtotal = collect($itemsData)->sum(fn ($item) => ($item['price'] ?? 0) * ($item['quantity'] ?? 1));
        $data['subtotal'] = $subtotal;
        $data['total'] = $subtotal + ($data['tax'] ?? 0);

        // Remove items_data from invoice data (handled separately)
        unset($data['items_data']);

        return $data;
    }

    protected function afterCreate(): void
    {
        $formData = $this->form->getRawState();
        $itemsData = $this->parseItemsData($formData['items_data'] ?? null);

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
