import { supabase } from "@/lib/SupabaseClient";

type ToggleRetweet = {
  userId: string | undefined;
  tweetId: string;
  hasRetweeted: boolean;
};

export const toggleRetweet = async ({ userId, tweetId, hasRetweeted }: ToggleRetweet) => {
  if (hasRetweeted) {
    const { error } = await supabase
      .from("retweets")
      .delete()
      .eq("user_id", userId)
      .eq("tweet_id", tweetId);
    if (error) {
      console.error("Error removing retweet:", error.message);
      return;
    }
  } else {
    const { error } = await supabase
      .from("retweets")
      .insert({ user_id: userId, tweet_id: tweetId });
    if (error) throw new Error(error.message);
  }
};

export const getUserRetweet = async (
  userId: string | undefined,
  tweetId: string,
) => {
  const { data, error } = await supabase
    .from("retweets")
    .select("*")
    .eq("user_id", userId)
    .eq("tweet_id", tweetId)
    .maybeSingle();
  if (error) {
    console.error("Error fetching retweet:", error.message);
    return false;
  }
  return !!data;
};

export const getRetweetCount = async (tweetId: string) => {
  const { count, error } = await supabase
    .from("retweets")
    .select("*", { count: "exact", head: true })
    .eq("tweet_id", tweetId);
  if (error) {
    console.error("Error fetching retweet count:", error.message);
    return 0;
  }
  return count ?? 0;
};
