// Backup of LeftSidebar.tsx as of April 21, 2026
// This file is a direct copy of the current LeftSidebar implementation for possible renewal.

"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { BiBell } from "react-icons/bi";
import { FaXTwitter } from "react-icons/fa6";
import { GoHome, GoHomeFill } from "react-icons/go";
import { HiOutlineUserAdd } from "react-icons/hi";
import { IoChatbubbleOutline, IoSearchOutline } from "react-icons/io5";
import { HiUser, HiOutlineUser } from "react-icons/hi2";

import { TbDotsCircleHorizontal, TbMessageCircleFilled } from "react-icons/tb";
import Grok from "../../public/images/grok-icon.png";
import { FaFeatherAlt, FaRegBookmark } from "react-icons/fa";
import { LuRocket } from "react-icons/lu";
import Profile from "./Profile";
import CreatePostModal from "./CreatePostModal";
import { useGetUser } from "@/custom-hooks/useGetUser";
import { useUnreadConversations } from "@/custom-hooks/useChat";

export default function LeftSidebar() {
  const { profile } = useGetUser();
  const pathname = usePathname();
  const [showPostModal, setShowPostModal] = useState(false);
  const userId = profile?.id;
  const { data: unreadConvos } = useUnreadConversations(userId);

  const isHome = pathname === "/home";
  const isExplore = false;
  const isFollow = false;
  const isChat = pathname.startsWith("/home/messages");
  const isBookmarks = false;
  const isProfile = pathname === `/${profile?.username}`;
  const [is2xl, setIs2xl] = useState(false);

  // useEffect(() => {
  //   const mediaQuery = window.matchMedia("(min-width: 1285px)");
  //   setIs2xl(mediaQuery.matches);
  //   const handler = (e: MediaQueryListEvent) => setIs2xl(e.matches);
  //   mediaQuery.addEventListener("change", handler);
  //   return () => mediaQuery.removeEventListener("change", handler);
  // }, []);
  // const collapsed = isChat || !is2xl;
  const collapsed = isChat;

  return (
    <aside
      className={`sticky top-0 left-0 shrink-0 h-dvh flex justify-center ${collapsed ? "md:ml-[calc(-33vw+314px)] lg:ml-0 overflow-x-" : "lg:justify-end 2xl:overflow-x-clip md:ml-[calc(-33vw+242px)] lg:ml-0"}`}
      role="navigation"
      aria-label="Sidebar"
    >
      <div
        className={`flex flex-col items-end h-dvh ${collapsed ? "border-border border-r w-[69px] xs:w-[89px] md:w-[88px] lg:w-[87px] 2xl:w-[69px] md:ml-[1px] lg:pr-[3px] 2xl:pr-[1px]" : "w-[68px] xs:w-[88px] md:w-[72px] lg:w-[87px] xl:w-[82px] 2xl:w-[278px] 2xl:pr-1 xl:pr-[7px] lg:pr-[1px] md:pr-[14px] lg:ml-[1px] xl:ml-[16px] 2xl:ml-[7px]"}`}
      >
        <div
          className={`flex items-center justify-center pt-1 h-[53px] w-full ${collapsed ? "" : "2xl:justify-start 2xl:px-[7px]"}`}
        >
          <Link
            href="/"
            suppressHydrationWarning
            className={`p-[11px] relative ${collapsed ? "" : "2xl:ml-[4px]"} text-white rounded-full hover:bg-hover`}
          >
            <FaXTwitter size={29} />
            <div className="absolute top-full left-1/2 -translate-x-1/2 translate-y-[-8px] whitespace-nowrap text-[10px]">
              *CLONE!
            </div>
          </Link>
        </div>
        <div
          className={`flex flex-col flex-1 overflow-y-auto scrollbar-hidden [&>*]:shrink-0 mt-[5px] [@media(min-height:855px)]:mt-[9px] pr-2 pl-2 items-center w-full gap-[2px] [@media(min-height:855px)]:gap-[10px] ${collapsed ? "" : "2xl:mt-[5px] 2xl:pr-[10px] 2xl:pl-[12px] 2xl:items-start 2xl:gap-[2px]"}`}
        >
          <Link
            href="/home"
            className="text-white flex items-center h-[48.3px] px-[10px] rounded-full hover:bg-hover"
            aria-label="Home"
            aria-current={isHome ? "page" : undefined}
          >
            <div
              className={`shrink-0 flex justify-start ${collapsed ? "" : ""}`}
            >
              {isHome ? <GoHomeFill size={30} /> : <GoHome size={30} />}
            </div>
            <span
              className={`hidden ${collapsed ? "" : "2xl:inline"} text-xl xl:pr-4 ${isHome ? "font-extrabold" : "font-bold"}`}
            >
              Home
            </span>
          </Link>
          <Link
            href="#"
            className="text-white flex items-center h-[48.3px] px-[10px] rounded-full hover:bg-hover"
            aria-label="Explore"
            aria-current={isExplore ? "page" : undefined}
          >
            <div
              className={`shrink-0 flex justify-start ${collapsed ? "" : "2xl:w-[48px] 2xl:pl-[1px]"}`}
            >
              <IoSearchOutline size={27} />
            </div>
            <span
              className={`hidden ${collapsed ? "" : "2xl:inline"} text-xl xl:pr-4 ${isExplore ? "font-extrabold" : "font-semibold"}`}
            >
              Explore
            </span>
          </Link>
          <Link
            href="#"
            className="text-white flex items-center h-[48.3px] px-[10px]  rounded-full hover:bg-hover"
            aria-label="Notifications"
          >
            <div
              className={`shrink-0 flex justify-start ${collapsed ? "" : "2xl:w-[48px]"}`}
            >
              <BiBell size={29} />
            </div>
            <span
              className={`hidden ${collapsed ? "" : "2xl:inline"} text-xl font-semibold xl:pr-4`}
            >
              Notifications
            </span>
          </Link>
// ...existing code...
