import { useToggleRetweet, useUserRetweet, useGetRetweetCount } from "@/custom-hooks/useRetweet";
import { useGetUser } from "@/custom-hooks/useGetUser";
import { FiRepeat } from "react-icons/fi";

export default function RetweetButton({ tweetId, tweetOwnerId }: { tweetId: string; tweetOwnerId?: string }) {
  const { session } = useGetUser();
  const userId = session?.user.id;
  const { data: hasRetweeted } = useUserRetweet(userId, tweetId);
  const { data: retweetCount } = useGetRetweetCount(tweetId);
  const { mutate } = useToggleRetweet();

  const handleRetweet = () => {
    mutate({ userId, tweetId, hasRetweeted: !!hasRetweeted });
  };

  return (
    <button
      onClick={handleRetweet}
      suppressHydrationWarning
      className={`flex items-center gap-1 cursor-pointer group ${hasRetweeted ? "text-green-400" : "hover:text-green-400"}`}
    >
      <FiRepeat />
      <span className="w-0 overflow-visible text-sm whitespace-nowrap">{retweetCount || null}</span>
    </button>
  );
}
