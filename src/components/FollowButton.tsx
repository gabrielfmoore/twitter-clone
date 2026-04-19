"use client";

import { useGetUser } from "@/custom-hooks/useGetUser";
import { useIsFollowing, useToggleFollow } from "@/custom-hooks/useFollow";
import { useState } from "react";

interface FollowButtonProps {
  targetUserId: string;
  className?: string;
}

export default function FollowButton({ targetUserId, className }: FollowButtonProps) {
  const { session } = useGetUser();
  const currentUserId = session?.user.id;
  const { data: isFollowing } = useIsFollowing(currentUserId, targetUserId);
  const { mutate: toggleFollow } = useToggleFollow();
  const [hovered, setHovered] = useState(false);

  if (!currentUserId || currentUserId === targetUserId) return null;

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFollow(
      {
        followerId: currentUserId,
        followingId: targetUserId,
        isFollowing: !!isFollowing,
      },
      // No notification logic
    );
  };

  if (isFollowing) {
    return (
      <button
        onClick={handleClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={`h-[36px] px-4 text-[15px] font-[800] rounded-full cursor-pointer border transition-colors ${
          hovered
            ? "border-red-500/50 text-red-500 bg-red-500/10"
            : "border-border-2 text-white"
        } ${className || ""}`}
      >
        {hovered ? "Unfollow" : "Following"}
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      className={`h-[36px] px-4 text-[15px] font-[800] bg-white text-black rounded-full cursor-pointer hover:bg-white/90 ${className || ""}`}
    >
      Follow
    </button>
  );
}
