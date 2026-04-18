import { getUserRetweet, toggleRetweet, getRetweetCount } from "@/services/retweet";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

type ToggleRetweet = {
  userId: string | undefined;
  tweetId: string;
  hasRetweeted: boolean;
};

export const useToggleRetweet = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, tweetId, hasRetweeted }: ToggleRetweet) =>
      toggleRetweet({ userId, tweetId, hasRetweeted }),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["retweets", variables.tweetId] });
      queryClient.invalidateQueries({ queryKey: ["retweetCount", variables.tweetId] });
      queryClient.invalidateQueries({ queryKey: ["tweets"] });
    },
  });
};

export const useUserRetweet = (userId: string | undefined, tweetId: string) => {
  return useQuery({
    queryFn: () => getUserRetweet(userId, tweetId),
    queryKey: ["retweets", tweetId, userId],
    enabled: !!tweetId && !!userId,
    staleTime: 30_000,
    retry: 2,
  });
};

export const useGetRetweetCount = (tweetId: string) => {
  return useQuery({
    queryKey: ["retweetCount", tweetId],
    queryFn: () => getRetweetCount(tweetId),
    enabled: !!tweetId,
    staleTime: 30_000,
    retry: 2,
  });
};
