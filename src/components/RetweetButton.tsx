import { useToggleRetweet, useUserRetweet, useGetRetweetCount } from "@/custom-hooks/useRetweet";
import { useGetUser } from "@/custom-hooks/useGetUser";
import { FiRepeat } from "react-icons/fi";

export default function RetweetButton({ tweetId }: { tweetId: string }) {
  const { session } = useGetUser();
  const userId = session?.user.id;
  const { data: hasRetweeted } = useUserRetweet(userId, tweetId);
  const { data: retweetCount } = useGetRetweetCount(tweetId);
  const { mutate } = useToggleRetweet();

  return (
    <button
      onClick={() => mutate({ userId, tweetId, hasRetweeted: !!hasRetweeted })}
      suppressHydrationWarning
      className={`flex items-center gap-1 cursor-pointer group ${hasRetweeted ? "text-green-400" : "hover:text-green-400"}`}
    >
      <div className={`w-[34.75px] h-[34.75px] -m-2 flex items-center justify-center rounded-full ${hasRetweeted ? "" : "group-hover:bg-green-400/12"}`}>
        <FiRepeat />
      </div>
      <span className="text-sm">{retweetCount || null}</span>
    </button>
  );
}
