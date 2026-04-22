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
      className={`sticky top-0 left-0 shrink-0 h-dvh flex justify-center pr-[1px] shadow-[inset_-1px_0_0_0_#333639] md:ml-[calc(-33vw+242px)] lg:ml-0 ${isChat ? "" : "2xl:overflow-x-clip"}`}
      role="navigation"
      aria-label="Sidebar"
    >
      <div
        className={`flex flex-col items-start h-dvh w-[68px] xs:w-[88px] xl:w-[88px] ${isChat ? "2xl:w-[69px]" : "2xl:w-[275px]"}`}
      >
        <div
          className={`flex items-center justify-center pt-1 h-[53px] w-full ${isChat ? "" : "2xl:justify-start 2xl:px-[9px]"}`}
        >
          <Link
            href="/"
            suppressHydrationWarning
            className={`p-[10px] relative ${isChat ? "" : ""} text-white rounded-full hover:bg-hover`}
          >
            <FaXTwitter size={29} />
            <div className="absolute top-full left-1/2 -translate-x-1/2 translate-y-[-8px] whitespace-nowrap text-[10px]">
              *CLONE!
            </div>
          </Link>
        </div>
        <div
          className={`flex flex-col flex-1 items-center w-full overflow-y-auto scrollbar-hidden [&>*]:shrink-0 mt-[5px] [@media(min-height:855px)]:mt-[9px] pr-2 pl-2 gap-[2px] [@media(min-height:855px)]:gap-[10px] ${isChat ? "" : "2xl:pr-[8px] 2xl:pl-[9px] 2xl:items-start 2xl:gap-[2px]"}`}
        >
          <Link
            href="/home"
            className="text-white flex items-center h-[48.3px] px-[10px] rounded-full hover:bg-hover"
            aria-label="Home"
            aria-current={isHome ? "page" : undefined}
          >
            <div
              className={`shrink-0 flex justify-start ${isChat ? "" : "2xl:w-[48px]"}`}
            >
              {isHome ? <GoHomeFill size={30} /> : <GoHome size={30} />}
            </div>
            <span
              className={`hidden ${isChat ? "" : "2xl:inline"} text-xl xl:pr-4 ${isHome ? "font-extrabold" : "font-bold"}`}
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
              className={`shrink-0 flex justify-start ${isChat ? "" : "2xl:w-[48px] 2xl:pl-[1px]"}`}
            >
              <IoSearchOutline size={27} />
            </div>
            <span
              className={`hidden ${isChat ? "" : "2xl:inline"} text-xl xl:pr-4 ${isExplore ? "font-extrabold" : "font-semibold"}`}
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
              className={`shrink-0 flex justify-start ${isChat ? "" : "2xl:w-[48px]"}`}
            >
              <BiBell size={29} />
            </div>
            <span
              className={`hidden ${isChat ? "" : "2xl:inline"} text-xl font-semibold xl:pr-4`}
            >
              Notifications
            </span>
          </Link>
          <Link
            href="#"
            className="text-white flex items-center h-[48.3px] px-[10px] 2xl:px-[9px] rounded-full hover:bg-hover"
            aria-label="Follow"
            aria-current={isFollow ? "page" : undefined}
          >
            <div
              className={`shrink-0 flex justify-start ${isChat ? "" : "2xl:w-[48px] 2xl:pl-[2px]"}`}
            >
              <HiOutlineUserAdd size={28} />
            </div>
            <span
              className={`hidden ${isChat ? "" : "2xl:inline"} text-xl xl:pr-4 ${isFollow ? "font-extrabold" : "font-semibold"}`}
            >
              Follow
            </span>
          </Link>
          <Link
            href="/home/messages"
            className="text-white flex items-center h-[48.3px] px-[10px] 2xl:px-[10px] rounded-full hover:bg-hover"
            aria-label="Chat"
            aria-current={isChat ? "page" : undefined}
          >
            <div
              className={`shrink-0 flex justify-start relative 2xl:pl-[2px] ${isChat ? "" : "2xl:w-[48px]"}`}
            >
              {isChat ? (
                <TbMessageCircleFilled size={27} />
              ) : (
                <IoChatbubbleOutline size={27} />
              )}
              {unreadConvos && unreadConvos.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-[11px] font-bold min-w-[18px] h-[18px] flex items-center justify-center rounded-full px-[5px]">
                  {unreadConvos.length > 99 ? "99+" : unreadConvos.length}
                </span>
              )}
            </div>
            <span
              className={`hidden ${isChat ? "" : "2xl:inline"} text-xl xl:pr-4 ${isChat ? "font-extrabold" : "font-semibold"}`}
            >
              Chat
            </span>
          </Link>
          <Link
            href="#/*  */"
            className={`text-white flex items-center h-[48.3px] px-[10px] rounded-full hover:bg-hover ${isChat ? " 2xl:-ml-[2px]" : "2xl:ml-[1px]"}`}
            aria-label="Grok"
          >
            <div
              className={`shrink-0 flex justify-start ${isChat ? "2xl:w-[48px" : "2xl:w-[48px]"}`}
            >
              <Image
                src={Grok}
                alt="Grok"
                width={26}
                height={26}
                className="scale-[1.4]"
              />
            </div>
            <span
              className={`hidden ${isChat ? "" : "2xl:inline"} text-xl font-semibold xl:pr-4`}
            >
              Grok
            </span>
          </Link>
          <Link
            href="#"
            className="hidden [@media(min-height:717px)]:flex text-white items-center h-[48.3px] px-[10px] 2xl:px-[10px] rounded-full hover:bg-hover"
            aria-label="Bookmarks"
            aria-current={isBookmarks ? "page" : undefined}
          >
            <div
              className={`shrink-0 flex justify-start ${isChat ? "" : "2xl:w-[48px] 2xl:pl-[3px]"}`}
            >
              <FaRegBookmark size={23} />
            </div>
            <span
              className={`hidden ${isChat ? "" : "2xl:inline"} text-xl xl:pr-4 ${isBookmarks ? "font-extrabold" : "font-semibold"}`}
            >
              Bookmarks
            </span>
          </Link>
          <Link
            href="#"
            className="hidden [@media(min-height:767px)]:flex text-white flex items-center h-[48.3px] px-[10px] 2xl:px-[10px] rounded-full hover:bg-hover"
            aria-label="Creator Studio"
          >
            <div
              className={`shrink-0 flex justify-start ${isChat ? "" : "2xl:w-[48px] 2xl:pl-[2px]"}`}
            >
              <LuRocket size={25} />
            </div>
            <span
              className={`hidden ${isChat ? "" : "2xl:inline"} text-xl font-semibold xl:pr-4`}
            >
              Creator Studio
            </span>
          </Link>
          <Link
            href="#"
            className="hidden [@media(min-height:667px)]:flex text-white items-center h-[48.3px] px-[10px] 2xl:px-[10px] rounded-full hover:bg-hover"
            aria-label="Premium"
          >
            <div
              className={`shrink-0 flex justify-start ${isChat ? "" : "2xl:w-[48px] 2xl:pl-[2px]"}`}
            >
              <FaXTwitter size={25} />
            </div>
            <span
              className={`hidden ${isChat ? "" : "2xl:inline"} text-xl font-semibold xl:pr-4`}
            >
              Premium
            </span>
          </Link>
          <Link
            href={`/${profile?.username || ""}`}
            className="text-white flex items-center h-[48.3px] px-[10px] 2xl:px-[11px] rounded-full hover:bg-hover"
            aria-label="Profile"
            aria-current={isProfile ? "page" : undefined}
          >
            <div
              className={`shrink-0 flex justify-start ${isChat ? "" : "2xl:w-[48px] 2xl:pl-[2px]"}`}
            >
              {isProfile ? <HiUser size={24} /> : <HiOutlineUser size={24} />}
            </div>
            <span
              className={`hidden ${isChat ? "" : "2xl:inline"} text-xl xl:pr-4 ${isProfile ? "font-extrabold" : "font-semibold"}`}
            >
              Profile
            </span>
          </Link>
          <Link
            href="#"
            className="text-white flex items-center h-[48.3px] px-[10px] 2xl:px-[10px] rounded-full hover:bg-hover"
            aria-label="More"
          >
            <div
              className={`shrink-0 flex justify-start ${isChat ? "" : "2xl:w-[48px] 2xl:pl-[1px]"}`}
            >
              <TbDotsCircleHorizontal size={27} />
            </div>
            <span
              className={`hidden ${isChat ? "" : "2xl:inline"} text-xl font-semibold xl:pr-4`}
            >
              More
            </span>
          </Link>
          <button
            suppressHydrationWarning
            onClick={() => setShowPostModal(true)}
            className={`${isChat ? "hidden" : "hidden 2xl:block"} bg-white text-black text-[17px] py-[13px] w-full xl:w-[233px] 2xl:mt-[8px] [@media(min-width:1265px)_and_(min-height:855px)]:mt-[17px] mt-[9px] font-bold rounded-full cursor-pointer xl:-ml-[1px]`}
          >
            Post
          </button>
          <button
            suppressHydrationWarning
            onClick={() => setShowPostModal(true)}
            className={`flex justify-center items-center bg-primary h-[52px] w-[52px] p-[11px] ml-[6px] mt-[7px] mr-[5px] rounded-full cursor-pointer text-white block ${isChat ? "" : "2xl:hidden"}`}
          >
            <FaFeatherAlt size={20} className="scale-0.5" />
          </button>
          {showPostModal && (
            <CreatePostModal onClose={() => setShowPostModal(false)} />
          )}
          <div className="mt-auto w-full">
            <div
              className={`mt-[14px] mb-[12px] xl:mr-1 py-3 w-full text-white flex justify-center items-center ${isChat ? "" : "2xl:mt-[24px] md:ml-[0] 2xl:ml-0 ml:[2px] xl:justify-between"}`}
            >
              <Profile collapsed={isChat} />
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
