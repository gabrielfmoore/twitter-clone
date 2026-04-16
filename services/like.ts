import { supabase } from "@/lib/SupabaseClient";

type ToggleLike = {
  userId: string | undefined;
  tweetId: string;
  hasLiked: boolean;
};

export const toggleLike = async ({ userId, tweetId, hasLiked }: ToggleLike) => {
  if (hasLiked) {
    const { error } = await supabase
      .from("likes")
      .delete()
      .eq("user_id", userId)
      .eq("tweet_id", tweetId);
    if (error) {
      console.error("Error unliking tweet:", error.message);
      return;
    }
  } else {
    const { error } = await supabase
      .from("likes")
      .insert({ user_id: userId, tweet_id: tweetId });
    if (error) throw new Error(error.message);
  }
};

export const getUserLike = async (
  userId: string | undefined,
  tweetId: string,
) => {
  const { data, error } = await supabase
    .from("likes")
    .select("*")
    .eq("user_id", userId)
    .eq("tweet_id", tweetId)
    .maybeSingle();
  if (error) {
    console.error("Error fetching like:", error.message);
    return false;
  }
  return !!data;
};

export const getLikeCount = async (tweetId: string) => {
  const { count, error } = await supabase
    .from("likes")
    .select("*", { count: "exact", head: true })
    .eq("tweet_id", tweetId);
  if (error) {
    console.error("Error fetching like count:", error.message);
    return 0;
  }
  return count ?? 0;
};
