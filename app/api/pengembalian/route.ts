import pengembalian_barangService from "@/services/pengembalian-barang";
import { NextRequest } from "next/server";

export const dynamic = 'force-dynamic'

// get all pengembalianbarang
export async function GET(request: NextRequest) {
  const data = await pengembalian_barangService.getDaftarPengembalianBarang();
  return new Response(JSON.stringify(data), {headers : { 'content-type': 'application/json' }});
}

// add pengembalianbarang
export async function POST(request: NextRequest) {
  const data = await request.json();
  await pengembalian_barangService.addPengembalianBarang(data);
  return new Response('Data berhasil ditambahkan!', { status: 201 });
}