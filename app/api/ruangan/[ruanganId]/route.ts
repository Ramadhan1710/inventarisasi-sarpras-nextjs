import ruanganService from "@/services/ruangan";
import { NextRequest } from "next/server";

export const dynamic = 'force-dynamic' // defaults to auto

// get ruangan
export async function GET(request: NextRequest, { params }: any) {
  const data = await ruanganService.getRuangan(params.ruanganId);
  return new Response(JSON.stringify(data), {headers : { 'content-type': 'application/json' }});
}

// update ruangan
export async function PUT(request: NextRequest, { params }: any) {
  const data = await request.json();
  await ruanganService.updateRuangan(data, params.ruanganId);
  return new Response('Data berhasil diupdate!', { status: 200 });
}

// delete ruangan
export async function DELETE(request: NextRequest, { params }: any) {
  await ruanganService.deleteRuangan(params.ruanganId);
  return new Response('Data berhasil dihapus!', { status: 200 });
}