import {
  getConversations,
  getMessages,
  sendMessage,
  getOrCreateConversation,
  searchUsers,
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
    onSuccess: (_, variables) => {
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
