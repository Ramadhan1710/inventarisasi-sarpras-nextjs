import { createClient } from "@/utils/supabase/client";

export type peminjaman_ruangan = {
  peminjaman_ruanganId: string;
  id_profile: string;
  id_ruangan: string;
  kepentingan: string;
  tanggal_peminjaman: string;
  tanggal_pengembalian: string;
  status: string;
  created_at: string;
}

const supabase = createClient();

const peminjaman_ruanganService = {
  async getDaftarPeminjamanRuangan() {
    try {
      const { data: peminjaman_ruangan, error } = await supabase
        .from('peminjaman_ruangan')
        .select('*');
      if (error) {
        throw error;
      }
      return peminjaman_ruangan as peminjaman_ruangan[];
    } catch (error) {
      console.error("Error fetching peminjaman_ruangan:", error);
      return { data: null, error }; // or handle error as needed
    }
  },

  async getPeminjamanRuangan(peminjaman_ruanganId: any) {
    try {
      const { data: peminjaman_ruangan, error } = await supabase
        .from('peminjaman_ruangan')
        .select('*')
        .eq('id', peminjaman_ruanganId)
        .single();
      return peminjaman_ruangan as peminjaman_ruangan;
    } catch (error) {
      console.error("Error fetching peminjaman_ruangan:", error);
      return { data: null, error }; // or handle error as needed
    }
  },

  async addPeminjamanRuangan(peminjaman_ruangan: any) {
    try {
      await supabase.from('peminjaman_ruangan').insert(peminjaman_ruangan);
    } catch (error) {
      console.error("Error adding peminjaman_ruangan:", error);
      return { data: null, error }; // or handle error as needed
    }
  },

  async updatePeminjamanRuangan(peminjaman_ruangan: any, peminjaman_ruanganId: any) {
    try {
      await supabase
        .from('peminjaman_ruangan')
        .update(peminjaman_ruangan)
        .eq('id', peminjaman_ruanganId);
    } catch (error) {
      console.error("Error updating peminjaman_ruangan:", error);
      return { data: null, error }; // or handle error as needed
    }
  },

  async deletePeminjamanRuangan(peminjaman_ruanganId: any) {
    try {
      await supabase
        .from('peminjaman_ruangan')
        .delete()
        .eq('id', peminjaman_ruanganId);
    } catch (error) {
      console.error("Error deleting peminjaman_ruangan:", error);
      return { data: null, error }; // or handle error as needed
    }
  }
}

export default peminjaman_ruanganService