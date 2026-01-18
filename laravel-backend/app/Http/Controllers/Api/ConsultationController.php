<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Consultation;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ConsultationController extends Controller
{
    /**
     * Get consultations
     */
    public function index(Request $request): JsonResponse
    {
        $limit = $request->query('limit', 50);

        $consultations = Consultation::orderBy('created_at', 'desc')
            ->limit($limit)
            ->get();

        return response()->json($consultations);
    }

    /**
     * Create a new consultation
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'answers' => 'nullable|array',
            'ai_response' => 'nullable|string',
            'provider' => 'nullable|string',
        ]);

        $consultation = Consultation::create($validated);

        return response()->json([
            'id' => $consultation->id,
            'message' => 'Consultation saved'
        ], 201);
    }
}
