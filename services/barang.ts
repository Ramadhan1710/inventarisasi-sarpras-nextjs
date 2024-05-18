import { createClient } from "@/utils/supabase/client";

export type barang = {
  barangId: string;
  nama: string;
  stok: number;
  lokasi: string;
  deskripsi: string;
  gambar: string;
  kondisi: string;
  status: string;
  created_at: string;
}

const supabase = createClient();

const barangService = {
  async getDaftarBarang() {
    try {
      const { data: barang, error } = await supabase
        .from('barang')
        .select('*');
      if (error) {
        throw error;
      }
      return barang as barang[];
    } catch (error) {
      console.error("Error fetching barang:", error);
      return { data: null, error }; // or handle error as needed
    }
  },

  async getBarang(barangId: any) {
    try {
      const { data: barang, error } = await supabase
        .from('barang')
        .select('*')
        .eq('id', barangId)
        .single();
      return barang as barang;
    } catch (error) {
      console.error("Error fetching barang:", error);
      return { data: null, error }; // or handle error as needed
    }
  },

  async addBarang(barang: any) {
    try {
      await supabase.from('barang').insert(barang);
    } catch (error) {
      console.error("Error adding barang:", error);
      return { data: null, error }; // or handle error as needed
    }
  },

  async updateBarang(barang: any, barangId: any) {
    try {
      await supabase
        .from('barang')
        .update(barang)
        .eq('id', barangId);
    } catch (error) {
      console.error("Error updating barang:", error);
      return { data: null, error }; // or handle error as needed
    }
  },

  async deleteBarang(barangId: any) {
    try {
      await supabase
        .from('barang')
        .delete()
        .eq('id', barangId);
    } catch (error) {
      console.error("Error deleting barang:", error);
      return { data: null, error }; // or handle error as needed
    }
  }
}

export default barangService