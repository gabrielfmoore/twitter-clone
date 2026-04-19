"use client";

import { useGetUser } from "@/custom-hooks/useGetUser";
import { useGetMessages, useSendMessage, useMarkConversationRead } from "@/custom-hooks/useChat";
import { useRealtimeMessages } from "@/custom-hooks/useRealtimeMessages";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { IoSend, IoCallOutline, IoVideocamOutline } from "react-icons/io5";
import { FaArrowLeft } from "react-icons/fa6";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/SupabaseClient";
import { formatTweetDate } from "@/lib/formatDate";

export default function ConversationPage() {
  const { conversationId } = useParams<{ conversationId: string }>();
  const { session } = useGetUser();
  const userId = session?.user.id;
  const { data: messages, isLoading } = useGetMessages(conversationId);
  const { mutate: send } = useSendMessage();
  const { mutate: markRead } = useMarkConversationRead();
  const [content, setContent] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [otherUser, setOtherUser] = useState<{
    id: string;
    name: string;
    username: string;
    avatar_url: string;
  } | null>(null);

  useRealtimeMessages(conversationId);

  // Fetch the other user's info
  useEffect(() => {
    if (!conversationId || !userId) return;
    const fetchOtherUser = async () => {
      const { data } = await supabase
        .from("conversation_participants")
        .select("user_id, profiles:user_id(id, name, username, avatar_url)")
        .eq("conversation_id", conversationId)
        .neq("user_id", userId)
        .single();
      const profile = Array.isArray(data?.profiles)
        ? data.profiles[0]
        : data?.profiles;
      if (profile) {
        setOtherUser(
          profile as { id: string; name: string; username: string; avatar_url: string }
        );
      }
    };
    fetchOtherUser();
  }, [conversationId, userId]);

  // Mark conversation as read when opened and when messages update
  useEffect(() => {
    if (userId && conversationId) {
      markRead({ userId, conversationId });
    }
  }, [userId, conversationId, messages, markRead]);

  // Scroll to bottom when messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!content.trim() || !userId || !conversationId) return;
    send({ conversationId, senderId: userId, content: content.trim() });
    setContent("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Header — 80px */}
      <div className="sticky top-0 z-10 bg-black/65 backdrop-blur-md px-4 h-[80px] flex items-center justify-between border-b border-border shrink-0">
        <div className="flex items-center gap-3">
          {/* Back button — only visible in single-panel (below xl) */}
          <button
            onClick={() => router.push("/home/messages")}
            className="xl:hidden cursor-pointer p-2 -ml-2 rounded-full hover:bg-hover"
          >
            <FaArrowLeft size={15} className="text-white" />
          </button>
          {otherUser && (
            <div className="flex items-center gap-3">
              <Image
                src={otherUser.avatar_url || "/images/default-avatar.svg"}
                alt={otherUser.name}
                width={48}
                height={48}
                className="rounded-full w-12 h-12 object-cover"
              />
              <span className="text-white font-bold text-[17px]">
                {otherUser.name}
              </span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-1">
          <button className="p-2 rounded-full hover:bg-hover cursor-pointer">
            <IoCallOutline size={20} className="text-secondary-text" />
          </button>
          <button className="p-2 rounded-full hover:bg-hover cursor-pointer">
            <IoVideocamOutline size={20} className="text-secondary-text" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto flex flex-col">
        {/* Profile card at top of conversation */}
        {otherUser && (
          <div className="flex flex-col items-center px-4 py-8">
            <Image
              src={otherUser.avatar_url || "/images/default-avatar.svg"}
              alt={otherUser.name}
              width={64}
              height={64}
              className="rounded-full w-16 h-16 object-cover"
            />
            <h3 className="text-white font-bold text-[17px] mt-2">
              {otherUser.name}
            </h3>
            <p className="text-secondary-text text-[14px]">
              @{otherUser.username}
            </p>
            <p className="text-secondary-text text-[14px] mt-1">
              Joined recently
            </p>
            <Link
              href={`/${otherUser.username}`}
              className="mt-6 bg-white text-black font-bold text-[14px] px-5 py-2 rounded-full hover:bg-white/90"
            >
              View Profile
            </Link>
          </div>
        )}

        {/* Message bubbles */}
        <div className="flex flex-col gap-[2px] pb-4">
          {isLoading ? (
            <div className="flex items-center justify-center min-h-[200px]">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            messages?.map((msg) => {
              const isMe = msg.sender_id === userId;
              return (
                <div
                  key={msg.id}
                  className={`w-full py-[4px] px-4 flex ${isMe ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`relative max-w-[90%] px-4 py-2 pb-5 rounded-2xl text-[15px] leading-[1.4] ${
                      isMe
                        ? "bg-primary text-white rounded-br-sm"
                        : "bg-[#2f3336] text-white rounded-bl-sm"
                    }`}
                  >
                    {msg.content}
                    <span
                      className={`absolute bottom-[4px] right-[10px] text-[11px] ${
                        isMe ? "text-white/60" : "text-secondary-text"
                      }`}
                    >
                      {formatTweetDate(msg.created_at)}
                    </span>
                  </div>
                </div>
              );
            })
          )}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input */}
      <div className="border-t border-border px-4 py-3 flex items-center gap-3 shrink-0">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Start a new message"
          rows={1}
          className="flex-1 bg-[#2f3336] text-white text-[15px] rounded-2xl px-4 py-2 resize-none outline-none placeholder:text-secondary-text"
          style={{ fieldSizing: "content" } as React.CSSProperties}
        />
        <button
          onClick={handleSend}
          disabled={!content.trim()}
          className="text-primary disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed p-2"
        >
          <IoSend size={20} />
        </button>
      </div>
    </div>
  );
}
