<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SiteContent;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class SiteContentController extends Controller
{
    /**
     * Get all site content
     */
    public function index(Request $request): JsonResponse
    {
        if ($request->query('mode') === 'admin') {
            return response()->json(SiteContent::all());
        }

        $lang = $request->header('Accept-Language', 'ar');
        $contents = SiteContent::all();
        $result = [];

        foreach ($contents as $content) {
            if ($lang === 'en' && !empty($content->value_en)) {
                $result[$content->key] = $content->value_en;
            } else {
                $result[$content->key] = $content->value;
            }
        }

        return response()->json($result);
    }

    /**
     * Update or create site content
     */
    public function update(Request $request, $key): JsonResponse
    {
        // Log incoming data for debugging
        \Log::info("Updating content for key: {$key}", [
            'request_data' => $request->all()
        ]);

        $validated = $request->validate([
            'value' => 'nullable|string',
            'value_en' => 'nullable|string',
        ]);

        // Build update data - include both fields
        $data = [
            'value' => $validated['value'] ?? null,
            'value_en' => $validated['value_en'] ?? null,
        ];

        \Log::info("Saving to database:", $data);

        SiteContent::updateOrCreate(
            ['key' => $key],
            $data
        );

        return response()->json(['message' => 'Content updated successfully']);
    }
}
