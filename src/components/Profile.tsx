"use client";

import { useGetUser } from "@/custom-hooks/useGetUser";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { HiDotsHorizontal } from "react-icons/hi";
import LogoutModal from "./LogoutModal";

export default function Profile({ collapsed = false }: { collapsed?: boolean }) {
  const { session, loading, profile } = useGetUser();
  const avatarUrl = profile?.avatar_url || null;
  const [logoutOpen, setLogoutOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!logoutOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setLogoutOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [logoutOpen]);

  if (loading) return null;
  if (!session) return null;
  return (
    <div
      ref={ref}
      className={`relative flex justify-center items-center w-full ${collapsed ? "" : "sm:justify-between 2xl:mr-1"}`}
    >
      <div
        onClick={() => setLogoutOpen(!logoutOpen)}
        suppressHydrationWarning
        className="flex items-center gap-[11px] cursor-pointer"
      >
        {avatarUrl ? (
          <Image
            src={profile?.avatar_url || "/images/default-avatar.svg"}
            alt="Profile"
            width={500}
            height={500}
            priority
            className="w-10 h-10 object-cover rounded-full shrink-0"
          />
        ) : (
          <Image
            src="/images/default-avatar.svg"
            alt="Profile"
            width={500}
            height={500}
            priority
            className="w-10 h-10 object-cover rounded-full shrink-0"
          />
        )}
        <div className={`hidden ${collapsed ? "" : "2xl:block"} w-full text-[15px]/[1.4] mt-[1px]`}>
          <p className="font-bold">{profile?.name || "User"}</p>
          <p className="text-secondary-text tracking-[0.01em] font-light">
            @{profile?.username || "user"}
          </p>
        </div>
      </div>
      <HiDotsHorizontal
        size={17}
        className={`text-white hidden mt-[2px] mr-[3px] ${collapsed ? "" : "2xl:block"} cursor-pointer`}
        onClick={() => setLogoutOpen(!logoutOpen)}
      />
      <LogoutModal isOpen={logoutOpen} anchorRef={ref} />
    </div>
  );
}
