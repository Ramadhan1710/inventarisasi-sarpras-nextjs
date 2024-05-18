import ruanganService from "@/services/ruangan";
import { NextRequest } from "next/server";

export const dynamic = 'force-dynamic' // defaults to auto

// get all ruangan
export async function GET(request: NextRequest) {
  const data = await ruanganService.getDaftarRuangan();
  return new Response(JSON.stringify(data), {headers : { 'content-type': 'application/json' }});
}

// add ruangan
export async function POST(request: NextRequest) {
  const data = await request.json();
  await ruanganService.addRuangan(data);
  return new Response('Data berhasil ditambahkan!', { status: 201 });
}