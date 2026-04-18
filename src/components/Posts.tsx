"use client";

import { useState } from "react";
import Image from "next/image";
import { MdVerified } from "react-icons/md";
import Link from "next/link";
import { useGetTweets, useGetFollowingTweets } from "@/custom-hooks/useTweet";
import { Tweet } from "@/types/types";
import { useGetUser } from "@/custom-hooks/useGetUser";
import TweetActions from "./TweetActions";
import { formatTweetDate } from "@/lib/formatDate";
import TweetMenu from "./TweetMenu";
import { FiRepeat } from "react-icons/fi";
import MediaViewerModal from "./MediaViewerModal";

export default function Posts({ tab = "For you" }: { tab?: string }) {
  const [mediaViewer, setMediaViewer] = useState<{ tweetId: string; imageUrl: string } | null>(null);
  const { profile } = useGetUser();

  const {
    isLoading: allLoading,
    isError: allError,
    error: allErr,
    data: allTweets,
  } = useGetTweets();
  const { isLoading: followingLoading, data: followingTweets } =
    useGetFollowingTweets(profile?.id);

  const isFollowingTab = tab === "Following";
  const isLoading = isFollowingTab ? followingLoading : allLoading;
  const tweets = isFollowingTab ? followingTweets : allTweets;
  if (isLoading)
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  if (allError)
    return <div className="text-white text-2xl">Error: {allErr.message}</div>;

  return (
    <div>
      <div className="flex flex-col gap-3">
        {tweets?.map((tweet: Tweet) => {
          return (
            <div
              key={tweet.retweet_key || tweet.id}
              className="flex flex-col w-full px-4 py-3 border-b border-border"
            >
              {tweet.retweeted_by && (
                <div className="flex items-center gap-2 ml-[40px] mb-1 text-secondary-text text-[13px]">
                  <FiRepeat size={14} />
                  <span className="font-bold">
                    {tweet.retweeted_by.name} reposted
                  </span>
                </div>
              )}
              <div className="flex">
                <Link
                  href={`/${tweet.profiles?.username || profile?.username || ""}`}
                  className="self-start shrink-0 w-10 h-10 mr-4 relative z-10"
                >
                  <Image
                    src={
                      tweet.profiles?.avatar_url || "/images/default-avatar.svg"
                    }
                    alt="Profile"
                    width={100}
                    height={100}
                    className="w-10 h-10 object-cover rounded-full"
                  />
                </Link>
                <div className="flex flex-col w-full min-w-0">
                  <div className="w-full wrap-nowrap justify-between flex ">
                    <div className="flex justify-between gap-1 text-sm">
                      <div className="flex gap-[2px] text-[15px] cursor-pointer ">
                        <Link href={`/${tweet.profiles?.username || profile?.username || ""}`}>
                          <span className="text-white font-bold hover:underline">
                            {tweet.profiles?.name}
                          </span>
                        </Link>
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
                    <p className="text-[15px] font-[400] leading-[1.3]">
                      {tweet.content}
                    </p>
                  </Link>
                  {tweet.image_url && (
                    <div
                      className="mb-2 cursor-pointer"
                      onClick={() => setMediaViewer({ tweetId: tweet.id, imageUrl: tweet.image_url! })}
                    >
                      <Image
                        src={tweet.image_url}
                        alt="Tweet image"
                        width={600}
                        height={400}
                        className="w-full rounded-2xl border border-border object-cover"
                      />
                    </div>
                  )}
                  <TweetActions tweet={tweet} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {mediaViewer && (
        <MediaViewerModal
          tweetId={mediaViewer.tweetId}
          imageUrl={mediaViewer.imageUrl}
          onClose={() => setMediaViewer(null)}
        />
      )}
    </div>
  );
}
