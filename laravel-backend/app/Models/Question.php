<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Question extends Model
{
    protected $fillable = [
        'question_text',
        'question_text_en',
        'question_number',
        'section',
        'section_en',
    ];

    public function options(): HasMany
    {
        return $this->hasMany(QuestionOption::class);
    }
}
