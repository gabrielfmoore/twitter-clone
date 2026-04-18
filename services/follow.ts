import { supabase } from "@/lib/SupabaseClient";

type ToggleFollow = {
  followerId: string;
  followingId: string;
  isFollowing: boolean;
};

export const toggleFollow = async ({
  followerId,
  followingId,
  isFollowing,
}: ToggleFollow) => {
  if (isFollowing) {
    const { error } = await supabase
      .from("follows")
      .delete()
      .eq("follower_id", followerId)
      .eq("following_id", followingId);
    if (error) {
      console.error("Error unfollowing:", error.message);
      return;
    }
  } else {
    const { error } = await supabase
      .from("follows")
      .insert({ follower_id: followerId, following_id: followingId });
    if (error) throw new Error(error.message);
  }
};

export const getIsFollowing = async (
  followerId: string | undefined,
  followingId: string,
) => {
  if (!followerId) return false;
  const { data, error } = await supabase
    .from("follows")
    .select("id")
    .eq("follower_id", followerId)
    .eq("following_id", followingId)
    .maybeSingle();
  if (error) {
    console.error("Error checking follow:", error.message);
    return false;
  }
  return !!data;
};

export const getFollowingCount = async (userId: string) => {
  const { count, error } = await supabase
    .from("follows")
    .select("*", { count: "exact", head: true })
    .eq("follower_id", userId);
  if (error) {
    console.error("Error fetching following count:", error.message);
    return 0;
  }
  return count ?? 0;
};

export const getFollowerCount = async (userId: string) => {
  const { count, error } = await supabase
    .from("follows")
    .select("*", { count: "exact", head: true })
    .eq("following_id", userId);
  if (error) {
    console.error("Error fetching follower count:", error.message);
    return 0;
  }
  return count ?? 0;
};
