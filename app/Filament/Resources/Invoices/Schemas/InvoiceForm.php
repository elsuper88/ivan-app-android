<?php

namespace App\Filament\Resources\Invoices\Schemas;

use App\Forms\Components\InvoiceItemsReactField;
use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;

class InvoiceForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Customer Information')
                    ->description('Enter the customer details for this invoice')
                    ->icon(Heroicon::User)
                    ->columns(2)
                    ->schema([
                        TextInput::make('customer_name')
                            ->label('Customer Name')
                            ->required()
                            ->maxLength(255)
                            ->placeholder('Enter customer name')
                            ->prefixIcon(Heroicon::User),
                        TextInput::make('customer_email')
                            ->label('Customer Email')
                            ->email()
                            ->maxLength(255)
                            ->placeholder('customer@example.com')
                            ->prefixIcon(Heroicon::Envelope),
                    ]),

                Section::make('Invoice Details')
                    ->description('Set dates and status for this invoice')
                    ->icon(Heroicon::DocumentText)
                    ->columns(3)
                    ->schema([
                        DatePicker::make('issue_date')
                            ->label('Issue Date')
                            ->required()
                            ->default(now())
                            ->native(false)
                            ->displayFormat('M d, Y')
                            ->prefixIcon(Heroicon::Calendar),
                        DatePicker::make('due_date')
                            ->label('Due Date')
                            ->native(false)
                            ->displayFormat('M d, Y')
                            ->prefixIcon(Heroicon::CalendarDays),
                        Select::make('status')
                            ->options([
                                'draft' => 'Draft',
                                'sent' => 'Sent',
                                'paid' => 'Paid',
                                'cancelled' => 'Cancelled',
                            ])
                            ->default('draft')
                            ->native(false)
                            ->prefixIcon(Heroicon::Flag),
                    ]),

                InvoiceItemsReactField::make('items_data')
                    ->label('')
                    ->columnSpanFull()
                    ->partiallyRenderAfterStateUpdated(),

                Section::make('Notes')
                    ->description('Additional notes for the customer')
                    ->icon(Heroicon::ChatBubbleBottomCenterText)
                    ->collapsible()
                    ->collapsed()
                    ->schema([
                        Textarea::make('notes')
                            ->label('')
                            ->placeholder('Add any additional notes or terms...')
                            ->rows(3)
                            ->columnSpanFull(),
                    ]),
            ]);
    }
}
