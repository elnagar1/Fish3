<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Article;
use App\Models\Consultation;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class StatsController extends Controller
{
    /**
     * Get site statistics
     */
    public function index(): JsonResponse
    {
        $stats = [
            'articlesCount' => Article::count(),
            'consultationsCount' => Consultation::count(),
            'todayConsultations' => Consultation::whereDate('created_at', today())->count(),
        ];

        return response()->json($stats);
    }
}
