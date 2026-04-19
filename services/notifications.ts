import { supabase } from "@/lib/SupabaseClient";

export const createNotification = async ({
  userId,
  actorId,
  type,
  tweetId,
  commentId,
}: {
  userId: string;
  actorId: string;
  type: "like" | "reply" | "follow" | "retweet";
  tweetId?: string;
  commentId?: string;
}) => {
  // Don't notify yourself
  if (userId === actorId) {
    console.log("NOTIF SKIPPED: self-notification", { userId, actorId });
    return;
  }

  console.log("NOTIF CREATING:", { userId, actorId, type, tweetId });
  const { data, error } = await supabase.from("notifications").insert({
    user_id: userId,
    actor_id: actorId,
    type,
    tweet_id: tweetId || null,
    comment_id: commentId || null,
  }).select();
  if (error) console.error("CreateNotificationError:", error.message);
  else console.log("NOTIF CREATED:", data);
};

export const getNotifications = async (userId: string) => {
  const { data, error } = await supabase
    .from("notifications")
    .select("*, actor:actor_id(id, username, name, avatar_url), tweet:tweet_id(id, content)")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(50);
  if (error) {
    console.error("GetNotificationsError:", error.message);
    return [];
  }
  return data ?? [];
};

export const getUnreadNotificationCount = async (userId: string) => {
  const { count, error } = await supabase
    .from("notifications")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("read", false);
  if (error) {
    console.error("GetUnreadNotificationCountError:", error.message);
    return 0;
  }
  return count ?? 0;
};

export const markNotificationsRead = async (userId: string) => {
  const { error } = await supabase
    .from("notifications")
    .update({ read: true })
    .eq("user_id", userId)
    .eq("read", false);
  if (error) console.error("MarkNotificationsReadError:", error.message);
};
