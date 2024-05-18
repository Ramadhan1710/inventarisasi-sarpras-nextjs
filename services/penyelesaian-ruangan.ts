import { createClient } from "@/utils/supabase/client";

export type penyelesaian_ruangan = {
  penyelesaian_ruanganId: string;
  ruangan_id: string;
  profile_id: string;
  kondisi: string;
  deskripsi_kondisi: string;
  created_at: string;
}

const supabase = createClient();

const penyelesaian_ruanganService = {
  async getDaftarPenyelesaianRuangan() {
    try {
      const { data: penyelesaian_ruangan, error } = await supabase
        .from('penyelesaian_ruangan')
        .select('*');
      if (error) {
        throw error;
      }
      return penyelesaian_ruangan as penyelesaian_ruangan[];
    } catch (error) {
      console.error("Error fetching penyelesaian_ruangan:", error);
      return { data: null, error }; // or handle error as needed
    }
  },

  async getPenyelesaianRuangan(penyelesaian_ruanganId: any) {
    try {
      const { data: penyelesaian_ruangan, error } = await supabase
        .from('penyelesaian_ruangan')
        .select('*')
        .eq('id', penyelesaian_ruanganId)
        .single();
      return penyelesaian_ruangan as penyelesaian_ruangan;
    } catch (error) {
      console.error("Error fetching penyelesaian_ruangan:", error);
      return { data: null, error }; // or handle error as needed
    }
  },

  async addPenyelesaianRuangan(penyelesaian_ruangan: any) {
    try {
      await supabase.from('penyelesaian_ruangan').insert(penyelesaian_ruangan);
    } catch (error) {
      console.error("Error adding penyelesaian_ruangan:", error);
      return { data: null, error }; // or handle error as needed
    }
  },

  async updatePenyelesaianRuangan(penyelesaian_ruangan: any, penyelesaian_ruanganId: any) {
    try {
      await supabase
        .from('penyelesaian_ruangan')
        .update(penyelesaian_ruangan)
        .eq('id', penyelesaian_ruanganId);
    } catch (error) {
      console.error("Error updating penyelesaian_ruangan:", error);
      return { data: null, error }; // or handle error as needed
    }
  },

  async deletePenyelesaianRuangan(penyelesaian_ruanganId: any) {
    try {
      await supabase
        .from('penyelesaian_ruangan')
        .delete()
        .eq('id', penyelesaian_ruanganId);
    } catch (error) {
      console.error("Error deleting penyelesaian_ruangan:", error);
      return { data: null, error }; // or handle error as needed
    }
  }
}

export default penyelesaian_ruanganService