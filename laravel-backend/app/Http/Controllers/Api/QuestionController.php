<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Question;
use App\Models\QuestionOption;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class QuestionController extends Controller
{
    /**
     * Get all questions with their options
     */
    public function index(Request $request): JsonResponse
    {
        if ($request->query('mode') === 'admin') {
            return response()->json(Question::with('options')->orderBy('question_number', 'asc')->get());
        }
        $lang = $request->header('Accept-Language', 'ar');

        $questions = Question::with('options')
            ->orderBy('question_number', 'asc')
            ->get()
            ->map(function ($question) use ($lang) {
                return [
                    'id' => $question->id,
                    'question_text' => ($lang === 'en' && $question->question_text_en) ? $question->question_text_en : $question->question_text,
                    'question_number' => $question->question_number,
                    'section' => ($lang === 'en' && $question->section_en) ? $question->section_en : $question->section,
                    'options' => $question->options->map(function ($option) use ($lang) {
                        return [
                            'id' => $option->id,
                            'question_id' => $option->question_id,
                            'option_value' => $option->option_value,
                            'option_label' => ($lang === 'en' && $option->option_label_en) ? $option->option_label_en : $option->option_label,
                            'option_icon' => $option->option_icon,
                        ];
                    }),
                ];
            });

        return response()->json($questions);
    }

    /**
     * Update a question and its options
     */
    public function update(Request $request, $id): JsonResponse
    {
        $question = Question::find($id);

        if (!$question) {
            return response()->json(['error' => 'Question not found'], 404);
        }

        $validated = $request->validate([
            'question_text' => 'sometimes|required|string',
            'question_text_en' => 'nullable|string',
            'section_en' => 'nullable|string',
            'options' => 'nullable|array',
            'options.*.option_value' => 'nullable|string',
            'options.*.option_label' => 'nullable|string',
            'options.*.option_label_en' => 'nullable|string',
            'options.*.option_icon' => 'nullable|string',
        ]);

        try {
            DB::beginTransaction();

            // Update question text
            if (isset($validated['question_text'])) {
                $question->fill(['question_text' => $validated['question_text']]);
            }
            if (isset($validated['question_text_en'])) {
                $question->fill(['question_text_en' => $validated['question_text_en']]);
            }
            if (isset($validated['section_en'])) {
                $question->fill(['section_en' => $validated['section_en']]);
            }
            $question->save();

            // Update options
            if (isset($validated['options'])) {
                // Delete existing options
                $question->options()->delete();

                // Create new options
                foreach ($validated['options'] as $option) {
                    $question->options()->create([
                        'option_value' => $option['option_value'] ?? null,
                        'option_label' => $option['option_label'] ?? null,
                        'option_label_en' => $option['option_label_en'] ?? null,
                        'option_icon' => $option['option_icon'] ?? null,
                    ]);
                }
            }

            DB::commit();

            return response()->json(['message' => 'Question updated successfully']);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
