<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Article;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ArticleController extends Controller
{
    /**
     * Get all articles
     */
    /**
     * Get all articles
     */
    public function index(Request $request): JsonResponse
    {
        if ($request->query('mode') === 'admin') {
            return response()->json(Article::orderBy('date', 'desc')->get());
        }

        $lang = $request->header('Accept-Language', 'ar');
        $articles = Article::orderBy('date', 'desc')->get();

        $articles->transform(function ($article) use ($lang) {
            return $this->transformArticle($article, $lang);
        });

        return response()->json($articles);
    }

    /**
     * Get a single article
     */
    public function show(Request $request, $id): JsonResponse
    {
        $lang = $request->header('Accept-Language', 'ar');
        $article = Article::find($id);

        if (!$article) {
            return response()->json(['error' => 'Article not found'], 404);
        }

        return response()->json($this->transformArticle($article, $lang));
    }

    private function transformArticle($article, $lang)
    {
        if ($lang === 'en') {
            $article->title = $article->title_en ?? $article->title;
            $article->summary = $article->summary_en ?? $article->summary;
            $article->content = $article->content_en ?? $article->content;
            $article->category = $article->category_en ?? $article->category;
        }
        return $article;
    }

    /**
     * Create a new article
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'required|string',
            'title_en' => 'nullable|string',
            'category' => 'nullable|string',
            'category_en' => 'nullable|string',
            'icon' => 'nullable|string',
            'date' => 'nullable|string',
            'summary' => 'nullable|string',
            'summary_en' => 'nullable|string',
            'content' => 'nullable|string',
            'content_en' => 'nullable|string',
            'image_url' => 'nullable|string',
        ]);

        $article = Article::create($validated);

        return response()->json([
            'id' => $article->id,
            'message' => 'Article created successfully'
        ], 201);
    }

    /**
     * Update an article
     */
    public function update(Request $request, $id): JsonResponse
    {
        $article = Article::find($id);

        if (!$article) {
            return response()->json(['error' => 'Article not found'], 404);
        }

        $validated = $request->validate([
            'title' => 'sometimes|required|string',
            'title_en' => 'nullable|string',
            'category' => 'nullable|string',
            'category_en' => 'nullable|string',
            'icon' => 'nullable|string',
            'date' => 'nullable|string',
            'summary' => 'nullable|string',
            'summary_en' => 'nullable|string',
            'content' => 'nullable|string',
            'content_en' => 'nullable|string',
            'image_url' => 'nullable|string',
        ]);

        $article->update($validated);

        return response()->json(['message' => 'Article updated successfully']);
    }

    /**
     * Delete an article
     */
    public function destroy($id): JsonResponse
    {
        $article = Article::find($id);

        if (!$article) {
            return response()->json(['error' => 'Article not found'], 404);
        }

        $article->delete();

        return response()->json(['message' => 'Article deleted successfully']);
    }
}
