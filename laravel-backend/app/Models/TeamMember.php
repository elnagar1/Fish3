<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TeamMember extends Model
{
    protected $fillable = [
        'name',
        'name_en',
        'position',
        'position_en',
        'bio',
        'bio_en',
        'image_url',
        'display_order'
    ];

    protected $casts = [
        'display_order' => 'integer'
    ];
}
