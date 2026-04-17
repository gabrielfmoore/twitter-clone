"use client";

import { supabase } from "@/lib/SupabaseClient";
import { useGetUser } from "@/custom-hooks/useGetUser";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createPortal } from "react-dom";

interface LogoutModalProps {
  isOpen: boolean;
  anchorRef?: React.RefObject<HTMLDivElement | null>;
}

export default function LogoutModal({ isOpen, anchorRef }: LogoutModalProps) {
  const { profile } = useGetUser();
  const router = useRouter();
  const username = profile?.username || "";
  const LogoutUser = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Something went wrong. Please try again.");
      return;
    }
    toast("You have been logged out.");
    router.push("/");
  };

  if (!isOpen) return null;

  const rect = anchorRef?.current?.getBoundingClientRect();
  const style: React.CSSProperties = rect
    ? { position: "fixed", bottom: window.innerHeight - rect.top + 8, left: rect.left }
    : { position: "fixed", bottom: 80, left: 16 };

  return createPortal(
    <div
      className="w-75 h-28 border border-border rounded-3xl bg-black overflow-hidden z-50 shadow-lg"
      style={style}
      onMouseDown={(e) => e.stopPropagation()}
    >
      <div className="py-3 flex flex-col items-start font-extrabold text-[15px] text-white">
        <button className="w-full h-11 px-4 py-[10px] text-left cursor-not-allowed hover:bg-hover">
          Add and existing account
        </button>
        <button
          onClick={LogoutUser}
          className="w-full h-11 px-4 py-[10px] text-left cursor-pointer hover:bg-hover"
        >
          Log out {`@${username}`}
        </button>
      </div>
    </div>,
    document.body
  );
}
