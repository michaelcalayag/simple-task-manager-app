<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('tasks', function (Blueprint $table) {
            $table->id(); // Primary Key
            $table->string('title'); // Task title
            $table->text('description')->nullable(); // Optional task description
            $table->enum('status', ['draft','publish','to-do', 'in-progress', 'done'])->default('draft'); // Task status
            $table->timestamp('due_date')->nullable(); // Due date for the task
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('cascade'); // User association
            $table->string('image')->nullable(); // Optional image path
            $table->string('priority')->default('low'); // Task priority
            $table->timestamps(); // Created at & Updated at
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tasks');
    }
};
