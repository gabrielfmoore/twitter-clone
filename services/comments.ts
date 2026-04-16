import { supabase } from "@/lib/SupabaseClient";

export const createComment = async (
  userId: string,
  tweetId: string,
  content: string,
) => {
  const { error: insertError } = await supabase.from("comments").insert({
    user_id: userId,
    tweet_id: tweetId,
    content,
  });
  if (insertError) {
    console.error("Error creating comment:", insertError.message);
    return;
  }
  return true;
};

export const getComments = async (tweetId: string) => {
  const { data, error } = await supabase.from("comments").select("*,profiles(*)").eq("tweet_id", tweetId).order("created_at", { ascending: false });
  if (error) {
    console.error("Error fetching comments:", error.message);
    return;
  }
  return data ?? [];
}

export const deleteComment = async (commentId: string) => {
  const { error } = await supabase.from("comments").delete().eq("id", commentId);
  if (error) {
    console.error("Error deleting comment:", error.message);
    throw error;
  }
  return true;
}
