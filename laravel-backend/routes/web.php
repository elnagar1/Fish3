<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\File;

// Serve main pages
Route::get('/', function () {
    return File::get(public_path('index.html'));
});

Route::get('/admin', function () {
    return File::get(public_path('admin.html'));
});

Route::get('/articles', function () {
    return File::get(public_path('articles.html'));
});

Route::get('/article', function () {
    return File::get(public_path('article.html'));
});

Route::get('/tools', function () {
    return File::get(public_path('tools.html'));
});
