import { getUserLike, toggleLike, getLikeCount } from "@/services/like";
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
    }
  });
};

export const useUserLike = (userId: string | undefined, tweetId: string) => {
    return useQuery({
        queryFn: () => getUserLike(userId, tweetId),
        queryKey: ["likes", tweetId, userId],
        enabled: !!tweetId && !!userId
    })
}

export const useGetLikeCount = (tweetId: string) => {
    return useQuery({
        queryKey: ["likeCount", tweetId],
        queryFn: () => getLikeCount(tweetId),
        enabled: !!tweetId,
    });
};
  