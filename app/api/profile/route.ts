import profileService from "@/services/user";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = 'force-dynamic' // defaults to auto

export async function GET(request: NextRequest) {
    const data = await profileService.getListProfile();
    return new Response(JSON.stringify(data), {headers : { 'content-type': 'application/json' }});
}