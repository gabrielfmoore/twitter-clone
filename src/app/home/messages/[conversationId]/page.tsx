"use client";

import { useGetUser } from "@/custom-hooks/useGetUser";
import { useGetMessages, useSendMessage } from "@/custom-hooks/useChat";
import { useRealtimeMessages } from "@/custom-hooks/useRealtimeMessages";
import GoBackButton from "@/src/components/GoBackButton";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { IoSend } from "react-icons/io5";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/SupabaseClient";

export default function ConversationPage() {
  const { conversationId } = useParams<{ conversationId: string }>();
  const { session } = useGetUser();
  const userId = session?.user.id;
  const { data: messages, isLoading } = useGetMessages(conversationId);
  const { mutate: send } = useSendMessage();
  const [content, setContent] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const [otherUser, setOtherUser] = useState<{
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
        .select("profiles(name, username, avatar_url)")
        .eq("conversation_id", conversationId)
        .neq("user_id", userId)
        .single();
      const profile = Array.isArray(data?.profiles)
        ? data.profiles[0]
        : data?.profiles;
      if (profile) {
        setOtherUser(profile as { name: string; username: string; avatar_url: string });
      }
    };
    fetchOtherUser();
  }, [conversationId, userId]);

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
      {/* Header */}
      <div className="sticky top-0 z-10 bg-black/65 backdrop-blur-md px-4 h-[53px] flex items-center gap-4 border-b border-border">
        <GoBackButton />
        {otherUser && (
          <div className="flex items-center gap-2">
            <Image
              src={otherUser.avatar_url || "/images/default-avatar.svg"}
              alt={otherUser.name}
              width={32}
              height={32}
              className="rounded-full w-8 h-8 object-cover"
            />
            <span className="text-white font-bold text-[17px]">
              {otherUser.name}
            </span>
          </div>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-1">
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
                className={`flex ${isMe ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[75%] px-4 py-2 rounded-2xl text-[15px] leading-[1.3] ${
                    isMe
                      ? "bg-primary text-white rounded-br-sm"
                      : "bg-[#2f3336] text-white rounded-bl-sm"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="border-t border-border px-4 py-3 flex items-center gap-3">
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
