"use client";

import { useState } from "react";
import { FaRegBookmark, FaRegComment } from "react-icons/fa6";
import { FiRepeat } from "react-icons/fi";
import { RiShare2Line } from "react-icons/ri";
import ReplyModal from "./ReplyModal";
import { Tweet } from "@/types/types";
import { useGetComments } from "@/custom-hooks/useComment";
import LikeButton from "./LikeButton";

export default function TweetActions({ tweet }: { tweet: Tweet }) {
  const [replyOpen, setReplyOpen] = useState(false);
  const { data: comments } = useGetComments(tweet.id);
  const commentCount = comments?.length ?? tweet.comments?.[0]?.count ?? 0;

  return (
    <>
      <div className="flex justify-between mt-1 text-secondary-text">
        <div
          onClick={() => setReplyOpen(true)}
          className="flex items-center gap-1 hover:text-blue-400 cursor-pointer group"
        >
          <div className="w-[34.75px] h-[34.75px] -m-2 flex items-center justify-center rounded-full group-hover:bg-blue-400/12">
            <FaRegComment />
          </div>
          <span className="text-sm">{commentCount || null}</span>
        </div>
        <div className="flex items-center gap-1 hover:text-green-400 cursor-pointer group">
          <div className="w-[34.75px] h-[34.75px] -m-2 flex items-center justify-center rounded-full group-hover:bg-green-400/12">
            <FiRepeat />
          </div>
          <span className="text-sm">0</span>
        </div>
        <LikeButton tweetId={tweet.id} />
        <div className="flex items-center gap-4">
          <div className="hover:text-blue-400 cursor-pointer group">
            <div className="w-[34.75px] h-[34.75px] -m-2 flex items-center justify-center rounded-full group-hover:bg-blue-400/12">
              <FaRegBookmark />
            </div>
          </div>
          <div className="hover:text-blue-400 cursor-pointer group">
            <div className="w-[34.75px] h-[34.75px] -m-2 flex items-center justify-center rounded-full group-hover:bg-blue-400/12">
              <RiShare2Line size={20} />
            </div>
          </div>
        </div>
      </div>
      {replyOpen && (
        <ReplyModal tweet={tweet} onClose={() => setReplyOpen(false)} />
      )}
    </>
  );
}
