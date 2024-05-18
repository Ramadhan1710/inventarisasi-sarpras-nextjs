import pengembalian_barangService from "@/services/pengembalian-barang";
import { NextRequest } from "next/server";

export const dynamic = 'force-dynamic' // defaults to auto

// getPengembalianBarang
export async function GET(request: NextRequest, { params }: { params: { pengembalian_barangId: string } }) {
  const data = await pengembalian_barangService.getPengembalianBarang(params.pengembalian_barangId);
  return new Response(JSON.stringify(data), {headers : { 'content-type': 'application/json' }});
}

// updatePengembalianBarang
export async function PATCH(request: NextRequest, { params }: { params: { pengembalian_barangId: string } }) {
  const data = await request.json();
  await pengembalian_barangService.updatePengembalianBarang(params.pengembalian_barangId, data);
  return new Response('Data berhasil diperbarui!', { status: 200 });
}

//deletePengembalianBarang
export async function DELETE(request: NextRequest, { params }: { params: { pengembalian_barangId: string } }) {
  await pengembalian_barangService.deletePengembalianBarang(params.pengembalian_barangId);
  return new Response('Data berhasil dihapus!', { status: 200 });
}