"use client";

import Image from "next/image";
import { MdVerified } from "react-icons/md";
import { IoClose } from "react-icons/io5";
import { Tweet } from "@/types/types";
import { useGetUser } from "@/custom-hooks/useGetUser";
import { useEffect, useRef, useState } from "react";
import { formatTweetDate } from "@/lib/formatDate";

interface ReplyModalProps {
  tweet: Tweet;
  onClose: () => void;
}

export default function ReplyModal({ tweet, onClose }: ReplyModalProps) {
  const { profile } = useGetUser();
  const [reply, setReply] = useState("");
  const isDisabled = reply.trim() === "";
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-background-2 pt-12">
      <div
        ref={modalRef}
        className="bg-black w-full max-w-[600px] rounded-2xl border border-border p-4"
      >
        {/* Header */}
        <div className="flex items-center mb-4">
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-hover cursor-pointer text-white"
          >
            <IoClose size={22} />
          </button>
        </div>

        {/* Original tweet */}
        <div className="flex gap-3">
          <div className="flex flex-col items-center">
            <Image
              src={tweet.profiles?.avatar_url || "/images/default-avatar.svg"}
              alt="Profile"
              width={40}
              height={40}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="w-[2px] flex-1 bg-border mt-1" />
          </div>
          <div className="flex-1 min-w-0 pb-4">
            <div className="flex gap-1 text-[15px]">
              <span className="text-white font-bold">{tweet.profiles?.name}</span>
              <MdVerified className="text-primary mt-[2px] w-[17px] h-[17px]" />
              <span className="text-secondary-text">@{tweet.profiles?.username}</span>
              <span className="text-secondary-text">·</span>
              <span className="text-secondary-text">{formatTweetDate(tweet.created_at)}</span>
            </div>
            {tweet.content && (
              <p className="text-white text-[15px] mt-1 leading-[1.3]">{tweet.content}</p>
            )}
            <p className="text-secondary-text text-[15px] mt-3">
              Replying to{" "}
              <span className="text-primary">@{tweet.profiles?.username}</span>
            </p>
          </div>
        </div>

        {/* Reply input */}
        <div className="flex gap-3 mt-2">
          <Image
            src={profile?.avatar_url || "/images/default-avatar.svg"}
            alt="Your avatar"
            width={40}
            height={40}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div className="flex-1">
            <input
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              placeholder="Post your reply"
              suppressHydrationWarning
              className="w-full py-3 text-white text-xl placeholder:text-secondary-text placeholder:font-normal outline-none bg-transparent"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end mt-2 border-t border-border pt-3">
          <button
            suppressHydrationWarning
            disabled={isDisabled}
            className={`text-[15px] font-bold px-4 py-[6px] rounded-full ${
              isDisabled
                ? "bg-primary/50 text-white/50 cursor-not-allowed"
                : "bg-primary text-white cursor-pointer"
            }`}
          >
            Reply
          </button>
        </div>
      </div>
    </div>
  );
}
