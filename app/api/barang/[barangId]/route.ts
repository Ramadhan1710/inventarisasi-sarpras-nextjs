import barangService from "@/services/barang";
import { NextRequest } from "next/server";

export const dynamic = 'force-dynamic' // defaults to auto

export async function GET(request: NextRequest, { params }: { params: { barangId: string } }) {
  const data = await barangService.getBarang(params.barangId);
  return new Response(JSON.stringify(data), {headers : { 'content-type': 'application/json' }});
}

export async function PUT(request: NextRequest, { params }: { params: { barangId: string } }) {
  const data = await request.json();
  await barangService.updateBarang(data, params.barangId);
  return new Response('Data berhasil diupdate!', { status: 200 });
}

export async function DELETE(request: NextRequest, { params }: { params: { barangId: string } }) {
  await barangService.deleteBarang(params.barangId);
  return new Response('Data berhasil dihapus!', { status: 200 });
}
 