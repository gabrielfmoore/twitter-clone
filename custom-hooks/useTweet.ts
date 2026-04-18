import { createTweet, getTweets, getTweetById, deleteTweet, getFollowingTweets, getUserTweetsAndRetweets, getUserMedia } from "@/services/tweets";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const usePostTweet = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      userId,
      content,
      tweetImage,
    }: {
      userId: string;
      content: string;
      tweetImage: File | null;
    }) => createTweet(userId, content, tweetImage),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tweets"] });
    },
  });
};

export const useGetTweets = () => {
  return useQuery({
    queryKey: ["tweets"],
    queryFn: () => getTweets(),
  });
};

export const useGetTweetById = (id: string) => {
  return useQuery({
    queryKey: ["tweet", id],
    queryFn: () => getTweetById(id),
    enabled: !!id,
  });
};

export const useDeleteTweet = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn:({ tweetId, imagePath }: { tweetId: string; imagePath?: string }) => deleteTweet(tweetId, imagePath), 
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tweets"] });
    }
  })
}

export const useGetTweetsByUserId = (userId: string) => {
  return useQuery({
    queryKey: ["tweets", "user", userId],
    queryFn: () => getTweets(userId),
    enabled: !!userId,
  });
};

export const useGetFollowingTweets = (userId: string | undefined) => {
  return useQuery({
    queryKey: ["tweets", "following", userId],
    queryFn: () => getFollowingTweets(userId!),
    enabled: !!userId,
  });
};

export const useGetUserTweetsAndRetweets = (userId: string | undefined) => {
  return useQuery({
    queryKey: ["tweets", "user", userId, "with-retweets"],
    queryFn: () => getUserTweetsAndRetweets(userId!),
    enabled: !!userId,
  });
};

export const useGetUserMedia = (userId: string | undefined) => {
  return useQuery({
    queryKey: ["userMedia", userId],
    queryFn: () => getUserMedia(userId!),
    enabled: !!userId,
  });
};
