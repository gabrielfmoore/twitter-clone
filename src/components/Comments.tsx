"use client";

import Image from "next/image";
import { MdVerified } from "react-icons/md";
import Link from "next/link";
import { useGetComments } from "@/custom-hooks/useComment";
import { formatTweetDate } from "@/lib/formatDate";
import CommentMenu from "./CommentMenu";

type Comment = {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  tweet_id: string;
  profiles: {
    username: string;
    avatar_url: string;
    name: string;
  } | undefined;
};

export default function Comments({ tweetId }: { tweetId: string }) {
  const { error, isError, isLoading, data: comments } = useGetComments(tweetId);

  if (isLoading)
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );

  if (!comments || comments.length === 0) return null;
  if (isError)
    return (
      <div className="text-white p-4">
        <p className="mt-4">Error loading comments: {error.message}</p>
      </div>
    );

  return (
    <div>
      {comments.map((comment: Comment) => (
        <div
          key={comment.id}
          className="flex w-full px-4 py-3 border-b border-border"
        >
          <Link href={`/${comment.profiles?.username || ""}`}>
            <Image
              src={comment.profiles?.avatar_url || "/images/default-avatar.svg"}
              alt="Profile"
              width={100}
              height={100}
              className="w-10 h-10 mr-4 object-cover rounded-full shrink-0"
            />
          </Link>
          <div className="flex flex-col w-full min-w-0">
            <div className="w-full flex justify-between">
              <div className="flex flex-wrap gap-1 text-[15px]">
                <span className="text-white whitespace-nowrap font-bold hover:underline cursor-pointer">
                  {comment.profiles?.name}
                </span>
                <MdVerified className="text-primary mt-[2px] w-[17px] h-[17px]" />
                <span className="text-secondary-text font-light ml-[3px]">
                  @{comment.profiles?.username}
                </span>
                <span className="text-secondary-text font-light">
                  · {formatTweetDate(comment.created_at)}
                </span>
              </div>
              <CommentMenu comment={comment} />
            </div>
            <p className="text-white text-[15px] leading-[1.3] mt-1">
              {comment.content}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
