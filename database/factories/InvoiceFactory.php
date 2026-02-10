<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Invoice>
 */
class InvoiceFactory extends Factory
{
    public function definition(): array
    {
        return [
            'invoice_number' => 'INV-'.str_pad(fake()->unique()->numberBetween(1, 999999), 6, '0', STR_PAD_LEFT),
            'customer_name' => fake()->name(),
            'customer_email' => fake()->safeEmail(),
            'notes' => fake()->optional()->sentence(),
            'subtotal' => 0,
            'tax' => 0,
            'total' => 0,
            'status' => fake()->randomElement(['draft', 'sent', 'paid', 'cancelled']),
            'issue_date' => fake()->date(),
            'due_date' => fake()->optional()->date(),
        ];
    }

    public function draft(): static
    {
        return $this->state(['status' => 'draft']);
    }

    public function paid(): static
    {
        return $this->state(['status' => 'paid']);
    }
}
