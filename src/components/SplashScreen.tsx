"use client";

import { useState, useEffect } from "react";
import { FaXTwitter } from "react-icons/fa6";

export default function SplashScreen() {
  const [phase, setPhase] = useState<"logo" | "spinner" | "done">("logo");

  useEffect(() => {
    const logoTimer = setTimeout(() => setPhase("spinner"), 300);
    const spinnerTimer = setTimeout(() => setPhase("done"), 600);
    return () => {
      clearTimeout(logoTimer);
      clearTimeout(spinnerTimer);
    };
  }, []);

  if (phase === "done") return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black flex items-center justify-center">
      {phase === "logo" ? (
        <FaXTwitter size={80} className="text-white" />
      ) : (
        <div className="w-8 h-8 border-[3px] border-primary border-t-transparent rounded-full animate-spin" />
      )}
    </div>
  );
}
