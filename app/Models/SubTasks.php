<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class SubTasks extends Model
{
    use SoftDeletes;

    protected $fillable = ['title', 'description', 'status', 'task_id'];

    public function task()
    {
        return $this->belongsTo(Tasks::class);
    }
}
