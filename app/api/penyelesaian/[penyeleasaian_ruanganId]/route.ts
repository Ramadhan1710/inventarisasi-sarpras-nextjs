import penyelesaian_ruanganService from "@/services/penyelesaian-ruangan";
import { NextRequest } from "next/server";

export const dynamic = 'force-dynamic' // defaults to auto

// get detail penyelesaian ruangan
export async function GET(request: NextRequest, { params }: { params: { penyeleasaian_ruanganId: string } }) {
  const data = await penyelesaian_ruanganService.getPenyelesaianRuangan(params.penyeleasaian_ruanganId);
  return new Response(JSON.stringify(data), {headers : { 'content-type': 'application/json' }});
}

// update penyelesaian ruangan
export async function PUT(request: NextRequest, { params }: { params: { penyeleasaian_ruanganId: string } }) {
  const data = await request.json();
  await penyelesaian_ruanganService.updatePenyelesaianRuangan(data, params.penyeleasaian_ruanganId);
  return new Response('Data berhasil diupdate!', { status: 200 });
}

// delete penyelesaian ruangan
export async function DELETE(request: NextRequest, { params }: { params: { penyeleasaian_ruanganId: string } }) {
  await penyelesaian_ruanganService.deletePenyelesaianRuangan(params.penyeleasaian_ruanganId);
  return new Response('Data berhasil dihapus!', { status: 200 });
}