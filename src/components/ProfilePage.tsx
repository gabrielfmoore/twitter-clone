"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { IoSearch, IoClose, IoCalendarOutline } from "react-icons/io5";
import { HiBadgeCheck } from "react-icons/hi";
import { MdVerified } from "react-icons/md";
import EditProfileModal from "./EditProfileModal";
import FollowButton from "./FollowButton";
import GoBackButton from "./GoBackButton";
import { useGetUser } from "@/custom-hooks/useGetUser";
import { useGetUserTweetsAndRetweets, useGetUserMedia } from "@/custom-hooks/useTweet";
import { useFollowingCount, useFollowerCount } from "@/custom-hooks/useFollow";
import { useGetLikedTweets } from "@/custom-hooks/useLike";
import { IoIosArrowForward } from "react-icons/io";
import { Tweet } from "@/types/types";
import TweetActions from "./TweetActions";
import TweetMenu from "./TweetMenu";
import { formatTweetDate } from "@/lib/formatDate";
import { FiRepeat } from "react-icons/fi";
import { getProfileByUsername } from "@/services/auth";
import { useQuery } from "@tanstack/react-query";
import MediaViewerModal from "./MediaViewerModal";

const tabs = ["Posts", "Replies", "Highlights", "Articles", "Media", "Likes"];

export default function ProfilePage({ username }: { username: string }) {
  const [activeTab, setActiveTab] = useState("Posts");
  const [showVerified, setShowVerified] = useState(true);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [mediaViewer, setMediaViewer] = useState<{ tweetId: string; imageUrl: string } | null>(null);
  const { profile: loggedInProfile, loading } = useGetUser();

  const { data: viewedProfile, isLoading: profileLoading } = useQuery({
    queryKey: ["profile", username],
    queryFn: () => getProfileByUsername(username),
    enabled: !!username,
  });

  const isOwnProfile = loggedInProfile?.username === username;
  const profile = viewedProfile;
  const { data: userTweets, isLoading: tweetsLoading } = useGetUserTweetsAndRetweets(profile?.id);
  const { data: likedTweets, isLoading: likesLoading } = useGetLikedTweets(profile?.id);
  const { data: userMedia, isLoading: mediaLoading } = useGetUserMedia(profile?.id);

  const { data: followingCount } = useFollowingCount(profile?.id);
  const { data: followerCount } = useFollowerCount(profile?.id);

  const displayName = profile?.name || "";
  const avatarUrl = profile?.avatar_url || null;
  const joinedDate = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : "";

  if (loading || profileLoading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );

  return (
    <div className="flex flex-col min-h-screen">
      {/* Top bar — 53px */}
      <div className="h-[53px] flex items-center justify-between px-4 text-white sticky top-0 bg-black/70 backdrop-blur-md z-10">
        <div className="flex items-center gap-10">
          <GoBackButton />
          <div className="flex flex-col leading-[1.4]">
            <span className="font-bold text-[20px]">{displayName}</span>
            <span className="text-secondary-text text-[13px]">0 posts</span>
          </div>
        </div>
        <button
          suppressHydrationWarning
          className="p-2 rounded-full hover:bg-hover cursor-pointer"
        >
          <IoSearch size={20} />
        </button>
      </div>

      {/* Banner — 170px */}
      <div className="h-[170px] w-full overflow-hidden">
        <Image
          src="/images/brody.jpeg"
          alt="Banner"
          width={600}
          height={170}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Profile info section — 209px */}
      <div className="px-4 pb-4">
        {/* Avatar — centered on banner bottom edge */}
        <div className="relative w-full h-19">
          <div className="absolute left-0 -translate-y-1/2">
            {avatarUrl ? (
              <Image
                src={avatarUrl}
                alt="Avatar"
                width={115}
                height={115}
                className="w-[115px] h-[115px] rounded-full object-cover border-4 border-black"
              />
            ) : (
              <div className="w-[115px] h-[115px] rounded-full border-4 border-black bg-gray-700 animate-pulse" />
            )}
          </div>
          {isOwnProfile ? (
            <button
              onClick={() => setShowEditProfile(true)}
              className="absolute justify-center items-center right-0 top-0 h-[36px] px-4 mt-3 text-[15px] font-[800] text-white border border-border-2 rounded-full cursor-pointer hover:bg-hover"
            >
              Edit profile
            </button>
          ) : (
            <FollowButton
              targetUserId={profile?.id || ""}
              className="absolute right-0 top-0 mt-3"
            />
          )}
        </div>

        {/* Name / username / joined / follow counts */}
        <div className="">
          <h2 className="text-white leading-[1.25] text-xl font-black">{displayName}</h2>
          <p className="text-secondary-text text-[15px]">@{username}</p>
          <div className="flex items-center pl-[2px] text-secondary-text text-[15px] mt-[10px]">
            <IoCalendarOutline size={16} className="mr-1"/>
            <span className="tracking-[0.4px]">Joined {joinedDate}</span>
            <IoIosArrowForward size={16} className="translate-y-[1px]" />
          </div>
          <div className="flex gap-4 mt-3 text-[14px]">
            <span className="text-white">
              <span className="font-bold">{followingCount ?? 0}</span>{" "}
              <span className="text-secondary-text">Following</span>
            </span>
            <span className="text-white">
              <span className="font-bold">{followerCount ?? 0}</span>{" "}
              <span className="text-secondary-text">Followers</span>
            </span>
          </div>
        </div>
      </div>

      {/* Verified banner */}
      {isOwnProfile && showVerified && (
        <div className="bg-[#0d3b1e] mx-4 p-4 leading-[1.2] rounded-xl relative">
          <button
            suppressHydrationWarning
            onClick={() => setShowVerified(false)}
            className="absolute top-4 right-[18px] text-white cursor-pointer hover:opacity-70"
          >
            <IoClose size={18} />
          </button>
          <div className="flex items-start gap-1 mb-2 max-w-[93%]">
            <span className="text-white text-[20px] font-black inline">
              You aren&apos;t verified yet
              <HiBadgeCheck size={26} className="text-white inline align-middle ml-1" />
            </span>
          </div>
          <p className="text-white/70 text-[15px] font-medium leading-[1.3] mb-4">
            Get verified for boosted replies, analytics, ad-free browsing, and
            more. Upgrade your profile now.
          </p>
          <button
            suppressHydrationWarning
            className="bg-white text-black font-bold text-[15px] px-4 py-[9px] rounded-full cursor-pointer hover:bg-gray-200"
          >
            Get verified
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className="overflow-x-auto scrollbar-hidden border-b border-border">
        <div className="h-[53px] w-full px-0 min-w-[492px] grid grid-cols-6 text-white text-[15px] mt-[2px]">
        {tabs.map((tab) => (
          <button
            suppressHydrationWarning
            key={tab}
            onClick={() => setActiveTab(tab)}
            className="flex items-center justify-center cursor-pointer hover:bg-hover"
          >
            <div className="relative h-full flex items-center">
              <span
                className={
                  activeTab === tab
                    ? "font-bold"
                    : "text-secondary-text font-[500]"
                }
              >
                {tab}
              </span>
              {activeTab === tab && (
                <div className="absolute h-1 w-full bg-primary bottom-0 rounded-full" />
              )}
            </div>
          </button>
        ))}
        </div>
      </div>

      {/* User's tweets / liked tweets / media */}
      {(() => {
        if (activeTab === "Media") {
          if (mediaLoading) return (
            <div className="flex items-center justify-center min-h-[200px]">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          );
          if (!userMedia || userMedia.length === 0) return (
            <div className="flex items-center justify-center min-h-[200px] text-secondary-text">
              No media yet
            </div>
          );
          return (
            <div className="flex flex-wrap">
              {userMedia.map((item) => (
                <div
                  key={item.id}
                  className="w-1/3 aspect-square cursor-pointer"
                  onClick={() => setMediaViewer({ tweetId: item.tweet_id, imageUrl: item.image_url })}
                >
                  <Image
                    src={item.image_url}
                    alt="Media"
                    width={400}
                    height={400}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          );
        }

        const isLikesTab = activeTab === "Likes";
        const loading = isLikesTab ? likesLoading : tweetsLoading;
        const tweets = isLikesTab ? likedTweets : userTweets;
        if (loading) return (
          <div className="flex items-center justify-center min-h-[200px]">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        );
        return (
          <div className="flex flex-col gap-3">
            {tweets?.map((tweet: Tweet) => (
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
              <Link href={`/${tweet.profiles?.username || username}`}>
                <Image
                  src={tweet.profiles?.avatar_url || "/images/default-avatar.svg"}
                  alt="Profile"
                  width={100}
                  height={100}
                  className="w-10 h-10 mr-4 object-cover rounded-full shrink-0"
                />
              </Link>
              <div className="flex flex-col w-full min-w-0">
                <div className="w-full wrap-nowrap justify-between flex">
                  <div className="flex justify-between gap-1 text-sm">
                    <div className="flex gap-[2px] text-[15px] cursor-pointer">
                      <span className="text-white font-bold hover:underline">
                        {tweet.profiles?.name}
                      </span>
                      <MdVerified className="text-primary mt-[2px] w-[17px] h-[17px]" />
                      <span className="text-secondary-text font-light ml-[3px]">
                        @{tweet.profiles?.username}
                      </span>
                      <span className="text-secondary-text font-light ml-[2px]">·</span>
                      <p className="text-secondary-text hover:underline">
                        {formatTweetDate(tweet.created_at)}
                      </p>
                    </div>
                  </div>
                  <TweetMenu tweet={tweet} />
                </div>
                <Link href={`/home/post/${tweet.id}`} className="text-white mb-2 block">
                  <p className="text-[15px] font-[400] leading-[1.3]">{tweet.content}</p>
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
          ))}
          </div>
        );
      })()}

      {showEditProfile && profile && (
        <EditProfileModal
          onClose={() => setShowEditProfile(false)}
          profile={{
            id: profile.id,
            name: profile.name || "",
            username: profile.username || "",
            avatar_url: profile.avatar_url || null,
            created_at: profile.created_at || "",
          }}
        />
      )}
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
