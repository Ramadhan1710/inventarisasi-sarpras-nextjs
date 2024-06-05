import { createClient } from "@/utils/supabase/client";

export type Profile = {
  id: string;
  email: string;
  password: string;
  nama_lengkap: string;
  user_id: string;
  is_admin: boolean;
}

const supabase = createClient();

const profileService = {

  async addProfile(profile: Profile) {
    try {
      const { data, error } = await supabase.auth.admin.createUser({
        email: profile.email,
        password: profile.password,
      })

      if (error) {
        throw error;
      }

      profile.user_id = data.user.id

      await supabase.from('profile').insert({
        user_id: profile.user_id,
        nama_lengkap: profile.nama_lengkap,
        is_admin: profile.is_admin
      });
    } catch (error) {
      console.error("Error adding profile:", error);
      return { data: null, error }; // or handle error as needed
    }
  },

  async getListProfile() {
    try {
      const { data: profile_with_email, error } = await supabase
        .from('profile_with_email')
        .select('*')

      if (error) {
        throw error;
      }

      console.log('Profiles with emails:', profile_with_email);
      return profile_with_email;

    } catch (error) {
      console.error('Error fetching profiles with emails:', error);
    }
  },

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

  async getProfileId(profileId: string) {
    try {
      const { data, error } = await supabase
        .from('profile')
        .select('*')
        .eq('id', profileId)
        .single();
      return data;
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