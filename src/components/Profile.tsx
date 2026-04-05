"use client";

import { useGetUser } from "@/custom-hooks/useGetUser";
import React from "react";
import Image from "next/image";
import { HiDotsHorizontal } from "react-icons/hi";
import Link from "next/link";

export default function Profile() {
  const { session, loading, profile } = useGetUser();
  const avatarUrl = profile?.avatar_url || null;

  if (loading) return null;
  if (!session) return null;
  return (
    <div className="flex justify-center sm:justify-between items-center w-full">
      <Link
        href={`/${profile?.username || "user"}`}
        className="flex items-center gap-[11px]"
      >
        {avatarUrl ? (
          <Image
            src={profile?.avatar_url || "/images/brody.jpeg"}
            alt="Profile"
            width={500}
            height={500}
            className="w-10 h-10 object-cover rounded-full shrink-0"
          />
        ) : (
          <div></div>
        )}
        <div className="hidden 2xl:block w-full text-[15px]/[1.4] mt-[1px]">
          <p className="font-bold">{profile?.name || "User"}</p>
          <p className="text-secondary-text tracking-[0.01em] font-light">
            @{profile?.username || "user"}
          </p>
        </div>
      </Link>
      <HiDotsHorizontal
        size={17}
        className="text-white hidden mt-[2px] mr-[3px] 2xl:block cursor-pointer"
      />
    </div>
  );
}
