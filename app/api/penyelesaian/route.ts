import penyelesaian_ruanganService from "@/services/penyelesaian-ruangan";
import { NextRequest } from "next/server";

export const dynamic = 'force-dynamic' // defaults to auto

// get all penyelesaianruangan
export async function GET(request: NextRequest) {
  const data = await penyelesaian_ruanganService.getDaftarPenyelesaianRuangan();
  return new Response(JSON.stringify(data), {headers : { 'content-type': 'application/json' }});
}

// add penyelesaianruangan
export async function POST(request: NextRequest) {
  const data = await request.json();
  await penyelesaian_ruanganService.addPenyelesaianRuangan(data);
  return new Response('Data berhasil ditambahkan!', { status: 201 });
}
