"use client";

import { useState } from "react";
import Image from "next/image";
import { IoSearch, IoClose, IoCalendarOutline } from "react-icons/io5";
import { HiBadgeCheck } from "react-icons/hi";
import GoBackButton from "./GoBackButton";
import { useGetUser } from "@/custom-hooks/useGetUser";

const tabs = ["Posts", "Replies", "Highlights", "Articles", "Media", "Likes"];

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("Posts");
  const [showVerified, setShowVerified] = useState(true);
  const { profile, loading } = useGetUser();

  const displayName = profile?.name || "Gabriel Moore";
  const username = profile?.username || "";
  const avatarUrl = profile?.avatar_url || null;
  const joinedDate = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : "April 2026";

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );

  return (
    <div className="flex flex-col min-h-screen border-r border-border lg:border-none">
      {/* Top bar — 53px */}
      <div className="h-[53px] flex items-center justify-between px-4 text-white sticky top-0 bg-black/70 backdrop-blur-md z-10">
        <div className="flex items-center gap-6">
          <GoBackButton />
          <div className="flex flex-col leading-tight">
            <span className="font-bold text-[17px]">{displayName}</span>
            <span className="text-secondary-text text-[13px]">0 posts</span>
          </div>
        </div>
        <button
          suppressHydrationWarning
          className="p-2 rounded-full hover:bg-hover cursor-pointer"
        >
          <IoSearch size={20} />
        </button>
      </div>

      {/* Banner — 199px */}
      <div className="h-[199px] w-full overflow-hidden">
        <Image
          src="/images/brody.jpeg"
          alt="Banner"
          width={600}
          height={199}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Profile info section — 209px */}
      <div className=" h-[209px] px-4">
        {/* Avatar — centered on banner bottom edge */}
        <div className="relative w-full h-[85px]">
          <div className="absolute left-0 -translate-y-1/2">
            {avatarUrl ? (
              <Image
                src={avatarUrl}
                alt="Avatar"
                width={133}
                height={133}
                className="w-[133px] h-[133px] rounded-full object-cover border-4 border-black"
              />
            ) : (
              <div className="w-[133px] h-[133px] rounded-full border-4 border-black bg-gray-700 animate-pulse" />
            )}
          </div>
          <button className="absolute justify-center items-center right-0 top-0 h-[36px] px-4 mt-3 text-[15px] font-[800] text-white border border-border-2 rounded-full">
            Edit profile
          </button>
        </div>

        {/* Name / username / joined / follow counts */}
        <div className="">
          <h2 className="text-white text-xl font-bold">{displayName}</h2>
          <p className="text-secondary-text text-[15px]">@{username}</p>
          <div className="flex items-center gap-1 text-secondary-text text-[15px] mt-3">
            <IoCalendarOutline size={16} />
            <span>Joined {joinedDate}</span>
          </div>
          <div className="flex gap-4 mt-3 text-[14px]">
            <span className="text-white">
              <span className="font-bold">0</span>{" "}
              <span className="text-secondary-text">Following</span>
            </span>
            <span className="text-white">
              <span className="font-bold">0</span>{" "}
              <span className="text-secondary-text">Followers</span>
            </span>
          </div>
        </div>
      </div>

      {/* Verified banner */}
      {showVerified && (
        <div className="bg-[#0d3b1e] mx-4 p-4 rounded-2xl relative">
          <button
            suppressHydrationWarning
            onClick={() => setShowVerified(false)}
            className="absolute top-3 right-3 text-white cursor-pointer hover:opacity-70"
          >
            <IoClose size={20} />
          </button>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-white text-[20px] font-black">
              You aren&apos;t verified yet
            </span>
            <HiBadgeCheck size={24} className="text-white" />
          </div>
          <p className="text-white text-[15px] leading-[1.4] mb-3">
            Get verified for boosted replies, analytics, ad-free browsing, and
            more. Upgrade your profile now.
          </p>
          <button
            suppressHydrationWarning
            className="bg-white text-black font-bold text-[15px] px-4 py-2 rounded-full cursor-pointer hover:bg-gray-200"
          >
            Get verified
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className="h-[53px] w-full min-w-[492px] grid grid-cols-6 text-white text-[15px] mt-2 border-b border-border">
        {tabs.map((tab) => (
          <button
            suppressHydrationWarning
            key={tab}
            onClick={() => setActiveTab(tab)}
            className="flex items-center justify-center cursor-pointer hover:bg-hover"
          >
            <div className="relative h-full flex items-center">
              <span
                className={
                  activeTab === tab
                    ? "font-bold"
                    : "text-secondary-text font-[500]"
                }
              >
                {tab}
              </span>
              {activeTab === tab && (
                <div className="absolute h-1 w-full bg-primary bottom-0 rounded-full" />
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
