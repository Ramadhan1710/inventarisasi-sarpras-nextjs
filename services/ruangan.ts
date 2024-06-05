import { createClient } from "@/utils/supabase/client";

export enum kondisiRuangan {
  baik = "baik",
  rusak = "rusak",
}
export type ruangan = {
  id: string;
  nama: string;
  kondisi_ruangan: kondisiRuangan;
  tahun_masuk: string;
  created_at: string;
}

const supabase = createClient();

const ruanganService = {
  async getDaftarRuangan() {
    try {
      const { data, error } = await supabase
        .from('ruangan')
        .select('*');
      return data as ruangan[];
    } catch (error) {
      console.error("Error fetching ruangan:", error);
      // or handle error as needed
    }
  },

  async getRuanganAddedLastWeek() {
    try {
      const { data: ruang_added_last_week, error } = await supabase
        .from('ruang_added_last_week')
        .select('*')

      if (error) {
        throw error;
      }
      return ruang_added_last_week;
    } catch (error) {
      console.error("Error fetching barang:", error);
      return null;
    }
  },

  async getRuangan(ruanganId: any) {
    try {
      const { data: ruangan, error } = await supabase
        .from('ruangan')
        .select('*')
        .eq('id', ruanganId)
        .single();
      return ruangan as ruangan;
    } catch (error) {
      console.error("Error fetching ruangan:", error);
      return { data: null, error }; // or handle error as needed
    }
  },

  async addRuangan(ruangan: any) {
    try {
      await supabase.from('ruangan').insert(ruangan);
    } catch (error) {
      console.error("Error adding ruangan:", error);
      return { data: null, error }; // or handle error as needed
    }
  },

  async updateRuangan(ruangan: any, ruanganId: any) {
    try {
      await supabase
        .from('ruangan')
        .update(ruangan)
        .eq('id', ruanganId);
    } catch (error) {
      console.error("Error updating ruangan:", error);
      return { data: null, error }; // or handle error as needed
    }
  },

  async deleteRuangan(ruanganId: any) {
    try {
      await supabase
        .from('ruangan')
        .delete()
        .eq('id', ruanganId);
    } catch (error) {
      console.error("Error deleting ruangan:", error);
      return { data: null, error }; // or handle error as needed
    }
  }
}

export default ruanganService