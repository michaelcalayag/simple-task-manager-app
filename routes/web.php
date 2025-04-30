<?php

use App\Http\Controllers\SubTaskController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\TrashController;
use Illuminate\Console\View\Components\Task;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::resource('/task-manager',TaskController::class);
    Route::post('/task-manager/filter', [TaskController::class, 'filteredData'])->name('task-manager.filter');
    Route::put('/task-manager/{id}/updateStatus', [TaskController::class, 'updateStatus'])->name('task-manager.updateStatus');

    Route::resource('/subtask-manager',SubTaskController::class);
    Route::resource('/trash',TrashController::class);
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
