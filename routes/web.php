<?php

use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;
use App\Http\Controllers\TasksController;

// Route::inertia('/', 'welcome', [
//     'canRegister' => Features::enabled(Features::registration()),
// ])->name('home');

Route::get('/', [TasksController::class, 'index'])->name('tasks.index');
Route::post('/tasks', [TasksController::class, 'store'])->name('tasks.store');
Route::patch('/tasks/{task}', [TasksController::class, 'update'])->name('tasks.update');
Route::delete('/tasks/{task}', [TasksController::class, 'destroy'])->name('tasks.destroy');