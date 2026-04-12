import { createComment, getComments } from "@/services/comments";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useCreateComment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      userId,
      tweetId,
      content,
    }: {
      userId: string;
      tweetId: string;
      content: string;
    }) => createComment(userId, tweetId, content),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["comments", variables.tweetId],
      });
    },
  });
};

export const useGetComments = (tweetId: string) => {
  return useQuery({
    queryFn: () => getComments(tweetId),
    queryKey: ["comments", tweetId],
    enabled: !!tweetId,
  });
};
