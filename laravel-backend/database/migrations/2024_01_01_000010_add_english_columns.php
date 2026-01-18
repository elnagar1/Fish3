<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('articles', function (Blueprint $table) {
            $table->string('title_en')->nullable()->after('title');
            $table->text('summary_en')->nullable()->after('summary');
            $table->longText('content_en')->nullable()->after('content');
            $table->string('category_en')->nullable()->after('category');
        });

        Schema::table('questions', function (Blueprint $table) {
            $table->text('question_text_en')->nullable()->after('question_text');
            $table->string('section_en')->nullable()->after('section');
        });

        Schema::table('question_options', function (Blueprint $table) {
            $table->string('option_label_en')->nullable()->after('option_label');
        });

        Schema::table('site_contents', function (Blueprint $table) {
            $table->longText('value_en')->nullable()->after('value');
        });

        Schema::table('team_members', function (Blueprint $table) {
            $table->string('name_en')->nullable()->after('name');
            $table->string('position_en')->nullable()->after('position');
            $table->text('bio_en')->nullable()->after('bio');
        });
    }

    public function down(): void
    {
        Schema::table('articles', function (Blueprint $table) {
            $table->dropColumn(['title_en', 'summary_en', 'content_en', 'category_en']);
        });

        Schema::table('questions', function (Blueprint $table) {
            $table->dropColumn(['question_text_en', 'section_en']);
        });

        Schema::table('question_options', function (Blueprint $table) {
            $table->dropColumn(['option_label_en']);
        });

        Schema::table('site_contents', function (Blueprint $table) {
            $table->dropColumn(['value_en']);
        });

        Schema::table('team_members', function (Blueprint $table) {
            $table->dropColumn(['name_en', 'position_en', 'bio_en']);
        });
    }
};
