"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { IoClose, IoSearch } from "react-icons/io5";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useGetUser } from "@/custom-hooks/useGetUser";
import { useSearchUsers, useGetOrCreateConversation } from "@/custom-hooks/useChat";

export default function NewConversationModal({
  onClose,
}: {
  onClose: () => void;
}) {
  const { session } = useGetUser();
  const userId = session?.user.id;
  const [search, setSearch] = useState("");
  const { data: results } = useSearchUsers(search, userId);
  const { mutateAsync: getOrCreate } = useGetOrCreateConversation();
  const router = useRouter();

  const handleSelectUser = async (otherUserId: string) => {
    if (!userId) return;
    const conversationId = await getOrCreate({
      currentUserId: userId,
      otherUserId,
    });
    onClose();
    router.push(`/home/messages/${conversationId}`);
  };

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black sm:bg-[rgba(91,112,131,0.4)] sm:pt-0 sm:items-center"
      onClick={onClose}
    >
      <div
        className="w-full h-full max-w-none rounded-none flex flex-col overflow-hidden sm:bg-black sm:w-full sm:max-w-[600px] sm:h-[90vh] sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center px-4 h-[53px] gap-3 shrink-0">
          <button
            onClick={onClose}
            className="w-[34px] h-[34px] flex items-center justify-center rounded-full hover:bg-hover cursor-pointer"
          >
            <IoClose className="text-white text-[20px]" />
          </button>
          <h2 className="text-white text-xl font-bold flex-1">New message</h2>
        </div>

        {/* Search */}
        <div className="px-4 py-2 border-b border-border">
          <div className="flex items-center gap-2 text-secondary-text">
            <IoSearch size={18} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search people"
              className="bg-transparent text-white text-[15px] outline-none w-full placeholder:text-secondary-text"
            />
          </div>
        </div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto">
          {results?.map((user) => (
            <button
              key={user.id}
              onClick={() => handleSelectUser(user.id)}
              className="flex items-center gap-3 px-4 py-3 hover:bg-hover cursor-pointer w-full text-left"
            >
              <Image
                src={user.avatar_url || "/images/default-avatar.svg"}
                alt={user.name}
                width={40}
                height={40}
                className="rounded-full w-10 h-10 object-cover"
              />
              <div className="flex flex-col">
                <span className="text-white font-bold text-[15px]">
                  {user.name}
                </span>
                <span className="text-secondary-text text-[13px]">
                  @{user.username}
                </span>
              </div>
            </button>
          ))}
          {search.length >= 2 && results?.length === 0 && (
            <p className="text-secondary-text text-[15px] px-4 py-8 text-center">
              No people found
            </p>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
