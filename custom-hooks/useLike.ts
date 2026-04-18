import { getUserLike, toggleLike, getLikeCount, getLikedTweets } from "@/services/like";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

type ToggleLike = {
  userId: string | undefined;
  tweetId: string;
  hasLiked: boolean;
};

export const useToggleLike = () => {
    const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, tweetId, hasLiked }: ToggleLike) =>
      toggleLike({ userId, tweetId, hasLiked }),
    onSuccess: (data, variables) => {
        queryClient.invalidateQueries({ queryKey: ["likes", variables.tweetId] });
        queryClient.invalidateQueries({ queryKey: ["likeCount", variables.tweetId] });
        queryClient.invalidateQueries({ queryKey: ["likedTweets"] });
    }
  });
};

export const useUserLike = (userId: string | undefined, tweetId: string) => {
    return useQuery({
        queryFn: () => getUserLike(userId, tweetId),
        queryKey: ["likes", tweetId, userId],
        enabled: !!tweetId && !!userId,
        staleTime: 30_000,
        retry: 2,
    })
}

export const useGetLikeCount = (tweetId: string) => {
    return useQuery({
        queryKey: ["likeCount", tweetId],
        queryFn: () => getLikeCount(tweetId),
        enabled: !!tweetId,
        staleTime: 30_000,
        retry: 2,
    });
};

export const useGetLikedTweets = (userId: string | undefined) => {
    return useQuery({
        queryKey: ["likedTweets", userId],
        queryFn: () => getLikedTweets(userId!),
        enabled: !!userId,
    });
};
  