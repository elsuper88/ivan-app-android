<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Invoice extends Model
{
    use HasFactory;

    protected $fillable = [
        'invoice_number',
        'customer_name',
        'customer_email',
        'notes',
        'subtotal',
        'tax',
        'total',
        'status',
        'issue_date',
        'due_date',
    ];

    protected $casts = [
        'issue_date' => 'date',
        'due_date' => 'date',
        'subtotal' => 'decimal:2',
        'tax' => 'decimal:2',
        'total' => 'decimal:2',
    ];

    public function items(): HasMany
    {
        return $this->hasMany(InvoiceItem::class);
    }

    public function calculateTotals(): void
    {
        $this->subtotal = $this->items->sum('total');
        $this->total = $this->subtotal + $this->tax;
        $this->save();
    }

    public static function generateInvoiceNumber(): string
    {
        $latest = self::latest()->first();
        $number = $latest ? intval(substr($latest->invoice_number, 4)) + 1 : 1;

        return 'INV-'.str_pad($number, 6, '0', STR_PAD_LEFT);
    }
}
