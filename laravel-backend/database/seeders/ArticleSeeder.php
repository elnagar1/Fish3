<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Article;
use Illuminate\Support\Facades\DB;

class ArticleSeeder extends Seeder
{
    public function run(): void
    {
        $this->command->info('Starting article import from old database...');

        // Path to old SQLite database
        $oldDbPath = base_path('../database.sqlite');

        if (!file_exists($oldDbPath)) {
            $this->command->warn('Old database.sqlite not found at: ' . $oldDbPath);
            return;
        }

        // Connect to old database
        $oldDb = new \PDO('sqlite:' . $oldDbPath);

        // Get all articles from old database
        $stmt = $oldDb->query('SELECT * FROM articles');
        $articles = $stmt->fetchAll(\PDO::FETCH_ASSOC);

        if (empty($articles)) {
            $this->command->warn('No articles found in old database');
            return;
        }

        $count = 0;
        foreach ($articles as $article) {
            try {
                Article::create([
                    'title' => $article['title'] ?? null,
                    'category' => $article['category'] ?? null,
                    'icon' => $article['icon'] ?? null,
                    'date' => $article['date'] ?? null,
                    'summary' => $article['summary'] ?? null,
                    'content' => $article['content'] ?? null,
                    'image_url' => $article['image_url'] ?? null,
                ]);
                $count++;
            } catch (\Exception $e) {
                $this->command->error('Error importing article: ' . $e->getMessage());
            }
        }

        $this->command->info("Successfully imported {$count} articles!");
    }
}
