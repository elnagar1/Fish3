<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\SiteContent;

class SiteContentSeeder extends Seeder
{
    public function run(): void
    {
        $this->command->info('Starting site content import from old database...');

        // Path to old SQLite database
        $oldDbPath = base_path('../database.sqlite');

        if (!file_exists($oldDbPath)) {
            $this->command->warn('Old database.sqlite not found at: ' . $oldDbPath);
            return;
        }

        // Connect to old database
        $oldDb = new \PDO('sqlite:' . $oldDbPath);

        // Get all site content from old database
        $stmt = $oldDb->query('SELECT * FROM site_content');
        $contents = $stmt->fetchAll(\PDO::FETCH_ASSOC);

        if (empty($contents)) {
            $this->command->warn('No site content found in old database');
            return;
        }

        $count = 0;
        foreach ($contents as $content) {
            try {
                SiteContent::updateOrCreate(
                    ['key' => $content['key']],
                    ['value' => $content['value'] ?? null]
                );
                $count++;
            } catch (\Exception $e) {
                $this->command->error('Error importing content: ' . $e->getMessage());
            }
        }

        $this->command->info("Successfully imported {$count} site content items!");
    }
}
