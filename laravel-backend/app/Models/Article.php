<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Article extends Model
{
    protected $fillable = [
        'title',
        'title_en',
        'category',
        'category_en',
        'icon',
        'date',
        'summary',
        'summary_en',
        'content',
        'content_en',
        'image_url',
    ];
}
