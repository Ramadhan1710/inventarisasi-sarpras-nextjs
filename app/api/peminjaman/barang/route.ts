import peminjaman_barangService from "@/services/peminjaman-barang";
import { NextRequest } from "next/server";

export const dynamic = 'force-dynamic' // defaults to auto

// get allpeminjamanbarang
export async function GET(request: NextRequest) {
  const data = await peminjaman_barangService.getDaftarPeminjamanBarang();
  return new Response(JSON.stringify(data), {headers : { 'content-type': 'application/json' }});
}

// add peminjamanbarang
export async function POST(request: NextRequest) {
  const data = await request.json();
  await peminjaman_barangService.addPeminjamanBarang(data);
  return new Response('Data berhasil ditambahkan!', { status: 201 });
}