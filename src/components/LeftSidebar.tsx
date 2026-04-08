"use client";

import Image from "next/image";
import Link from "next/link";
import { BiBell, BiEnvelope } from "react-icons/bi";
import { FaFeather, FaRegUser, FaXTwitter } from "react-icons/fa6";
import { GoHomeFill } from "react-icons/go";
import { HiOutlineUserAdd } from "react-icons/hi";
import { IoChatbubbleOutline, IoSearchOutline } from "react-icons/io5";
import { TbDotsCircleHorizontal } from "react-icons/tb";
import Grok from "../../public/images/grok-icon.png";
import { FaFeatherAlt, FaRegBookmark } from "react-icons/fa";
import { LuRocket } from "react-icons/lu";
import Profile from "./Profile";
import { useGetUser } from "@/custom-hooks/useGetUser";

export default function LeftSidebar() {
  const { profile } = useGetUser();

  return (
    <aside className="sticky top-0 left-0 shrink-0 h-screen flex lg:justify-end justify-center md:ml-[calc(-33vw+242px)] lg:ml-0">
      <div className="flex flex-col items-end w-[69px] xs:w-[89px] md:w-[72px] lg:w-[88px] 2xl:w-[279px] 2xl:pr-2 xl:pr-[3px] lg:pr-0 md:pr-[14px] lg:ml-[1px] xl:ml-[11px] 2xl:ml-[5px] h-screen">
        <div className="flex items-center justify-center 2xl:justify-start 2xl:px-[7px] pt-1 h-[53px] w-full">
          <Link
            href="/"
            suppressHydrationWarning
            className=" p-[11px] 2xl:p-[16px] text-white rounded-full hover:bg-hover"
          >
            <FaXTwitter size={29} />
          </Link>
        </div>
        <div className="flex flex-col flex-1 mt-1 2xl:mt-[5px] pr-2 pl-2 2xl:pr-[10px] 2xl:pl-[12px] 2xl:items-start items-center w-full gap-[2px] 2xl:gap-0 [@media(min-height:855px)]:gap-[11px] [@media(min-height:855px)]:2xl:gap-0">
          <Link
            href="/home"
            className="text-white flex items-center p-[10px] 2xl:px-[10px] mt-[6px] mb-[-6px] 2xl:h-[58.25px] 2xl:mb-0 2xl:mt-0 rounded-full hover:bg-hover"
          >
            <div className="2xl:w-[47px] shrink-0 flex justify-start">
              <GoHomeFill size={29} />
            </div>
            <span className="hidden 2xl:inline text-xl font-bold xl:pr-4">
              Home
            </span>
          </Link>
          <Link
            href="#"
            className="text-white flex items-center p-[10px] 2xl:px-[10px] mt-[4px] mb-[-2px] 2xl:h-[58.25px] 2xl:mb-0 2xl:mt-0 rounded-full hover:bg-hover"
          >
            <div className="2xl:w-[47px] 2xl:pl-[1px] shrink-0 flex justify-start">
              <IoSearchOutline size={27} />
            </div>
            <span className="hidden 2xl:inline text-xl font-semibold xl:pr-4">
              Explore
            </span>
          </Link>
          <Link
            href="#"
            className="text-white flex items-center p-[10px] 2xl:px-[10px] 2xl:h-[58.25px] rounded-full hover:bg-hover"
          >
            <div className="2xl:w-[47px] shrink-0 flex justify-start">
              <BiBell size={29} />
            </div>
            <span className="hidden 2xl:inline text-xl font-semibold xl:pr-4">
              Notifications
            </span>
          </Link>
          <Link
            href="#"
            className="text-white flex items-center 2xl:px-[10px] lg:pl-[5px] py-[10px] 2xl:h-[58.25px] rounded-full hover:bg-hover"
          >
            <div className="2xl:w-[47px] 2xl:pl-[2px] shrink-0 flex justify-start">
              <HiOutlineUserAdd size={28} />
            </div>
            <span className="hidden 2xl:inline text-xl font-semibold xl:pr-4">
              Follow
            </span>
          </Link>
          <Link
            href="#"
            className="text-white flex items-center p-[10px] 2xl:px-[10px] 2xl:h-[58.25px] rounded-full hover:bg-hover"
          >
            <div className="2xl:w-[47px] 2xl:pl-[2px] shrink-0 flex justify-start">
              <IoChatbubbleOutline size={27} />
            </div>
            <span className="hidden 2xl:inline text-xl font-semibold xl:pr-4">
              Chat
            </span>
          </Link>
          <Link
            href="#/*  */"
            className="text-white flex items-center 2xl:px-[10px] 2xl:py-[9px] xl:px-[14px] py-[11px] 2xl:h-[58.25px] rounded-full hover:bg-hover"
          >
            <div className="2xl:w-[47px] 2xl:pl-[2px] shrink-0 flex justify-start">
              <Image
                src={Grok}
                alt="Grok"
                width={26}
                height={26}
                className="scale-[1.4]"
              />
            </div>
            <span className="hidden 2xl:inline text-xl font-semibold xl:pr-4">
              Grok
            </span>
          </Link>
          <Link
            href="#"
            className="hidden [@media(min-height:717px)]:flex text-white items-center px-[12px] 2xl:px-[10px] py-[12px] 2xl:h-[58.25px] rounded-full hover:bg-hover"
          >
            <div className="2xl:w-[47px] 2xl:pl-[3px] shrink-0 flex justify-start">
              <FaRegBookmark size={23} />
            </div>
            <span className="hidden 2xl:inline text-xl font-semibold xl:pr-4">
              Bookmarks
            </span>
          </Link>
          <Link
            href="#"
            className="hidden [@media(min-height:767px)]:flex text-white flex items-center px-[14px] 2xl:px-[10px] 2xl:py-[12px] py-[11px] 2xl:h-[58.25px] rounded-full hover:bg-hover"
          >
            <div className="2xl:w-[47px] 2xl:pl-[2px] shrink-0 flex justify-start">
              <LuRocket size={25} />
            </div>
            <span className="hidden 2xl:inline text-xl font-semibold xl:pr-4">
              Creator Studio
            </span>
          </Link>
          <Link
            href="#"
            className="hidden [@media(min-height:667px)]:flex text-white items-center px-[12px] 2xl:px-[10px] py-[9px] mt-[2px] 2xl:h-[58.25px] 2xl:mt-0 rounded-full hover:bg-hover"
          >
            <div className="2xl:w-[47px] 2xl:pl-[2px] shrink-0 flex justify-start">
              <FaXTwitter size={25} />
            </div>
            <span className="hidden 2xl:inline text-xl font-semibold xl:pr-4">
              Premium
            </span>
          </Link>
          <Link
            href={`/${profile?.username || ""}`}
            className="text-white flex items-center px-[14px] 2xl:px-[10px] 2xl:py-[12px] py-[13px] 2xl:h-[58.25px] rounded-full hover:bg-hover"
          >
            <div className="2xl:w-[47px] 2xl:pl-[4px] shrink-0 flex justify-start">
              <FaRegUser size={21} />
            </div>
            <span className="hidden 2xl:inline text-xl font-semibold xl:pr-4">
              Profile
            </span>
          </Link>
          <Link
            href="#"
            className="text-white flex items-center px-[11px] 2xl:px-[10px] 2xl:py-[8px] py-[12px] mt-[2px] 2xl:h-[58.25px] 2xl:mt-0 rounded-full hover:bg-hover"
          >
            <div className="2xl:w-[47px] 2xl:pl-[1px] shrink-0 flex justify-start">
              <TbDotsCircleHorizontal size={27} />
            </div>
            <span className="hidden 2xl:inline text-xl font-semibold xl:pr-4">
              More
            </span>
          </Link>
          <button
            suppressHydrationWarning
            className="hidden 2xl:block bg-white text-black text-[17px] py-[13px] w-full xl:w-[233px] 2xl:mt-[20px] mt-[9px] font-bold rounded-full cursor-pointer xl:translate-x-[-1px] "
          >
            Post
          </button>
          <button
            suppressHydrationWarning
            className="flex justify-center items-center bg-primary h-[52px] w-[52px] p-[11px] ml-[6px] mt-[11px] mr-[5px] rounded-full cursor-pointer text-white block 2xl:hidden"
          >
            <FaFeatherAlt size={20} className="scale-0.5" />
          </button>
          <div className="mt-auto w-full">
            <div className="2xl:mt-[24px] mt-[14px] mb-[12px] 2xl:ml-0 ml:[2px] sm:ml-[14px] md:ml-[2px] py-3 lg:pl-3 w-full text-white flex justify-center xl:justify-between items-center">
              <Profile />
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
