<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('posts', function (Blueprint $table) {
            $table->string('to_whom')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // First, update NULL values to empty string
        DB::table('posts')->whereNull('to_whom')->update(['to_whom' => '']);

        // Then make the column NOT NULL
        Schema::table('posts', function (Blueprint $table) {
            $table->string('to_whom')->nullable(false)->change();
        });
    }
};
