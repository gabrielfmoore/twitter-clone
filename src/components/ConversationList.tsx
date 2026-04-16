"use client";

import Image from "next/image";
import Link from "next/link";
import { formatTweetDate } from "@/lib/formatDate";

type Conversation = {
  id: string;
  otherUser: {
    id: string;
    username: string;
    name: string;
    avatar_url: string;
  } | null;
  lastMessage: {
    content: string;
    created_at: string;
    sender_id: string;
  } | null;
};

export default function ConversationList({
  conversations,
  currentUserId,
}: {
  conversations: Conversation[];
  currentUserId: string;
}) {
  return (
    <div>
      {conversations.map((convo) => (
        <Link
          key={convo.id}
          href={`/home/messages/${convo.id}`}
          className="flex items-center gap-3 px-4 py-3 hover:bg-hover cursor-pointer border-b border-border"
        >
          <Image
            src={convo.otherUser?.avatar_url || "/images/default-avatar.svg"}
            alt={convo.otherUser?.name || "User"}
            width={48}
            height={48}
            className="rounded-full w-12 h-12 object-cover shrink-0"
          />
          <div className="flex flex-col min-w-0 flex-1">
            <div className="flex items-center gap-1">
              <span className="text-white font-bold text-[15px] truncate">
                {convo.otherUser?.name}
              </span>
              <span className="text-secondary-text text-[15px] truncate">
                @{convo.otherUser?.username}
              </span>
              {convo.lastMessage && (
                <span className="text-secondary-text text-[15px] shrink-0">
                  · {formatTweetDate(convo.lastMessage.created_at)}
                </span>
              )}
            </div>
            {convo.lastMessage && (
              <p className="text-secondary-text text-[15px] truncate">
                {convo.lastMessage.sender_id === currentUserId && "You: "}
                {convo.lastMessage.content}
              </p>
            )}
          </div>
        </Link>
      ))}
    </div>
  );
}
