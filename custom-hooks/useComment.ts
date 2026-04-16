import { createComment, getComments, deleteComment } from "@/services/comments";
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
      queryClient.invalidateQueries({
        queryKey: ["tweet", variables.tweetId],
      });
      queryClient.invalidateQueries({
        queryKey: ["tweets"],
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

export const useDeleteComment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ commentId }: { commentId: string; tweetId: string }) =>
      deleteComment(commentId),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["comments", variables.tweetId],
      });
      queryClient.invalidateQueries({
        queryKey: ["tweet", variables.tweetId],
      });
      queryClient.invalidateQueries({
        queryKey: ["tweets"],
      });
    },
  });
};
