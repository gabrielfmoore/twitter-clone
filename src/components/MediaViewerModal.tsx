"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import { IoClose } from "react-icons/io5";
import { MdVerified } from "react-icons/md";
import { useGetTweetById } from "@/custom-hooks/useTweet";
import TweetActions from "./TweetActions";
import ReplyPost from "./ReplyPost";
import Comments from "./Comments";
import { formatPostDate } from "@/lib/formatDate";
import TweetMenu from "./TweetMenu";

interface MediaViewerModalProps {
  tweetId: string;
  imageUrl: string;
  onClose: () => void;
}

export default function MediaViewerModal({
  tweetId,
  imageUrl,
  onClose,
}: MediaViewerModalProps) {
  const { data: tweet, isLoading } = useGetTweetById(tweetId);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKey);
    };
  }, [onClose]);

  return createPortal(
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop — click to close */}
      <div
        className="absolute inset-0 bg-black/80"
        onClick={onClose}
      />

      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 left-4 z-50 p-2 rounded-full bg-black/80 hover:bg-black/60 cursor-pointer"
      >
        <IoClose size={20} className="text-white" />
      </button>

      {/* Image area */}
      <div
        className="relative flex-1 flex items-center justify-center min-w-0"
        onClick={onClose}
      >
        <Image
          src={imageUrl}
          alt="Media"
          width={1200}
          height={900}
          className="max-w-full max-h-full object-contain"
          onClick={(e) => e.stopPropagation()}
        />
      </div>

      {/* Right panel — tweet detail + replies (lg+ only) */}
      <div className="hidden lg:flex flex-col w-[350px] shrink-0 bg-black border-l border-border overflow-y-auto relative">
        {isLoading ? (
          <div className="flex items-center justify-center min-h-[200px]">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : tweet ? (
          <>
            {/* Author row */}
            <div className="flex w-full px-4 pt-3 pb-0">
              <div className="flex flex-col w-full">
                <div className="flex w-full justify-between">
                  <div className="flex">
                    <Link href={`/${tweet.profiles?.username || ""}`}>
                      <Image
                        src={
                          tweet.profiles?.avatar_url ||
                          "/images/default-avatar.svg"
                        }
                        alt="Profile"
                        width={100}
                        height={100}
                        className="w-10 h-10 mr-2 object-cover rounded-full shrink-0"
                      />
                    </Link>
                    <div className="flex flex-col text-[15px] cursor-pointer">
                      <div className="flex gap-1">
                        <span className="text-white font-bold hover:underline">
                          {tweet.profiles?.name}
                        </span>
                        <MdVerified className="text-primary mt-[2px] w-[17px] h-[17px]" />
                      </div>
                      <span className="text-secondary-text font-light">
                        @{tweet.profiles?.username}
                      </span>
                    </div>
                  </div>
                  <TweetMenu tweet={tweet} />
                </div>

                {/* Content */}
                <div className="text-white my-3">
                  {tweet.content && (
                    <p className="text-[15px] font-[400] leading-[1.3]">
                      {tweet.content}
                    </p>
                  )}
                </div>

                {/* Timestamp */}
                <div className="text-secondary-text text-[15px] pb-3 border-b border-border">
                  {formatPostDate(tweet.created_at)}
                </div>

                {/* Actions */}
                <div className="py-1 border-b border-border">
                  <TweetActions tweet={tweet} />
                </div>
              </div>
            </div>

            {/* Reply + Comments */}
            <ReplyPost tweetId={tweet.id} tweetOwnerId={tweet.user_id} />
            <Comments tweetId={tweet.id} />
          </>
        ) : null}
      </div>
    </div>,
    document.body
  );
}
