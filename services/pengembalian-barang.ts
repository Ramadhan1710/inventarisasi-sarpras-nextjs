import { createClient } from "@/utils/supabase/client";

export type pengembalian_barang = {
  pengembalian_barangId: string;
  barang_id: string;
  profile_id: string;
  kondisi: string;
  deskripsi_kondisi: string;
  created_at: string;
}

const supabase = createClient();

const pengembalian_barangService = {
  async getDaftarPengembalianBarang() {
    try {
      const { data: pengembalian_barang, error } = await supabase
        .from('pengembalian_barang')
        .select('*');
      if (error) {
        throw error;
      }
      return pengembalian_barang as pengembalian_barang[];
    } catch (error) {
      console.error("Error fetching pengembalian_barang:", error);
      return { data: null, error }; // or handle error as needed
    }
  },

  async getPengembalianBarang(pengembalian_barangId: any) {
    try {
      const { data: pengembalian_barang, error } = await supabase
        .from('pengembalian_barang')
        .select('*')
        .eq('id', pengembalian_barangId)
        .single();
      return pengembalian_barang as pengembalian_barang;
    } catch (error) {
      console.error("Error fetching pengembalian_barang:", error);
      return { data: null, error }; // or handle error as needed
    }
  },

  async addPengembalianBarang(pengembalian_barang: any) {
    try {
      await supabase.from('pengembalian_barang').insert(pengembalian_barang);
    } catch (error) {
      console.error("Error adding pengembalian_barang:", error);
      return { data: null, error }; // or handle error as needed
    }
  },

  async updatePengembalianBarang(pengembalian_barang: any, pengembalian_barangId: any) {
    try {
      await supabase
        .from('pengembalian_barang')
        .update(pengembalian_barang)
        .eq('id', pengembalian_barangId);
    } catch (error) {
      console.error("Error updating pengembalian_barang:", error);
      return { data: null, error }; // or handle error as needed
    }
  },

  async deletePengembalianBarang(pengembalian_barangId: any) {
    try {
      await supabase
        .from('pengembalian_barang')
        .delete()
        .eq('id', pengembalian_barangId);
    } catch (error) {
      console.error("Error deleting pengembalian_barang:", error);
      return { data: null, error }; // or handle error as needed
    }
  }
}

export default pengembalian_barangService