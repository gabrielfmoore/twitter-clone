"use client";

import { IoSearch } from "react-icons/io5";
import Image from "next/image";
import { RxCross2 } from "react-icons/rx";
import { HiDotsHorizontal } from "react-icons/hi";
import FollowButton from "./FollowButton";
import { useGetUser } from "@/custom-hooks/useGetUser";
import { supabase } from "@/lib/SupabaseClient";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

async function searchUsers(query: string) {
  if (!query.trim()) return [];
  const { data, error } = await supabase
    .from("profiles")
    .select("id, name, username, avatar_url")
    .or(`username.ilike.%${query}%,name.ilike.%${query}%`)
    .limit(6);
  if (error) {
    console.error("SearchError:", error.message);
    return [];
  }
  return data || [];
}

const WHO_TO_FOLLOW = ["gabrielmoore", "gabr1234", "somedude1234"];

async function getSuggestedUsers(currentUserId: string | undefined) {
  if (!currentUserId) return [];
  const { data, error } = await supabase
    .from("profiles")
    .select("id, name, username, avatar_url")
    .in("username", WHO_TO_FOLLOW)
    .neq("id", currentUserId);
  if (error) {
    console.error("Error fetching suggested users:", error.message);
    return [];
  }
  return data || [];
}

export default function RightSidebar() {
  const { session } = useGetUser();
  const userId = session?.user.id;
  const { data: suggestedUsers } = useQuery({
    queryKey: ["suggestedUsers", userId],
    queryFn: () => getSuggestedUsers(userId),
    enabled: !!userId,
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [showNews, setShowNews] = useState(true);
  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const { data: searchResults } = useQuery({
    queryKey: ["searchUsers", searchQuery],
    queryFn: () => searchUsers(searchQuery),
    enabled: searchQuery.trim().length > 0,
  });

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);
  return (
    <aside className=" top-0 lg:w-[310px] xl:w-[389px] pl-[20px] xl:pl-[30px] lg:mr-[10px] xl:mr-[1px] shrink-0 h-screen hidden lg:block ">
      <div className="flex flex-col w-full xl:w-[350px]">
        <div ref={searchRef} className="sticky top-0 z-10 relative">
          <div suppressHydrationWarning className="bg-black/65 backdrop-blur-md text-secondary-text flex items-center gap-[4px] border border-border px-[12px] py-[11px] mt-[5px] rounded-full">
            <IoSearch size={18} className="text-thin text-gray-500" />
            <input
              type="text"
              placeholder="Search"
              suppressHydrationWarning
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowResults(true);
              }}
              onFocus={() => setShowResults(true)}
              className="border-none outline-none text-white w-full text-sm bg-transparent"
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setShowResults(false);
                }}
                className="text-white cursor-pointer"
              >
                <RxCross2 size={16} />
              </button>
            )}
          </div>
          {showResults && searchQuery.trim() && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-black border border-border rounded-2xl shadow-lg overflow-hidden z-20">
              {searchResults && searchResults.length > 0 ? (
                searchResults.map((user) => (
                  <div
                    key={user.id}
                    onClick={() => {
                      router.push(`/${user.username}`);
                      setSearchQuery("");
                      setShowResults(false);
                    }}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-hover cursor-pointer"
                  >
                    <Image
                      src={user.avatar_url || "/images/default-avatar.svg"}
                      alt={user.name}
                      width={40}
                      height={40}
                      className="w-10 h-10 object-cover rounded-full shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="text-white font-bold text-[15px] truncate">{user.name}</p>
                      <p className="text-secondary-text text-[13px] truncate">@{user.username}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="px-4 py-6 text-secondary-text text-center text-sm">
                  No results for &quot;{searchQuery}&quot;
                </div>
              )}
            </div>
          )}
        </div>
        <div className="border border-border px-5 pt-[14px] pb-[16px] text-white mt-[16px] rounded-2xl">
          <div className="flex items-center gap-[10px] mt-[2px] mb-[10px] leading-0.5">
            <h3 className="font-extrabold text-xl  leading-[1.2]">Subscribe to Premium</h3>
            <div className="text-sm/[1.4] tracking-[-0.027em] font-[600] rounded-md whitespace-nowrap text-green-300 bg-[#00472e] px-[7px] py-[2px]">
              50% off
            </div>
          </div>
          <p className="text-[15px] tracking-[-0.01em] font-[500] leading-[1.3]">
            Get rid of ads, see your analytics, boost your replies and unlock
            20+ features.
          </p>
          <button suppressHydrationWarning className="bg-primary text-[15px] tracking-[-0.035em] text-white mt-[19px] px-[17px] py-[6px] pb-[7px] rounded-full font-black cursor-pointer">
            Subscribe
          </button>
        </div>
        {showNews && (
          <div className="border border-border h-[364px] flex flex-col px-4 pt-3 text-[20px] text-white font-black mt-4 rounded-2xl overflow-hidden">
            <div className="flex justify-between items-center">
              <h3 className="flex flex-row justify-between tracking-[-0.01em]">Today&apos;s News</h3>
              <button
                aria-label="Close news section"
                className="text-white mr-[7px] mt-[2px] hover:opacity-70 cursor-pointer"
                onClick={() => setShowNews(false)}
                suppressHydrationWarning
              >
                <RxCross2 size={18} />
              </button>
            </div>
            {[
              {
                headline: "Illinois Illini Retain Four Key Final Four Players for 2026-27",
                time: "2 days ago",
                category: "Sports",
                posts: "12.2K posts",
              },
              {
                headline: "Iran announces reopening of Strait of Hormuz to commercial vessels during Israel-Lebanon ceasefire",
                time: "1 day ago",
                category: "News",
                posts: "33.9K posts",
              },
              {
                headline: "X Users Discuss Favorite Characters from the TV Series LOST",
                time: "7 hours ago",
                category: "Entertainment",
                posts: "319 posts",
              },
            ].map((item, i) => (
              <div key={i} className={`${i === 0 ? "pt-[30px]" : "pt-[16px]"} pb-[16px] last:pb-0`}>
                <p className="font-extrabold text-[14.5px] leading-[1.4] line-clamp-2">{item.headline}</p>
                <div className="flex items-center gap-[6px] mt-[6px]">
                  <div className="flex -space-x-[10px]">
                    <div className="w-[23px] h-[23px] rounded-full bg-blue-500 border-2 border-black z-[3]" />
                    <div className="w-[23px] h-[23px] rounded-full bg-green-500 border-2 border-black z-[2]" />
                    <div className="w-[23px] h-[23px] rounded-full bg-purple-500 border-2 border-black z-[1]" />
                  </div>
                  <span className="text-secondary-text text-[13px] font-normal">
                    {item.time} · {item.category} · {item.posts}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="border border-border flex flex-col px-4 py-3 text-[20px]/[1.3] text-white font-black mt-4 rounded-2xl">
          <div className="flex justify-between items-center mb-2">
            <h3 className="flex flex-row justify-between tracking-[-0.01em]">What&apos;s happening</h3>
          </div>
          {[
            { category: "Sports · Trending", title: "Stan Van Gundy" },
            { category: "Trending in United States", title: "#LittleMissDramaTour" },
            { category: "Entertainment · Trending", title: "Happy Birthday James" },
          ].map((item, i) => (
            <div key={i} className="flex justify-between leading-[1.7] items-start h-[62px] px-[16px] py-[12px] -mx-4 hover:bg-hover cursor-pointer">
              <div className="flex flex-col justify-center">
                <span className="text-secondary-text text-[13px] font-normal">{item.category}</span>
                <span className="text-white text-[14px] font-lack">{item.title}</span>
              </div>
              <HiDotsHorizontal size={18} className="text-secondary-text mt-[2px] shrink-0" />
            </div>
          ))}
          <div className="text-primary text-[15px] font-normal py-2 cursor-pointer hover:underline">
            Show more
          </div>
        </div>
        <div className="border border-border p-4 text-white mt-4 rounded-2xl">
          <h3 className="flex justify-between font-black text-[20px]">
            Who to follow
          </h3>
          <div className="flex flex-col gap-6 mt-4">
          {suggestedUsers?.map((user) => (
            <div key={user.id} className="flex justify-between items-center">
              <Link href={`/${user.username}`} className="flex gap-2 items-center min-w-0">
                <Image
                  src={user.avatar_url || "/images/default-avatar.svg"}
                  alt={user.name}
                  width={800}
                  height={800}
                  className="w-10 h-10 object-cover rounded-full shrink-0"
                />
                <div className="min-w-0">
                  <p className="font-bold truncate hover:underline">{user.name}</p>
                  <p className="text-secondary-text text-sm font-light truncate">
                    @{user.username}
                  </p>
                </div>
              </Link>
              <FollowButton targetUserId={user.id} />
            </div>
          ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
