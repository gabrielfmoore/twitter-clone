import { supabase } from "@/lib/SupabaseClient";

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
    .select(`*, profiles(id, username, name, avatar_url)`)
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

export const getTweetById = async (id: string) => {
  const { error, data } = await supabase
    .from("tweets")
    .select(`*, profiles(id, username, name, avatar_url)`)
    .eq("id", id)
    .maybeSingle();
  if (error) {
    console.log("GetTweetByIdError:", error.message);
  }
  return data;
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
