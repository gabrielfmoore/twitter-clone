import { supabase } from "@/lib/SupabaseClient";

export const createComment = async (
  userId: string,
  tweetId: string,
  content: string,
  commentImage: File | null = null,
) => {
  let imageUrl: null | string = null;
  let imagePath: null | string = null;

  if (commentImage) {
    const timestamp = Date.now();
    const path = `comments/${timestamp}_${commentImage.name}`;
    const { error: imgError } = await supabase.storage
      .from("tweet-images")
      .upload(path, commentImage);
    if (imgError) {
      console.error("CommentImageUploadError:", imgError.message);
    } else {
      const { data: { publicUrl } } = supabase.storage
        .from("tweet-images")
        .getPublicUrl(path);
      imageUrl = publicUrl;
      imagePath = path;
    }
  }

  const { error: insertError } = await supabase.from("comments").insert({
    user_id: userId,
    tweet_id: tweetId,
    content,
    image_url: imageUrl,
    image_path: imagePath,
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
