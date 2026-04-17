import { supabase } from "@/lib/SupabaseClient";

// Get all conversations for the current user, with participant profiles and last message
export const getConversations = async (userId: string) => {
  const { data, error } = await supabase
    .from("conversation_participants")
    .select(
      "conversation_id, conversations!conversation_id(id, created_at), profiles!user_id(id, username, name, avatar_url)"
    )
    .eq("user_id", userId);

  if (error) {
    console.error("Error fetching conversations:", error.message);
    return [];
  }

  // Get all conversation IDs
  const conversationIds = data.map((d) => d.conversation_id);
  if (conversationIds.length === 0) return [];

  // Fetch all participants for those conversations (to get the other user's info)
  const { data: allParticipants, error: partError } = await supabase
    .from("conversation_participants")
    .select("conversation_id, user_id, profiles!user_id(id, username, name, avatar_url)")
    .in("conversation_id", conversationIds);

  if (partError) {
    console.error("Error fetching participants:", partError.message);
    return [];
  }

  // Fetch last message for each conversation
  const { data: lastMessages, error: msgError } = await supabase
    .from("messages")
    .select("conversation_id, content, created_at, sender_id")
    .in("conversation_id", conversationIds)
    .order("created_at", { ascending: false });

  if (msgError) {
    console.error("Error fetching last messages:", msgError.message);
    return [];
  }

  // Build conversation list
  return conversationIds.map((convId) => {
    const otherParticipant = allParticipants.find(
      (p) => p.conversation_id === convId && p.user_id !== userId
    );
    const lastMessage = lastMessages.find((m) => m.conversation_id === convId);
    const profiles = otherParticipant?.profiles;
    const otherUser = Array.isArray(profiles) ? profiles[0] ?? null : profiles ?? null;
    return {
      id: convId,
      otherUser,
      lastMessage: lastMessage ?? null,
    };
  });
};

// Get messages for a conversation
export const getMessages = async (conversationId: string) => {
  const { data, error } = await supabase
    .from("messages")
    .select("*, profiles:sender_id(id, username, name, avatar_url)")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error fetching messages:", error.message);
    return [];
  }
  return data ?? [];
};

// Send a message
export const sendMessage = async (
  conversationId: string,
  senderId: string,
  content: string
) => {
  const { error } = await supabase.from("messages").insert({
    conversation_id: conversationId,
    sender_id: senderId,
    content,
  });
  if (error) {
    console.error("Error sending message:", error.message);
    throw error;
  }
  return true;
};

// Find existing conversation between two users, or create one
export const getOrCreateConversation = async (
  currentUserId: string,
  otherUserId: string
) => {
  // Find conversations where current user is a participant
  const { data: myConvos, error: myError } = await supabase
    .from("conversation_participants")
    .select("conversation_id")
    .eq("user_id", currentUserId);

  if (myError) {
    console.error("Error finding conversations:", myError.message);
    throw myError;
  }

  const myConvoIds = myConvos.map((c) => c.conversation_id);

  if (myConvoIds.length > 0) {
    // Check if the other user is in any of those conversations
    const { data: shared, error: sharedError } = await supabase
      .from("conversation_participants")
      .select("conversation_id")
      .eq("user_id", otherUserId)
      .in("conversation_id", myConvoIds);

    if (sharedError) {
      console.error("Error finding shared conversation:", sharedError.message);
      throw sharedError;
    }

    if (shared && shared.length > 0) {
      return shared[0].conversation_id;
    }
  }

  // No existing conversation — create one atomically via DB function
  const { data: newConvoId, error: convoError } = await supabase
    .rpc("create_conversation", { other_user_id: otherUserId });

  if (convoError) {
    console.error("Error creating conversation:", convoError.message);
    throw convoError;
  }

  return newConvoId as string;
};

// Search users by username or name (for new conversation)
export const searchUsers = async (query: string, currentUserId: string) => {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, username, name, avatar_url")
    .or(`username.ilike.%${query}%,name.ilike.%${query}%`)
    .neq("id", currentUserId)
    .limit(10);

  if (error) {
    console.error("Error searching users:", error.message);
    return [];
  }
  return data ?? [];
};
