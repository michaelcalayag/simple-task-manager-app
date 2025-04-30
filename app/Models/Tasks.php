<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Tasks extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'title',
        'description',
        'status',
        'due_date',
        'user_id',
        'image',
        'priority'
    ];

    public function images()
    {
        return $this->hasMany(TaskImage::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }


}
