import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/SupabaseClient";

export const useRealtimeMessages = (userId: string | undefined) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!userId) return;

    const channel = supabase
      .channel(`messages:user:${userId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          // Listen for any new message where the user is a participant (sender or recipient)
        },
        (payload) => {
          // Invalidate all conversations and messages for this user
          queryClient.invalidateQueries({ queryKey: ["conversations"] });
          queryClient.invalidateQueries({ queryKey: ["unreadConversations"] });
          // Optionally, invalidate messages for the specific conversation
          if (payload?.new?.conversation_id) {
            queryClient.invalidateQueries({ queryKey: ["messages", payload.new.conversation_id] });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, queryClient]);
};
