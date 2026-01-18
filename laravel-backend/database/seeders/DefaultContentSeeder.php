<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\SiteContent;

class DefaultContentSeeder extends Seeder
{
    public function run(): void
    {
        $defaultContent = [
            [
                'key' => 'site_title',
                'value' => 'مستشار مزارع الأسماك',
                'value_en' => 'Fish Farm Consultant'
            ],
            [
                'key' => 'hero_main_title',
                'value' => 'استشارات ذكية',
                'value_en' => 'Smart Consultant'
            ],
            [
                'key' => 'hero_sub_title',
                'value' => 'لمزرعتك السمكية',
                'value_en' => 'For Your Fish Farm'
            ],
            [
                'key' => 'hero_description',
                'value' => 'احصل على نصائح وتوجيهات متخصصة من خبير افتراضي مدعوم بالذكاء الاصطناعي. أجب على بعض الأسئلة البسيطة واحصل على استشارة مفصلة لتحسين إنتاجية مزرعتك.',
                'value_en' => 'Get specialized advice and guidance from an AI-powered virtual expert. Answer a few simple questions and receive a detailed consultation to improve your farm productivity.'
            ],
            [
                'key' => 'hero_button_text',
                'value' => 'ابدأ الاستشارة الآن',
                'value_en' => 'Start Consultation Now'
            ],
            // Team Section
            [
                'key' => 'section_about_title',
                'value' => 'فريق مستشار مزارع الأسماك',
                'value_en' => 'Fish Farm Consultant Team'
            ],
            [
                'key' => 'section_about_subtitle',
                'value' => '',
                'value_en' => ''
            ],
            // Footer Rights
            [
                'key' => 'footer_rights',
                'value' => '',
                'value_en' => ''
            ],
        ];

        foreach ($defaultContent as $content) {
            SiteContent::updateOrCreate(
                ['key' => $content['key']],
                [
                    'value' => $content['value'],
                    'value_en' => $content['value_en']
                ]
            );
        }

        $this->command->info('✅ Default site content added successfully!');
    }
}
