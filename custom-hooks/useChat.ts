import {
  getConversations,
  getMessages,
  sendMessage,
  getOrCreateConversation,
  searchUsers,
  markConversationRead,
  getUnreadConversationIds,
} from "@/services/chat";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetConversations = (userId: string | undefined) => {
  return useQuery({
    queryKey: ["conversations", userId],
    queryFn: () => getConversations(userId!),
    enabled: !!userId,
  });
};

export const useGetMessages = (conversationId: string | undefined) => {
  return useQuery({
    queryKey: ["messages", conversationId],
    queryFn: () => getMessages(conversationId!),
    enabled: !!conversationId,
  });
};

export const useSendMessage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      conversationId,
      senderId,
      content,
    }: {
      conversationId: string;
      senderId: string;
      content: string;
    }) => sendMessage(conversationId, senderId, content),
    onMutate: async (variables) => {
      // Cancel outgoing refetches so they don't overwrite our optimistic update
      await queryClient.cancelQueries({
        queryKey: ["messages", variables.conversationId],
      });

      // Snapshot current messages
      const previousMessages = queryClient.getQueryData([
        "messages",
        variables.conversationId,
      ]);

      // Optimistically add the new message
      queryClient.setQueryData(
        ["messages", variables.conversationId],
        (old: Array<Record<string, unknown>> | undefined) => [
          ...(old || []),
          {
            id: `optimistic-${Date.now()}`,
            conversation_id: variables.conversationId,
            sender_id: variables.senderId,
            content: variables.content,
            created_at: new Date().toISOString(),
            profiles: null,
          },
        ]
      );

      return { previousMessages };
    },
    onError: (_err, variables, context) => {
      // Roll back to previous messages on failure
      if (context?.previousMessages) {
        queryClient.setQueryData(
          ["messages", variables.conversationId],
          context.previousMessages
        );
      }
    },
    onSettled: (_, __, variables) => {
      // Refetch to get the real server data
      queryClient.invalidateQueries({
        queryKey: ["messages", variables.conversationId],
      });
      queryClient.invalidateQueries({
        queryKey: ["conversations"],
      });
    },
  });
};

export const useGetOrCreateConversation = () => {
  return useMutation({
    mutationFn: ({
      currentUserId,
      otherUserId,
    }: {
      currentUserId: string;
      otherUserId: string;
    }) => getOrCreateConversation(currentUserId, otherUserId),
  });
};

export const useSearchUsers = (query: string, currentUserId: string | undefined) => {
  return useQuery({
    queryKey: ["searchUsers", query],
    queryFn: () => searchUsers(query, currentUserId!),
    enabled: query.length >= 2 && !!currentUserId,
  });
};

export const useUnreadConversations = (userId: string | undefined) => {
  return useQuery({
    queryKey: ["unreadConversations", userId],
    queryFn: () => getUnreadConversationIds(userId!),
    enabled: !!userId,
    refetchInterval: 30000,
  });
};

export const useMarkConversationRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, conversationId }: { userId: string; conversationId: string }) =>
      markConversationRead(userId, conversationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["unreadConversations"] });
    },
  });
};
