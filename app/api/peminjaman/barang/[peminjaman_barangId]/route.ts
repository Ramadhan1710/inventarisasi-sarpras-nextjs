import peminjaman_barangService from "@/services/peminjaman-barang";
import { NextRequest } from "next/server";

export const dynamic = 'force-dynamic' // defaults to auto

// getPeminjamanBarang
export async function GET(request: NextRequest, { params }: { params: { peminjaman_barangId: string } }) {
  const data = await peminjaman_barangService.getPeminjamanBarang(params.peminjaman_barangId);
  return new Response(JSON.stringify(data), {headers : { 'content-type': 'application/json' }});
}

// updatePeminjamanBarang
export async function PUT(request: NextRequest, { params }: { params: { peminjaman_barangId: string } }) {
  const data = await request.json();
  await peminjaman_barangService.updatePeminjamanBarang(data, params.peminjaman_barangId);
  return new Response('Data berhasil diupdate!', { status: 200 });
}

//deletePeminjamanBarang
export async function DELETE(request: NextRequest, { params }: { params: { peminjaman_barangId: string } }) {
  await peminjaman_barangService.deletePeminjamanBarang(params.peminjaman_barangId);
  return new Response('Data berhasil dihapus!', { status: 200 });
}