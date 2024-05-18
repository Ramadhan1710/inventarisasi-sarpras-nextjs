import { useRouter } from "next/navigation";
import { createClient } from "./client";

export async function getCurrentUser() {
  try {
    const supabase = createClient();
    const user = await supabase.auth.getUser();
    return user;
  } catch (error) {
    console.error("Error fetching user:", error);
    return null; // or handle error as needed
  }
}

export async function getProfile(userId: string) {
  try {
    const supabase = createClient();
    const { data: profile, error } = await supabase
      .from('profile')
      .select('*')
      .eq('user_id', userId).single();
    return { profile, error }; 
  } catch (error) {
    console.error("Error fetching profile:", error);
    return { data: null, error }; // or handle error as needed
  }
}

export async function getAdmin() {
  try {
    const supabase = createClient();
    const { data: admin, error } = await supabase
      .from('profile')
      .select('is_admin')
      .single();
    return { admin, error };
  } catch (error) {
    console.error("Error fetching admin:", error);
    return { data: null, error }; // or handle error as needed
  }
}

export async function signOut() {
  try {
    const supabase = createClient();
    await supabase.auth.signOut();
    
  } catch (error) {
    // console.error("Error signing out:", error.message);
    throw error; // or handle error as needed
  }
}

async function addProfile(userId: string, name: string) {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('profile')
      .insert([{ user_id: userId, name }]);
    return { data, error };
  } catch (error) {
    console.error("Error adding profile:", error);
    return { data: null, error }; // or handle error as needed
  }
}