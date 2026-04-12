"use client";

import Image from "next/image";
import { MdVerified } from "react-icons/md";
import Link from "next/link";
import { useGetTweets } from "@/custom-hooks/useTweet";
import { Tweet } from "@/types/types";
import { useGetUser } from "@/custom-hooks/useGetUser";
import TweetActions from "./TweetActions";
import { formatTweetDate } from "@/lib/formatDate";
import TweetMenu from "./TweetMenu";

export default function Posts() {
  const { profile } = useGetUser();

  const { isLoading, isError, error, data: tweets } = useGetTweets();
  if (isLoading)
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  if (isError)
    return <div className="text-white text-2xl">Error: {error.message}</div>;

  return (
    <div>
      <div className="flex h-[49px] w-full justify-center items-center text-[15px] font-[500  ] text-primary border-b border-border">
        Show 70 posts
      </div>
      <div className="flex flex-col gap-3">
        {tweets?.map((tweet: Tweet) => {
          return (
            <div
              key={tweet.id}
              className="flex w-full px-4 py-3 border-b border-border"
            >
              <Link
                href={`/${tweet.profiles?.username || profile?.username || ""}`}
              >
                <Image
                  src={
                    tweet.profiles?.avatar_url || "/images/default-avatar.svg"
                  }
                  alt="Profile"
                  width={100}
                  height={100}
                  className="w-10 h-10 mr-4 object-cover rounded-full shrink-0"
                />
              </Link>
              <div className="flex flex-col w-full min-w-0">
                <div className="w-full wrap-nowrap justify-between flex ">
                  <div className="flex justify-between gap-1 text-sm">
                    <div className="flex gap-[2px] text-[15px] cursor-pointer ">
                      <span className="text-white font-bold hover:underline">
                        {tweet.profiles?.name}
                      </span>
                      <MdVerified className="text-primary mt-[2px] w-[17px] h-[17px]" />
                      <span className="text-secondary-text font-light ml-[3px]">
                        @{tweet.profiles?.username}
                      </span>
                      <span className="text-secondary-text font-light ml-[2px]">
                        ·
                      </span>
                      <p className="text-secondary-text hover:underline">
                        {formatTweetDate(tweet.created_at)}
                      </p>
                    </div>
                  </div>
                  <TweetMenu tweet={tweet} />
                </div>
                <Link
                  href={`/home/post/${tweet.id}`}
                  className="text-white mb-2 block"
                >
                  <p className="`text-[15px] font-[400] leading-[1.3]">
                    {tweet.content}
                  </p>
                  {tweet.image_url && (
                    <Image
                      src={tweet.image_url}
                      alt="Tweet image"
                      width={600}
                      height={400}
                      className="w-full mt-2 rounded-2xl border border-border object-cover"
                    />
                  )}
                </Link>
                <TweetActions tweet={tweet} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
