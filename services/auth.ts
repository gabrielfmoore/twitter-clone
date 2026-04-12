import { supabase } from "@/lib/SupabaseClient";

export const signUpUser = async (email: string, password: string) => {
  try {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) {
      console.error("Error signing up:", error);
      return { error: error.message };
    }
  } catch (error) {
    return { error: "An error occurred during sign up." };
  }
};

export const signInUser = async (email: string, password: string) => {
  try {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      return { error: error.message };
    }
  } catch (error) {
    return { error: "An error occurred during sign in." };
  }
};

export const getProfileByUsername = async (username: string) => {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("username", username)
    .maybeSingle();
  if (error) {
    console.error("GetProfileByUsernameError:", error.message);
    return null;
  }
  return data;
};
