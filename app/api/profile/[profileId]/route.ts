import profileService from "@/services/profile";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic' // defaults to auto

export async function GET(request: Request, { params }: { params: { profileId: string } }) {
    const profileId = params.profileId;
    const data = await profileService.getProfile(profileId);
    return NextResponse.json(data);
}
