<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\TeamMember;
use Illuminate\Http\Request;

class TeamMemberController extends Controller
{
    public function index(Request $request)
    {
        if ($request->query('mode') === 'admin') {
            return response()->json(TeamMember::orderBy('display_order')->get());
        }

        $lang = $request->header('Accept-Language', 'ar');
        $members = TeamMember::orderBy('display_order')->get();

        $members->transform(function ($member) use ($lang) {
            if ($lang === 'en') {
                $member->name = $member->name_en ?? $member->name;
                $member->position = $member->position_en ?? $member->position;
                $member->bio = $member->bio_en ?? $member->bio;
            }
            return $member;
        });

        return response()->json($members);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'name_en' => 'nullable|string|max:255',
            'position' => 'required|string|max:255',
            'position_en' => 'nullable|string|max:255',
            'bio' => 'nullable|string',
            'bio_en' => 'nullable|string',
            'image_url' => 'nullable|string',
            'display_order' => 'nullable|integer'
        ]);

        $member = TeamMember::create($validated);
        return response()->json($member, 201);
    }

    public function update(Request $request, $id)
    {
        $member = TeamMember::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'name_en' => 'nullable|string|max:255',
            'position' => 'sometimes|required|string|max:255',
            'position_en' => 'nullable|string|max:255',
            'bio' => 'nullable|string',
            'bio_en' => 'nullable|string',
            'image_url' => 'nullable|string',
            'display_order' => 'nullable|integer'
        ]);

        $member->update($validated);
        return response()->json($member);
    }

    public function destroy($id)
    {
        $member = TeamMember::findOrFail($id);
        $member->delete();
        return response()->json(['message' => 'تم حذف العضو بنجاح']);
    }
}
