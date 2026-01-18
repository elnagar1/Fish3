<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Import all data from old database
        $this->call([
            ArticleSeeder::class,
            QuestionSeeder::class,
            SiteContentSeeder::class,
        ]);
    }
}
