import { useEffect, useState } from "react";
import { useUserSession } from "./useUserSession";
import { supabase } from "@/lib/SupabaseClient";

type Profile = {
  username: string;
  name: string;
  avatar_url: string;
  bio: string;
  location: string;
  website: string;
  created_at: string;
};

export const useGetUser = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const { loading, session } = useUserSession();
  const userId = session ? session.user.id : null;

  useEffect(() => {
    if (!userId) return;

    const fetchProfile = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .maybeSingle();
      if (error) {
        console.error("Error fetching profile:", error.message);
        return;
      }
      if (data) {
        setProfile(data);
      }
    };
    fetchProfile();
  }, [userId]);

  return { profile, session, loading };
};
