import { createClient } from "@/utils/supabase/client";

export enum KondisiBarang {
  baik = "baik",
  rusak = "rusak",
  hilang = "hilang",
}

export type Barang = {
  id: string;
  nama: string;
  jumlah: number;
  lokasi: string;
  kondisi_barang: KondisiBarang;
  kode_barang: string;
  tahun_masuk: string;
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
        .eq('id', barangId)
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

  async getBarangAddedLastWeek() {
    try {
      const { data: barang_added_last_week, error } = await supabase
        .from('barang_added_last_week')
        .select('*');
      if (error) {
        throw error;
      }
      return barang_added_last_week;
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
