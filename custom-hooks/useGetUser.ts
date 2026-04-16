import { useEffect, useState } from "react";
import { useUserSession } from "./useUserSession";
import { supabase } from "@/lib/SupabaseClient";

type Profile = {
  id: string;
  username: string;
  name: string;
  avatar_url: string;
  bio: string;
  location: string;
  website: string;
  created_at: string;
};

const profileCache: Record<string, Profile> = {};

export const useGetUser = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const { loading, session } = useUserSession();
  const userId = session ? session.user.id : null;
  const cachedProfile = userId ? profileCache[userId] ?? null : null;

  useEffect(() => {
    if (!userId || cachedProfile) return;

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
        profileCache[userId] = data;
        setProfile(data);
      }
    };
    fetchProfile();
  }, [userId, cachedProfile]);

  return { profile: cachedProfile ?? profile, session, loading };
};
