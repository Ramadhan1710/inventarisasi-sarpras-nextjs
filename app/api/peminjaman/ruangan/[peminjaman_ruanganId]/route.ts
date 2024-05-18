import peminjaman_ruanganService from "@/services/peminjaman-ruangan";
import { NextRequest } from "next/server";

export const dynamic = 'force-dynamic' // defaults to auto

// get detail peminjaman barang
export async function GET(request: NextRequest, { params }: { params: { peminjaman_ruanganId: string } }) {
  const data = await peminjaman_ruanganService.getPeminjamanRuangan(params.peminjaman_ruanganId);
  return new Response(JSON.stringify(data), {headers : { 'content-type': 'application/json' }});
}

// update peminjaman ruangan
export async function PUT(request: NextRequest, { params }: { params: { peminjaman_ruanganId: string } }) {
  const data = await request.json();
  await peminjaman_ruanganService.updatePeminjamanRuangan(data, params.peminjaman_ruanganId);
  return new Response('Data berhasil diupdate!', { status: 200 });
}

// delete peminjaman ruangan
export async function DELETE(request: NextRequest, { params }: { params: { peminjaman_ruanganId: string } }) {
  await peminjaman_ruanganService.deletePeminjamanRuangan(params.peminjaman_ruanganId);
  return new Response('Data berhasil dihapus!', { status: 200 });
}
