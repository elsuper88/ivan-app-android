<?php

namespace Database\Factories;

use App\Models\Invoice;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\InvoiceItem>
 */
class InvoiceItemFactory extends Factory
{
    public function definition(): array
    {
        $quantity = fake()->numberBetween(1, 10);
        $price = fake()->randomFloat(2, 5, 500);

        return [
            'invoice_id' => Invoice::factory(),
            'name' => fake()->words(3, true),
            'description' => fake()->optional()->sentence(),
            'quantity' => $quantity,
            'price' => $price,
            'weight' => fake()->optional()->randomFloat(2, 0.1, 50),
            'total' => $quantity * $price,
        ];
    }
}
