<?php

namespace App\Filament\Resources\Clients\Schemas;

use Filament\Actions\Action;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class ClientForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Informacion del cliente')
                    ->columns(2)
                    ->schema([
                        TextInput::make('name')
                            ->required()
                            ->afterStateUpdatedJs(<<<'JS'
                                $set('email', ($state ?? '').replaceAll(' ', '.').toLowerCase() + '@example.com')
                            JS),

                        TextInput::make('email')
                            ->label('Email address')
                            ->email(),

                        TextInput::make('phone')
                            ->tel(),

                        TextInput::make('company'),
                    ]),

                Section::make('Tipo de cliente')
                    ->columns(2)
                    ->schema([
                        Select::make('client_type')
                            ->label('Tipo')
                            ->options([
                                'person' => 'Persona',
                                'company' => 'Empresa',
                            ])
                            ->default('person')
                            ->dehydrated(false)
                            ->afterStateUpdatedJs(<<<'JS'
                                if ($state === 'company') {
                                    $set('notes', 'Cliente corporativo');
                                } else {
                                    $set('notes', '');
                                }
                            JS),

                        // visibleJs: solo visible si tipo es empresa
                        TextInput::make('tax_id')
                            ->label('RNC / Tax ID')
                            ->dehydrated(false)
                            ->visibleJs(<<<'JS'
                                $get('client_type') === 'company'
                            JS),

                        // hiddenJs: oculto si tipo es empresa
                        Toggle::make('is_vip')
                            ->label('Cliente VIP')
                            ->dehydrated(false)
                            ->hiddenJs(<<<'JS'
                                $get('client_type') === 'company'
                            JS),
                    ]),

                Section::make('Detalles')
                    ->schema([
                        Textarea::make('address')
                            ->columnSpanFull(),

                        Textarea::make('notes')
                            ->columnSpanFull()
                            ->live()
                            ->partiallyRenderAfterStateUpdated()
                            ->belowContent(function ($state): ?string {
                                return filled($state) ? "Vista previa: {$state}" : null;
                            }),
                    ]),

                Section::make('Telefonos')
                    ->schema([
                        Repeater::make('phones')
                            ->relationship()
                            ->schema([
                                TextInput::make('number')
                                    ->label('Numero')
                                    ->tel()
                                    ->required(),
                                Select::make('label')
                                    ->label('Tipo')
                                    ->options([
                                        'mobile' => 'Movil',
                                        'work' => 'Trabajo',
                                        'home' => 'Casa',
                                        'fax' => 'Fax',
                                    ])
                                    ->default('mobile')
                                    ->required(),
                            ])
                            ->columns(2)
                            ->defaultItems(0)
                            ->addActionLabel('Agregar telefono')
                            ->collapsible()
                            ->columnSpanFull(),
                    ]),
            ]);
    }
}
