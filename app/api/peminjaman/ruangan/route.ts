import peminjaman_ruanganService from "@/services/peminjaman-ruangan";
import { NextRequest } from "next/server";

export const dynamic = 'force-dynamic' // defaults to auto

//get all peminjamanruangan
export async function GET(request: NextRequest) {
  const data = await peminjaman_ruanganService.getDaftarPeminjamanRuangan();
  return new Response(JSON.stringify(data), {headers : { 'content-type': 'application/json' }});
}

//add peminjamanruangan
export async function POST(request: NextRequest) {
  const data = await request.json();
  await peminjaman_ruanganService.addPeminjamanRuangan(data);
  return new Response('Data berhasil ditambahkan!', { status: 201 });
}