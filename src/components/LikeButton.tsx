import { useToggleLike, useUserLike, useGetLikeCount } from "@/custom-hooks/useLike";
import { useGetUser } from "@/custom-hooks/useGetUser";
import { FaHeart, FaRegHeart } from "react-icons/fa6";

export default function LikeButton({ tweetId, tweetOwnerId }: { tweetId: string; tweetOwnerId?: string }) {
  const { session } = useGetUser();
  const userId = session?.user.id;
  const { data: hasLiked } = useUserLike(userId, tweetId);
  const { data: likeCount } = useGetLikeCount(tweetId);
  const { mutate } = useToggleLike();

  const handleLike = () => {
    console.log("LikeButton userId:", userId, "tweetOwnerId:", tweetOwnerId);
    mutate({ userId, tweetId, hasLiked: !!hasLiked });
  };

  return (
    <>
      {hasLiked ? (
        <button
          onClick={handleLike}
          suppressHydrationWarning
          className="flex items-center gap-1 text-like cursor-pointer group"
        >
          <div className="w-[34.75px] h-[34.75px] -m-2 flex items-center justify-center rounded-full">
            <FaHeart />
          </div>
          <span className="w-0 overflow-visible text-sm whitespace-nowrap">{likeCount || null}</span>
        </button>
      ) : (
        <button
          onClick={handleLike}
          suppressHydrationWarning
          className="flex items-center gap-1 hover:text-like cursor-pointer group"
        >
          <div className="w-[34.75px] h-[34.75px] -m-2 flex items-center justify-center rounded-full group-hover:bg-like/13">
            <FaRegHeart />
          </div>
          <span className="w-0 overflow-visible text-sm whitespace-nowrap">{likeCount || null}</span>
        </button>
      )}
    </>
  );
}
