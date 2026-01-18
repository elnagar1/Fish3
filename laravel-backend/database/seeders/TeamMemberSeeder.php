<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\TeamMember;

class TeamMemberSeeder extends Seeder
{
    public function run(): void
    {
        $members = [
            [
                'name' => 'د. أحمد محمد',
                'position' => 'خبير استزراع سمكي',
                'bio' => 'أكثر من 15 عاماً من الخبرة في مجال الاستزراع السمكي والإدارة المستدامة للمزارع',
                'display_order' => 1
            ],
            [
                'name' => 'م. فاطمة علي',
                'position' => 'مهندسة جودة المياه',
                'bio' => 'متخصصة في تحليل جودة المياه وتطوير أنظمة الفلترة الحديثة',
                'display_order' => 2
            ],
            [
                'name' => 'د. محمود حسن',
                'position' => 'خبير تغذية الأسماك',
                'bio' => 'باحث في علوم التغذية وتطوير الأعلاف المتوازنة للأسماك',
                'display_order' => 3
            ]
        ];

        foreach ($members as $member) {
            TeamMember::create($member);
        }
    }
}
