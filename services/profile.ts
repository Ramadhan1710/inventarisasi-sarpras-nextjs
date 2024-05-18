import { createClient } from "@/utils/supabase/client";

export type Profile = {
  id: string;
  nama_lengkap: string;
  user_id: string;
  is_admin: boolean;
  created_at: string;
}

const supabase = createClient();

const profileService = {
  async getDaftarProfile() {
    try {
      const { data: profile, error } = await supabase
        .from('profile')
        .select('*');
      if (error) {
        throw error;
      }
      return profile as Profile[];
    } catch (error) {
      console.error("Error fetching profile:", error);
      return { data: null, error }; // or handle error as needed
    }
  },

  async getProfile(userId: string) {
    try {
      const { data: profile, error } = await supabase
        .from('profile')
        .select('*')
        .eq('user_id', userId)
        .single();
      return { profile, error };
    } catch (error) {
      console.error("Error fetching profile:", error);
      return { data: null, error }; // or handle error as needed
    }
  }
}

export default profileService