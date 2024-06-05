import { createClient } from "@/utils/supabase/client";
import { updateNotification } from "@mantine/notifications";

export enum StatusPengajuan {
  diproses = "diproses",
  ditolak = "ditolak",
  disetujui = "disetujui",
  selesai = "selesai",
}

export enum JenisInventaris {
  barang = "barang",
  ruangan = "ruangan",
}

export type Pengajuan = {
  id: string;
  profile_id: string;
  jenis_inventaris: JenisInventaris;
  nama_inventaris: string;
  keperluan: string;
  deskripsi: string;
  status_pengajuan: StatusPengajuan;
  created_at: string;
};

const supabase = createClient();

const pengajuanService = {
  async getDaftarPengajuan() {
    try {
      const { data, error } = await supabase
        .from('pengajuan')
        .select('*');
      return data as Pengajuan[];
    } catch (e) {
      console.error(e);
    }
  },

  async getDaftarPengajuanByProfileId(profileId: string) {
    try {
      const { data, error } = await supabase
        .from('pengajuan')
        .select('*')
        .eq('profile_id', profileId);
      return data as Pengajuan[];
    } catch (e) {
      console.error(e);
    }
  },

  async addPengajuanWithProfileId(pengajuan: any, profileId: string) {
    try {
      const { error } = await supabase
        .from('pengajuan')
        .insert({ ...pengajuan, profile_id: profileId });
      if (error) {
        throw error
      }
    } catch (e) {
      console.error(e);
    }
  },

  async addPengajuan(pengajuan: any) {
    try {
      const { error } = await supabase.from('pengajuan').insert(pengajuan);
      if (error) {
        throw error
      }
    } catch (e) {
      console.error(e);
    }
  },

  async updatePengajuan(pengajuan: any, pengajuanId: string) {
    try {
      const { error } = await supabase
        .from('pengajuan')
        .update(pengajuan)
        .eq('id', pengajuan.id);
      if (error) {
        throw error
      }
    } catch (e) {
      console.error(e);
    }
  },

  async deletePengajuan(pengajuan: any) {
    try {
      const { error } = await supabase
        .from('pengajuan')
        .delete()
        .eq('id', pengajuan.id);
      if (error) {
        throw error
      }
    } catch (e) {
      console.error(e);
    }
  },
}

export default pengajuanService;