<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Question;
use App\Models\QuestionOption;

class QuestionSeeder extends Seeder
{
    public function run(): void
    {
        $this->command->info('Starting questions import from old database...');

        // Path to old SQLite database
        $oldDbPath = base_path('../database.sqlite');

        if (!file_exists($oldDbPath)) {
            $this->command->warn('Old database.sqlite not found at: ' . $oldDbPath);
            return;
        }

        // Connect to old database
        $oldDb = new \PDO('sqlite:' . $oldDbPath);

        // Get all questions from old database
        $stmt = $oldDb->query('SELECT * FROM questions ORDER BY question_number ASC');
        $questions = $stmt->fetchAll(\PDO::FETCH_ASSOC);

        if (empty($questions)) {
            $this->command->warn('No questions found in old database');
            return;
        }

        $questionCount = 0;
        $optionCount = 0;

        foreach ($questions as $q) {
            try {
                // Create question
                $question = Question::create([
                    'question_text' => $q['question_text'] ?? null,
                    'question_number' => $q['question_number'] ?? null,
                    'section' => $q['section'] ?? null,
                ]);
                $questionCount++;

                // Get options for this question
                $optStmt = $oldDb->prepare('SELECT * FROM question_options WHERE question_id = ?');
                $optStmt->execute([$q['id']]);
                $options = $optStmt->fetchAll(\PDO::FETCH_ASSOC);

                foreach ($options as $opt) {
                    QuestionOption::create([
                        'question_id' => $question->id,
                        'option_value' => $opt['option_value'] ?? null,
                        'option_label' => $opt['option_label'] ?? null,
                        'option_icon' => $opt['option_icon'] ?? null,
                    ]);
                    $optionCount++;
                }
            } catch (\Exception $e) {
                $this->command->error('Error importing question: ' . $e->getMessage());
            }
        }

        $this->command->info("Successfully imported {$questionCount} questions with {$optionCount} options!");
    }
}
