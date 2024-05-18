import { createClient } from "@/utils/supabase/client";

export type peminjaman_barang = {
  peminjaman_barangId: string;
  profile_id: string;
  barang_id: string;
  jumlah: string;
  kepentingan: string;
  tanggal_peminjaman: string;
  tanggal_pengembalian: string;
  status: string;
  created_at: string;
}

const supabase = createClient();

const peminjaman_barangService = {
  async getDaftarPeminjamanBarang() {
    try {
      const { data: peminjaman_barang, error } = await supabase
        .from('peminjaman_barang')
        .select('*');
      if (error) {
        throw error;
      }
      return peminjaman_barang as peminjaman_barang[];
    } catch (error) {
      console.error("Error fetching peminjaman_barang:", error);
      return { data: null, error }; // or handle error as needed
    }
  },

  async getPeminjamanBarang(peminjaman_barangId: any) {
    try {
      const { data: peminjaman_barang, error } = await supabase
        .from('peminjaman_barang')
        .select('*')
        .eq('id', peminjaman_barangId)
        .single();
      return peminjaman_barang as peminjaman_barang;
    } catch (error) {
      console.error("Error fetching peminjaman_barang:", error);
      return { data: null, error }; // or handle error as needed
    }
  },

  async addPeminjamanBarang(peminjaman_barang: any) {
    try {
      await supabase.from('peminjaman_barang').insert(peminjaman_barang);
    } catch (error) {
      console.error("Error adding peminjaman_barang:", error);
      return { data: null, error }; // or handle error as needed
    }
  },

  async updatePeminjamanBarang(peminjaman_barang: any, peminjaman_barangId: any) {
    try {
      await supabase
        .from('peminjaman_barang')
        .update(peminjaman_barang)
        .eq('id', peminjaman_barangId);
    } catch (error) {
      console.error("Error updating peminjaman_barang:", error);
      return { data: null, error }; // or handle error as needed
    }
  },

  async deletePeminjamanBarang(peminjaman_barangId: any) {
    try {
      await supabase
        .from('peminjaman_barang')
        .delete()
        .eq('id', peminjaman_barangId);
    } catch (error) {
      console.error("Error deleting peminjaman_barang:", error);
      return { data: null, error }; // or handle error as needed
    }
  }
}

export default peminjaman_barangService