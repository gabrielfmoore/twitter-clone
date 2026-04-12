"use client";

import { useEffect, useRef } from "react";
import { Tweet } from "@/types/types";
import { FaRegComment, FaRegTrashAlt } from "react-icons/fa";
import { IoIosStats } from "react-icons/io";
import { LuPencil, LuPin, LuList, LuMegaphone, LuCode } from "react-icons/lu";
import { HiOutlineStar } from "react-icons/hi2";
import { IoInformationCircleOutline } from "react-icons/io5";

interface TweetDropdownProps {
  tweet: Tweet;
  onClose: () => void;
}

const menuItems = [
  { icon: FaRegTrashAlt, label: "Delete", red: true },
  { icon: LuPencil, label: "Edit" },
  { icon: LuPin, label: "Pin to your profile" },
  { icon: HiOutlineStar, label: "Highlight on your profile" },
  { icon: LuList, label: "Add/remove from Lists" },
  { icon: IoInformationCircleOutline, label: "Add/remove content disclosure" },
  { icon: FaRegComment, label: "Change who can reply" },
  { icon: IoIosStats, label: "View post activity" },
  { icon: LuCode, label: "Embed post" },
  { icon: IoIosStats, label: "View post analytics" },
  { icon: LuMegaphone, label: "Request Community Note" },
];

export default function TweetDropdown({ tweet, onClose }: TweetDropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [onClose]);

  return (
    <div
      ref={dropdownRef}
      className="w-[290px] max-h-[484px] overflow-y-auto bg-black rounded-xl border border-border shadow-[0_0_15px_rgba(255,255,255,0.1)] py-1 flex flex-col"
    >
      {menuItems.map((item) => (
        <button
          key={item.label}
          className="flex items-center gap-3 px-4 py-3 hover:bg-hover cursor-pointer w-full text-left"
        >
          <item.icon
            size={18}
            className={item.red ? "text-red-500" : "text-white"}
          />
          <span
            className={`text-[15px] font-bold ${item.red ? "text-red-500" : "text-white"}`}
          >
            {item.label}
          </span>
        </button>
      ))}
    </div>
  );
}
