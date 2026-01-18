<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class QuestionOption extends Model
{
    protected $fillable = [
        'question_id',
        'option_value',
        'option_label',
        'option_label_en',
        'option_icon',
    ];

    public function question(): BelongsTo
    {
        return $this->belongsTo(Question::class);
    }
}
