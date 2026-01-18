<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ArticleController;
use App\Http\Controllers\Api\QuestionController;
use App\Http\Controllers\Api\ConsultationController;
use App\Http\Controllers\Api\SiteContentController;
use App\Http\Controllers\Api\StatsController;
use App\Http\Controllers\Api\TeamMemberController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Fish Farm Consultant API Routes
|
*/

// Articles API
Route::get('/articles', [ArticleController::class, 'index']);
Route::get('/articles/{id}', [ArticleController::class, 'show']);
Route::post('/articles', [ArticleController::class, 'store']);
Route::put('/articles/{id}', [ArticleController::class, 'update']);
Route::delete('/articles/{id}', [ArticleController::class, 'destroy']);

// Questions API
Route::get('/questions', [QuestionController::class, 'index']);
Route::put('/questions/{id}', [QuestionController::class, 'update']);

// Consultations API
Route::get('/consultations', [ConsultationController::class, 'index']);
Route::post('/consultations', [ConsultationController::class, 'store']);

// Site Content API
Route::get('/content', [SiteContentController::class, 'index']);
Route::put('/content/{key}', [SiteContentController::class, 'update']);

// Team Members API
Route::get('/team', [TeamMemberController::class, 'index']);
Route::post('/team', [TeamMemberController::class, 'store']);
Route::put('/team/{id}', [TeamMemberController::class, 'update']);
Route::delete('/team/{id}', [TeamMemberController::class, 'destroy']);

// Categories API
Route::get('/categories', [\App\Http\Controllers\CategoryController::class, 'index']);
Route::post('/categories', [\App\Http\Controllers\CategoryController::class, 'store']);
Route::delete('/categories/{id}', [\App\Http\Controllers\CategoryController::class, 'destroy']);

// Stats API
Route::get('/stats', [StatsController::class, 'index']);

// Health Check
Route::get('/health', function () {
    return response()->json(['status' => 'OK']);
});
