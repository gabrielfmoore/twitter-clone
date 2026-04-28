
"use client";
import { useGetUser } from "@/custom-hooks/useGetUser";
import { useRealtimeMessages } from "@/custom-hooks/useRealtimeMessages";

import InboxPanel from "@/src/components/InboxPanel";
import NewConversationModal from "@/src/components/NewConversationModal";
import { useState } from "react";
import { IoChatbubbleOutline } from "react-icons/io5";

export default function MessagesPage() {
  const [showNewConvo, setShowNewConvo] = useState(false);
  const { session } = useGetUser();
  const userId = session?.user.id;
  useRealtimeMessages(userId);

  return (
    <>
      {/* Narrow view: full inbox */}
      <div className="xl:hidden h-screen">
        <InboxPanel />
      </div>

      {/* Wide view: placeholder */}
      <div className="hidden xl:flex flex-col items-center justify-center h-screen px-8">
        <div className="w-24 h-24 rounded-full bg-[#2f3336] flex items-center justify-center mb-6">
          <IoChatbubbleOutline size={40} className="text-white" />
        </div>
        <h2 className="text-white text-[31px] font-extrabold mb-2">
          Start Conversation
        </h2>
        <p className="text-secondary-text text-[15px] text-center mb-6 max-w-[300px]">
          Choose from your existing conversations, or start a new one
        </p>
        <button
          onClick={() => setShowNewConvo(true)}
          className="bg-primary text-white font-bold text-[17px] px-8 py-3 rounded-full cursor-pointer hover:bg-primary/90"
        >
          New chat
        </button>
        {showNewConvo && (
          <NewConversationModal onClose={() => setShowNewConvo(false)} />
        )}
      </div>
    </>
  );
}
