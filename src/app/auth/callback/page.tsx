"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../../lib/SupabaseClient";
import ProfileSetupModal from "../../../components/ProfileSetupModal";

export default function Page() {
  const [showSetup, setShowSetup] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleAuth = async () => {
      // Get the currently authenticated user
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      // No user session — redirect back to sign in
      if (authError || !user) {
        router.replace("/");
        return;
      }

      // Check if user already completed (or skipped) setup
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("setup_complete")
        .eq("id", user.id)
        .maybeSingle();

      if (profileError) {
        console.error("Error checking profile:", profileError.message);
      }

      // Setup already done or skipped — go straight to home
      if (profile?.setup_complete) {
        router.replace("/home");
        return;
      }

      // No profile yet — show the setup modal
      setShowSetup(true);
    };

    handleAuth();
  }, [router]);

  // Show nothing while checking auth/profile status
  if (!showSetup) return null;

  return <ProfileSetupModal isOpen={true} />;
}
