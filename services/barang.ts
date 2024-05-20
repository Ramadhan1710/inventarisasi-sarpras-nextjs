import { createClient } from "@/utils/supabase/client";

export enum KondisiBarang {
  baik = "baik",
  rusak = "rusak",
  tidakLayakPakai = "tidak layak pakai",
  perluPerbaikan = "perlu perbaikan",
}

export enum StatusBarang {
  tersedia = "tersedia",
  dipinjam = "dipinjam",
  dipakai = "perbaikan",
}

export type Barang = {
  id: string;
  nama: string;
  stok: number;
  lokasi: string;
  deskripsi: string;
  kondisi: KondisiBarang;
  status: StatusBarang;
  created_at: string;
}


const supabase = createClient();

const barangService = {
  async getDaftarBarang() {
    try {
      const { data, error } = await supabase
        .from('barang')
        .select('*');
      if (error) {
        throw error;
      }
      return data as Barang[];
    } catch (error) {
      console.error("Error fetching barang:", error);
      return null;
    }
  },

  async getBarang(barangId: string) {
    try {
      const { data, error } = await supabase
        .from('barang')
        .select('*')
        .eq('barangId', barangId)
        .single();
      if (error) {
        throw error;
      }
      return data as Barang;
    } catch (error) {
      console.error("Error fetching barang:", error);
      return null;
    }
  },

  async addBarang(barang: Barang) {
    try {
      const { error } = await supabase.from('barang').insert(barang);
      if (error) {
        throw error;
      }
    } catch (error) {
      console.error("Error adding barang:", error);
      return null;
    }
  },

  async updateBarang(barang: any, barangId: string) {
    try {
      const { error } = await supabase
        .from('barang')
        .update(barang)
        .eq('id', barangId);
      if (error) {
        throw error;
      }
    } catch (error) {
      console.error("Error updating barang:", error);
      return null;
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

export default barangService;
