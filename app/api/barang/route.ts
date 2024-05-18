import barangService from "@/services/barang";
import { NextRequest } from "next/server";

export const dynamic = 'force-dynamic' // defaults to auto
export async function GET(request: NextRequest) {
  const data = await barangService.getDaftarBarang();
  return new Response(JSON.stringify(data), {headers : { 'content-type': 'application/json' }});
}

export async function POST(request: NextRequest, { params }: { params: { barangId: string } }) {
  const data = await request.json();
  await barangService.addBarang(data);
  return new Response('Data berhasil ditambahkan!', { status: 201 });
};