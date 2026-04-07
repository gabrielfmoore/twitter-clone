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


export default function LeftSidebar() {
  
  return (
    <aside className="sticky top-0 left-0 shrink-0 h-screen flex lg:justify-end justify-center">
      <div className="flex flex-col items-end w-[69px] sm:w-[89px] md:w-[72px] lg:w-[88px] 2xl:w-[279px] 2xl:pr-2 xl:pr-[3px] lg:pr-0 md:pr-[14px] md:ml-[22px] lg:ml-[1px] xl:ml-[11px] 2xl:ml-[6px] h-screen">
        <div className="flex items-center justify-center 2xl:justify-start 2xl:px-[7px] pt-1 h-[53px] w-full">
          <Link href="/" suppressHydrationWarning className=" p-[11px] 2xl:p-[16px] text-white rounded-full hover:bg-hover">
            <FaXTwitter size={29} />
          </Link>
        </div>
        <div className="flex flex-col flex-1 mt-1 2xl:mt-[5px] pr-2 pl-2 2xl:pr-[10px] 2xl:pl-[12px] 2xl:items-start items-center w-full gap-[2px] [@media(min-height:855px)]:gap-[11px]">
          <Link
            href="/home"
            className="text-white flex items-center gap-[18px] p-[10px] mt-[6px] mb-[-6px] rounded-full hover:bg-hover"
          >
            <GoHomeFill size={29} />
            <span className="hidden 2xl:inline text-xl font-bold xl:pr-4">
              Home
            </span>
          </Link>
          <Link
            href="#"
            className="text-white flex items-center gap-[18px] p-[10px] mt-[4px] mb-[-2px] rounded-full hover:bg-hover"
          >
            <IoSearchOutline size={27} />
            <span className="hidden 2xl:inline text-xl font-semibold">
              Explore
            </span>
          </Link>
          <Link
            href="#"
            className="text-white flex items-center gap-[18px] p-[10px] rounded-full hover:bg-hover"
          >
            <BiBell size={29} />
            <span className="hidden 2xl:inline text-xl font-semibold">
              Notifications
            </span>
          </Link>
          <Link
            href="#"
            className="text-white flex items-center gap-[18px] 2xl:pl-[11px] lg:pl-[5px] py-[10px] rounded-full hover:bg-hover"
          >
            <HiOutlineUserAdd size={28} />
            <span className="hidden 2xl:inline text-xl font-semibold">
              Follow
            </span>
          </Link>
          <Link
            href="#"
            className="text-white flex items-center gap-[19px] p-[10px] rounded-full hover:bg-hover"
          >
            <IoChatbubbleOutline size={27} />
            <span className="hidden 2xl:inline text-xl font-semibold">
              Chat
            </span>
          </Link>
          <Link
            href="#/*  */"
            className="text-white flex items-center gap-[20px] 2xl:px-[11px] 2xl:py-[9px] xl:px-[14px] py-[11px] rounded-full hover:bg-hover"
          >
            <Image
              src={Grok}
              alt="Grok"
              width={26}
              height={26}
              className="scale-[1.4]"
            />
            <span className="hidden 2xl:inline text-xl font-semibold">
              Grok
            </span>
          </Link>
          <Link
            href="#"
            className="hidden [@media(min-height:717px)]:flex text-white items-center gap-[20px] px-[12px] py-[12px] rounded-full hover:bg-hover"
          >
            <FaRegBookmark size={23}/>
            <span className="hidden 2xl:inline text-xl font-semibold">Bookmarks</span>
          </Link>
          <Link
            href="#"
            className="hidden [@media(min-height:767px)]:flex text-white flex items-center gap-[22px] px-[14px] 2xl:py-[12px] py-[11px] rounded-full hover:bg-hover"
          >
            <LuRocket size={25} />
            <span className="hidden 2xl:inline text-xl font-semibold">
              Creator Studio
            </span>
          </Link>
          <Link
            href="#"
            className="hidden [@media(min-height:667px)]:flex text-white items-center gap-[20px] px-[12px] py-[9px] mt-[2px] rounded-full hover:bg-hover"
          >
            <FaXTwitter size={25} />
            <span className="hidden 2xl:inline text-xl font-semibold">Premium</span>
          </Link>
          <Link
            href="#"
            className="text-white flex items-center gap-[22px] px-[14px] 2xl:py-[12px] py-[13px] rounded-full hover:bg-hover"
          >
            <FaRegUser size={21} />
            <span className="hidden 2xl:inline text-xl font-semibold">
              Profile
            </span>
          </Link>
          <Link
            href="#"
            className="text-white flex items-center gap-[19px] px-[11px] 2xl:py-[8px] py-[12px] mt-[2px] rounded-full hover:bg-hover"
          >
            <TbDotsCircleHorizontal size={27} />
            <span className="hidden 2xl:inline text-xl font-semibold">
              More
            </span>
          </Link>
          <button suppressHydrationWarning className="hidden 2xl:block bg-white text-black text-[17px] py-[13px] w-full xl:w-[233px] mt-[9px] font-bold rounded-full cursor-pointer xl:translate-x-[-1px] ">
            Post
          </button>
          <button suppressHydrationWarning className="flex justify-center items-center bg-primary h-[52px] w-[52px] p-[11px] ml-[6px] mt-[11px] mr-[5px] rounded-full cursor-pointer text-white block 2xl:hidden">
            <FaFeatherAlt size={20} className="scale-0.5" />
          </button>
          <div className="mt-auto w-full">
            <div className="2xl:mt-[11px] mt-[14px] mb-[12px] 2xl:ml-0 ml:[2px] sm:ml-[14px] md:ml-[2px] py-3 lg:pl-3 w-full text-white flex justify-center xl:justify-between items-center">
              <Profile />
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
