import GoBackButton from "@/src/components/GoBackButton";
import Image from "next/image";
import Link from "next/link";
import { MdVerified } from "react-icons/md";
import ReplyPost from "@/src/components/ReplyPost";
import Comments from "@/src/components/Comments";
import TweetActions from "@/src/components/TweetActions";
import { formatPostDate } from "@/lib/formatDate";
import { supabase } from "@/lib/SupabaseClient";
import TweetMenu from "@/src/components/TweetMenu";
import TweetImage from "@/src/components/TweetImage";

const getTweet = async (id: string) => {
  const { error, data } = await supabase
    .from("tweets")
    .select("*, profiles(*), comments(count)")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching tweet:", error.message);
    return null;
  }
  return data;
};

export default async function Page({
  params,
}: {
  params: Promise<{ postid: string }>;
}) {
  const { postid } = await params;
  const tweet = await getTweet(postid);

  if (!tweet)
    return (
      <div className="text-white p-4">
        <GoBackButton />
        <p className="mt-4">Post not found.</p>
      </div>
    );

  return (
    <div>
      <div className="flex text-white items-center px-4 h-[53px] sticky top-0 bg-black/70 backdrop-blur-md z-10">
        <div className="flex items-center gap-10">
          <GoBackButton />
          <span className="font-[700] text-xl">Post</span>
        </div>
      </div>
      <div className="flex w-full px-4 pb-3">
        <div className="flex flex-col w-full">
          {/* Author row */}
          <div className="flex w-full justify-between">
            <div className="flex">
              <Link href={`/${tweet.profiles?.username || ""}`}>
                <Image
                  src={
                    tweet.profiles?.avatar_url || "/images/default-avatar.svg"
                  }
                  alt="Profile"
                  width={100}
                  height={100}
                  className="w-10 h-10 mr-2 object-cover rounded-full shrink-0"
                />
              </Link>
              <div className="flex flex-col text-[15px] cursor-pointer">
                <div className="flex gap-1">
                  <span className="text-white font-bold hover:underline">
                    {tweet.profiles?.name}
                  </span>
                  <MdVerified className="text-primary mt-[2px] w-[17px] h-[17px]" />
                </div>
                <span className="text-secondary-text font-light">
                  @{tweet.profiles?.username}
                </span>
              </div>
            </div>
            <TweetMenu tweet={tweet} />
          </div>

          {/* Content */}
          <div className="text-white my-3">
            {tweet.content && (
              <p className="text-[15px] font-[400] leading-[1.3]">
                {tweet.content}
              </p>
            )}
            {tweet.image_url && (
              <TweetImage tweetId={tweet.id} imageUrl={tweet.image_url} />
            )}
          </div>

          {/* Timestamp */}
          <div className="text-secondary-text text-[15px] pb-3 border-b border-border">
            {formatPostDate(tweet.created_at)}
          </div>

          {/* Actions */}
          <div className="py-1 border-b border-border">
            <TweetActions tweet={tweet} />
          </div>
        </div>
      </div>

      <ReplyPost tweetId={tweet.id} />
      <Comments tweetId={tweet.id} />
    </div>
  );
}
