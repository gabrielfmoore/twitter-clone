"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { BsThreeDots } from "react-icons/bs";
import Grok from "@/public/images/Grok-transparent.png";
import { FaRegTrashAlt } from "react-icons/fa";
import { IoIosStats } from "react-icons/io";
import { LuPin, LuList, LuMegaphone, LuCode } from "react-icons/lu";
import { HiOutlineStar } from "react-icons/hi2";

import { useGetUser } from "@/custom-hooks/useGetUser";
import { BiVolumeMute } from "react-icons/bi";
import { RiUserUnfollowLine } from "react-icons/ri";
import { MdBlock } from "react-icons/md";
import { PiSmileySad } from "react-icons/pi";
import { VscFlag } from "react-icons/vsc";
import { useDeleteComment } from "@/custom-hooks/useComment";
import { useIsFollowing, useToggleFollow } from "@/custom-hooks/useFollow";
import DeleteConfirmModal from "./DeleteConfirmModal";

interface CommentMenuProps {
  comment: {
    id: string;
    user_id: string;
    tweet_id: string;
    image_url?: string | null;
    image_path?: string | null;
    profiles?: { username: string };
  };
}

const ownerItems: { icon: React.ComponentType<{ size?: number; className?: string }>; label: string; red?: boolean }[] = [
  { icon: FaRegTrashAlt, label: "Delete", red: true },
  { icon: LuPin, label: "Pin to your profile" },
  { icon: HiOutlineStar, label: "Highlight on your profile" },
  { icon: LuList, label: "Add/remove from Lists" },
  { icon: BiVolumeMute, label: "Mute this conversation" },
  { icon: IoIosStats, label: "View post activity" },
  { icon: LuCode, label: "Embed post" },
  { icon: IoIosStats, label: "View post analytics" },
  { icon: LuMegaphone, label: "Request Community Note" },
];

type MenuItem = { icon: React.ComponentType<{ size?: number; className?: string }>; label: string; red?: boolean };

export default function CommentMenu({ comment }: CommentMenuProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { profile } = useGetUser();
  const isOwner = profile?.id === comment.user_id;
  const { data: isFollowing } = useIsFollowing(profile?.id, comment.user_id);
  const { mutate: toggleFollow } = useToggleFollow();

  const getOtherItemsDynamic = (username: string): MenuItem[] => [
    { icon: PiSmileySad, label: "Not interested in this post" },
    { icon: RiUserUnfollowLine, label: isFollowing ? `Unfollow @${username}` : `Follow @${username}` },
    { icon: LuList, label: "Add/remove from Lists" },
    { icon: BiVolumeMute, label: `Mute @${username}` },
    { icon: MdBlock, label: `Block @${username}` },
    { icon: IoIosStats, label: "View post activity" },
    { icon: LuCode, label: "Embed post" },
    { icon: VscFlag, label: "Report post" },
    { icon: LuMegaphone, label: "Request Community Note" },
  ];

  const menuItems = isOwner ? ownerItems : getOtherItemsDynamic(comment.profiles?.username || "");
  const deleteMutation = useDeleteComment();

  const handleMenuClick = (label: string) => {
    if (label === "Delete") {
      setShowDeleteModal(true);
      setDropdownOpen(false);
    } else if (label.startsWith("Follow @") || label.startsWith("Unfollow @")) {
      if (profile?.id) {
        toggleFollow({
          followerId: profile.id,
          followingId: comment.user_id,
          isFollowing: !!isFollowing,
        });
      }
      setDropdownOpen(false);
    }
  };

  const handleDeleteConfirm = () => {
    deleteMutation.mutate(
      { commentId: comment.id, tweetId: comment.tweet_id, imagePath: comment.image_path ?? undefined },
      {
        onSuccess: () => {
          setShowDeleteModal(false);
        },
      }
    );
  };

  useEffect(() => {
    if (!dropdownOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [dropdownOpen]);

  return (
    <div ref={menuRef} className="relative shrink-0 flex mt-[2px]">
      <Image
        src={Grok}
        alt="Grok"
        width={20}
        height={20}
        className="hidden xs:flex w-[20px] h-[20px] mr-[5px] opacity-80 grayscale cursor-pointer scale-110 translate-x-[2px] hover:opacity-100 hover:grayscale-0"
      />
      <BsThreeDots
        onClick={() => setDropdownOpen(!dropdownOpen)}
        size={17}
        className="ml-[5px] text-secondary-text cursor-pointer translate-y-[2px]"
      />
      {dropdownOpen && (
        <div className="absolute top-0 right-0 z-50 w-[250px] max-w-[75vw] bg-black rounded-xl border border-border shadow-[0_0_15px_rgba(255,255,255,0.1)] py-1 flex flex-col">
          {menuItems.map((item) => (
            <button
              key={item.label}
              onClick={() => handleMenuClick(item.label)}
              className="flex h-[44px] items-center gap-[10px] px-4 py-3 hover:bg-hover cursor-pointer w-full text-left"
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
      )}
      {showDeleteModal && (
        <DeleteConfirmModal
          onConfirm={handleDeleteConfirm}
          onCancel={() => {
            setShowDeleteModal(false);
            setDropdownOpen(true);
          }}
          isDeleting={deleteMutation.isPending}
        />
      )}
    </div>
  );
}
