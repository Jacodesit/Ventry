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
        Schema::create('feedback', function (Blueprint $table) {
            $table->id();
            $table->string('nickname')->default('Anonymous');
            $table->unsignedTinyInteger('rating');
            $table->enum('experience_type', ['bug', 'suggestion', 'general_feedback', 'feature_request'])->default('general_feedback');
            $table->text('feedback_message');
            $table->string('ip_address')->nullable();
            $table->boolean('would_recommend')->nullable();
            $table->index('experience_type');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('feedback');
    }
};
