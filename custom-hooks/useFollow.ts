import {
  toggleFollow,
  getIsFollowing,
  getFollowingCount,
  getFollowerCount,
} from "@/services/follow";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

type ToggleFollow = {
  followerId: string;
  followingId: string;
  isFollowing: boolean;
};

export const useToggleFollow = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ followerId, followingId, isFollowing }: ToggleFollow) =>
      toggleFollow({ followerId, followingId, isFollowing }),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["isFollowing", variables.followerId, variables.followingId],
      });
      queryClient.invalidateQueries({
        queryKey: ["followingCount", variables.followerId],
      });
      queryClient.invalidateQueries({
        queryKey: ["followerCount", variables.followingId],
      });
    },
  });
};

export const useIsFollowing = (
  followerId: string | undefined,
  followingId: string | undefined,
) => {
  return useQuery({
    queryKey: ["isFollowing", followerId, followingId],
    queryFn: () => getIsFollowing(followerId, followingId!),
    enabled: !!followerId && !!followingId && followerId !== followingId,
  });
};

export const useFollowingCount = (userId: string | undefined) => {
  return useQuery({
    queryKey: ["followingCount", userId],
    queryFn: () => getFollowingCount(userId!),
    enabled: !!userId,
  });
};

export const useFollowerCount = (userId: string | undefined) => {
  return useQuery({
    queryKey: ["followerCount", userId],
    queryFn: () => getFollowerCount(userId!),
    enabled: !!userId,
  });
};
