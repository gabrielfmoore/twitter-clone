"use client";

import { useGetUser } from "@/custom-hooks/useGetUser";
import { useGetConversations } from "@/custom-hooks/useChat";
import ConversationList from "@/src/components/ConversationList";
import NewConversationModal from "@/src/components/NewConversationModal";
import { useState } from "react";
import { LuMail } from "react-icons/lu";
import { IoSettingsOutline } from "react-icons/io5";

export default function MessagesPage() {
  const { session } = useGetUser();
  const userId = session?.user.id;
  const { data: conversations, isLoading } = useGetConversations(userId);
  const [showNewConvo, setShowNewConvo] = useState(false);

  return (
    <div className="flex flex-col min-h-screen">
      <div className="sticky top-0 z-10 bg-black/65 backdrop-blur-md px-4 h-[53px] flex items-center justify-between">
        <h2 className="text-white text-xl font-bold">Messages</h2>
        <div className="flex items-center gap-3">
          <button className="p-2 rounded-full hover:bg-hover cursor-pointer">
            <IoSettingsOutline size={20} className="text-white" />
          </button>
          <button
            onClick={() => setShowNewConvo(true)}
            className="p-2 rounded-full hover:bg-hover cursor-pointer"
          >
            <LuMail size={20} className="text-white" />
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : !conversations || conversations.length === 0 ? (
        <div className="flex flex-col items-start px-8 pt-8">
          <h2 className="text-white text-[31px] font-extrabold leading-[1.2] mb-2">
            Welcome to your inbox!
          </h2>
          <p className="text-secondary-text text-[15px] leading-[1.3] mb-6">
            Drop a line, share posts and more with private conversations between
            you and others on X.
          </p>
          <button
            onClick={() => setShowNewConvo(true)}
            className="bg-primary text-white font-bold text-[17px] px-8 py-3 rounded-full cursor-pointer hover:bg-primary/90"
          >
            Write a message
          </button>
        </div>
      ) : (
        <ConversationList conversations={conversations} currentUserId={userId!} />
      )}

      {showNewConvo && (
        <NewConversationModal onClose={() => setShowNewConvo(false)} />
      )}
    </div>
  );
}
