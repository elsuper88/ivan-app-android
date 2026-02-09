<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // NativePHP only runs migrate --force, not db:seed.
        // Seed 2000 demo clients for performance testing.
        if (DB::table('clients')->count() > 0) {
            return;
        }

        $now = now();
        $clients = [];
        $firstNames = ['Juan', 'Maria', 'Carlos', 'Ana', 'Pedro', 'Laura', 'Miguel', 'Sofia', 'Jose', 'Carmen', 'Luis', 'Rosa', 'Fernando', 'Elena', 'Diego', 'Patricia', 'Andres', 'Monica', 'Ricardo', 'Lucia'];
        $lastNames = ['Garcia', 'Rodriguez', 'Martinez', 'Lopez', 'Hernandez', 'Gonzalez', 'Perez', 'Sanchez', 'Ramirez', 'Torres', 'Flores', 'Rivera', 'Gomez', 'Diaz', 'Cruz', 'Morales', 'Reyes', 'Gutierrez', 'Ortiz', 'Ramos'];
        $companies = ['TechCorp', 'DataSoft', 'CloudNine', 'WebPro', 'AppLab', 'NetSolutions', 'CodeBase', 'DigitalHub', 'SmartDev', 'InfoTech', 'CyberLogic', 'ProSystems', 'NovaTech', 'AlphaCode', 'ByteForce', 'PixelWorks', 'SyncLab', 'VortexIO', 'PrimeStack', 'CoreDev'];
        $domains = ['gmail.com', 'outlook.com', 'yahoo.com', 'hotmail.com', 'proton.me'];

        for ($i = 1; $i <= 2000; $i++) {
            $firstName = $firstNames[array_rand($firstNames)];
            $lastName = $lastNames[array_rand($lastNames)];
            $company = $companies[array_rand($companies)];
            $domain = $domains[array_rand($domains)];

            $clients[] = [
                'name' => "{$firstName} {$lastName}",
                'email' => strtolower("{$firstName}.{$lastName}.{$i}@{$domain}"),
                'phone' => '+1' . str_pad((string) random_int(2000000000, 9999999999), 10, '0', STR_PAD_LEFT),
                'company' => $company,
                'address' => "Calle {$i}, Ciudad",
                'notes' => "Cliente demo #{$i}",
                'created_at' => $now,
                'updated_at' => $now,
            ];

            // Insert in chunks of 500 for performance
            if (count($clients) === 500) {
                DB::table('clients')->insert($clients);
                $clients = [];
            }
        }

        if (count($clients) > 0) {
            DB::table('clients')->insert($clients);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::table('clients')->where('notes', 'like', 'Cliente demo #%')->delete();
    }
};
