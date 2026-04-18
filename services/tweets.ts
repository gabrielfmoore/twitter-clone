import { supabase } from "@/lib/SupabaseClient";

const TWEET_SELECT = `*, profiles(id, username, name, avatar_url), comments(count)`;

async function fetchRetweetsAsTweets(userIds: string[]) {
  if (userIds.length === 0) return [];
  const { data: retweets, error } = await supabase
    .from("retweets")
    .select("tweet_id, user_id, created_at, profiles(id, name, username)")
    .in("user_id", userIds)
    .order("created_at", { ascending: false });
  if (error || !retweets?.length) return [];

  const tweetIds = [...new Set(retweets.map((r) => r.tweet_id))];
  const { data: tweets, error: tweetsErr } = await supabase
    .from("tweets")
    .select(TWEET_SELECT)
    .in("id", tweetIds);
  if (tweetsErr || !tweets) return [];

  const tweetMap = new Map(tweets.map((t) => [t.id, t]));
  return retweets
    .map((r) => {
      const tweet = tweetMap.get(r.tweet_id);
      if (!tweet) return null;
      const retweeterProfile = Array.isArray(r.profiles) ? r.profiles[0] : r.profiles;
      return {
        ...tweet,
        created_at: r.created_at,
        retweeted_by: retweeterProfile
          ? { id: retweeterProfile.id, name: retweeterProfile.name, username: retweeterProfile.username }
          : undefined,
        retweet_key: `rt_${r.user_id}_${r.tweet_id}`,
      };
    })
    .filter(Boolean);
}

export const createTweet = async (
  userId: string,
  content: string | null,
  tweetImage: File | null,
) => {
  let imageUrl: null | string = null;
  let imagePath: null | string = null;

  if (tweetImage) {
    const timestamp = Date.now();
    const path = `${timestamp}_${tweetImage.name}`;

    const { error: imgError } = await supabase.storage
      .from("tweet-images")
      .upload(path, tweetImage);

    if (imgError) {
      console.log("TweetImageUploadError:", imgError.message);
      return;
    }
    const {
      data: { publicUrl },
    } = supabase.storage.from("tweet-images").getPublicUrl(path);

    imageUrl = publicUrl;
    imagePath = path;
  }

  const { error: insertError } = await supabase.from("tweets").insert({
    user_id: userId,
    content: content ? content : null,
    image_url: imageUrl,
    image_path: imagePath,
  });
  if (insertError) {
    console.log("TweetInsertError:", insertError.message);
    return;
  }
  return true;
};

export const getTweets = async (userId?: string) => {
  let query = supabase
    .from("tweets")
    .select(TWEET_SELECT)
    .order("created_at", { ascending: false });
  if (userId) {
    query = query.eq("user_id", userId);
  }
  const { error, data } = await query;
  if (error) {
    console.log("GetTweetsError:", error.message);
  }
  return data;
};

export const getFollowingTweets = async (userId: string) => {
  const { data: follows, error: followError } = await supabase
    .from("follows")
    .select("following_id")
    .eq("follower_id", userId);
  if (followError) {
    console.log("GetFollowsError:", followError.message);
    return [];
  }
  const followingIds = follows.map((f) => f.following_id);
  if (followingIds.length === 0) return [];

  const { data, error } = await supabase
    .from("tweets")
    .select(TWEET_SELECT)
    .in("user_id", followingIds)
    .order("created_at", { ascending: false });
  if (error) {
    console.log("GetFollowingTweetsError:", error.message);
    return [];
  }

  const retweets = await fetchRetweetsAsTweets(followingIds);
  // Only include retweets of tweets from users you don't already follow
  const followingSet = new Set(followingIds);
  const filteredRetweets = retweets.filter((rt) => !followingSet.has(rt.user_id));
  const combined = [...(data || []), ...filteredRetweets];
  combined.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  return combined;
};

export const getTweetById = async (id: string) => {
  const { error, data } = await supabase
    .from("tweets")
    .select(TWEET_SELECT)
    .eq("id", id)
    .maybeSingle();
  if (error) {
    console.log("GetTweetByIdError:", error.message);
  }
  return data;
};

export const getUserTweetsAndRetweets = async (userId: string) => {
  const { data: ownTweets, error } = await supabase
    .from("tweets")
    .select(TWEET_SELECT)
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) {
    console.log("GetUserTweetsError:", error.message);
    return [];
  }

  const retweets = await fetchRetweetsAsTweets([userId]);
  const combined = [...(ownTweets || []), ...retweets];
  combined.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  return combined;
};

export const deleteTweet = async (tweetId: string, imagePath?: string) => {
  const { error: deleteError } = await supabase.from("tweets").delete().eq("id", tweetId);
  if (deleteError) {
    console.log("DeleteTweetError:", deleteError.message);
    return;
  }
  if (imagePath) {
    const { error: imageDeleteError } = await supabase.storage.from("tweet-images").remove([imagePath]);
    if (imageDeleteError) {
      console.log("DeleteTweetImageError:", imageDeleteError.message);
    }
  }
};

export const getUserMedia = async (userId: string) => {
  const { data: tweetImages, error: tweetsErr } = await supabase
    .from("tweets")
    .select("id, image_url, created_at")
    .eq("user_id", userId)
    .not("image_url", "is", null)
    .order("created_at", { ascending: false });
  if (tweetsErr) console.log("GetTweetMediaError:", tweetsErr.message);

  const { data: commentImages, error: commentsErr } = await supabase
    .from("comments")
    .select("id, image_url, tweet_id, created_at")
    .eq("user_id", userId)
    .not("image_url", "is", null)
    .order("created_at", { ascending: false });
  if (commentsErr) console.log("GetCommentMediaError:", commentsErr.message);

  const media = [
    ...(tweetImages || []).map((t) => ({ id: t.id, tweet_id: t.id, image_url: t.image_url as string, link: `/home/post/${t.id}`, created_at: t.created_at })),
    ...(commentImages || []).map((c) => ({ id: c.id, tweet_id: c.tweet_id as string, image_url: c.image_url as string, link: `/home/post/${c.tweet_id}`, created_at: c.created_at })),
  ];
  media.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  return media;
};
