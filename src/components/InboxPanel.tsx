"use client";

import { useState, useRef, useEffect } from "react";
import { useGetUser } from "@/custom-hooks/useGetUser";
import {
  useGetConversations,
  useSearchUsers,
  useGetOrCreateConversation,
  useUnreadConversations,
} from "@/custom-hooks/useChat";
import { useRouter } from "next/navigation";
import Image from "next/image";
import NewConversationModal from "./NewConversationModal";
import { formatTweetDate } from "@/lib/formatDate";
import {
  IoChatbubbleOutline,
  IoSearchOutline,
  IoSettingsOutline,
  IoCheckmarkOutline,
  IoChevronForward,
  IoPersonOutline,
  IoPeopleOutline,
  IoChevronDown,
} from "react-icons/io5";
import { FaArrowLeft } from "react-icons/fa6";
import Link from "next/link";
import { TbMessageCirclePlus } from "react-icons/tb";

export default function InboxPanel() {
  const { session } = useGetUser();
  const userId = session?.user.id;
  const { data: conversations, isLoading } = useGetConversations(userId);
  const { data: unreadConvos } = useUnreadConversations(userId);
  const unreadSet = new Set(unreadConvos || []);
  const [showNewConvo, setShowNewConvo] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const { data: searchResults } = useSearchUsers(searchQuery, userId);
  const { mutateAsync: getOrCreate } = useGetOrCreateConversation();

  // Close dropdown on outside click
  useEffect(() => {
    if (!showDropdown) return;
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showDropdown]);

  // Close search on outside click
  useEffect(() => {
    if (!searchFocused) return;
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchFocused(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [searchFocused]);

  const handleSelectUser = async (otherUserId: string) => {
    if (!userId) return;
    const conversationId = await getOrCreate({
      currentUserId: userId,
      otherUserId,
    });
    setSearchFocused(false);
    setSearchQuery("");
    router.push(`/home/messages/${conversationId}`);
  };

  const handleSelectConversation = (conversationId: string) => {
    setSearchFocused(false);
    setSearchQuery("");
    router.push(`/home/messages/${conversationId}`);
  };

  return (
    <div className="flex flex-col h-full min-h-screen">
      {/* Header — 64px */}
      <div className="sticky top-0 z-10 bg-black/65 backdrop-blur-md px-4 h-[64px] flex items-center justify-between shrink-0">
        <h2 className="text-white text-xl font-bold">Chat</h2>
        <div className="flex items-center gap-2">
          {/* Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-1 text-white text-[15px] font-bold pr-2 pl-4 py-[6px] rounded-full hover:bg-hover cursor-pointer border border-border"
            >
              All <IoChevronDown size={18} className="text-secondary-text" />
            </button>
            {showDropdown && (
              <div className="absolute right-0 top-full mt-1 w-[280px] bg-black border border-border rounded-xl shadow-lg z-50 py-1 overflow-hidden">
                <button suppressHydrationWarning className="flex items-center gap-3 px-4 py-3 hover:bg-hover w-full text-left cursor-pointer">
                  <IoChatbubbleOutline size={20} className="text-white" />
                  <span className="text-white text-[15px]">All</span>
                </button>
                <button suppressHydrationWarning className="flex items-center gap-3 px-4 py-3 hover:bg-hover w-full text-left cursor-pointer">
                  <div className="relative">
                    <IoChatbubbleOutline size={20} className="text-white" />
                    <div className="absolute -top-[1px] -right-[1px] w-[7px] h-[7px] bg-primary rounded-full" />
                  </div>
                  <span className="text-white text-[15px]">Unread</span>
                </button>
                <button suppressHydrationWarning className="flex items-center gap-3 px-4 py-3 hover:bg-hover w-full text-left cursor-pointer">
                  <IoPersonOutline size={20} className="text-white" />
                  <span className="text-white text-[15px]">Direct</span>
                </button>
                <button suppressHydrationWarning className="flex items-center gap-3 px-4 py-3 hover:bg-hover w-full text-left cursor-pointer">
                  <IoPeopleOutline size={20} className="text-white" />
                  <span className="text-white text-[15px]">Groups</span>
                </button>
                <div className="border-t border-border my-1" />
                <button suppressHydrationWarning className="flex items-center justify-between px-4 py-3 hover:bg-hover w-full cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <IoChatbubbleOutline size={20} className="text-white" />
                      <FaArrowLeft
                        size={8}
                        className="text-white absolute -bottom-[2px] -left-[3px]"
                      />
                    </div>
                    <span className="text-white text-[15px]">Requests</span>
                  </div>
                  <IoChevronForward size={18} className="text-secondary-text" />
                </button>
                <button suppressHydrationWarning className="flex items-center justify-between px-4 py-3 hover:bg-hover w-full cursor-pointer">
                  <div className="flex items-center gap-3">
                    <IoSettingsOutline size={20} className="text-white" />
                    <span className="text-white text-[15px]">Settings</span>
                  </div>
                  <IoChevronForward size={18} className="text-secondary-text" />
                </button>
                <div className="border-t border-border my-1" />
                <button suppressHydrationWarning className="flex items-center gap-3 px-4 py-3 hover:bg-hover w-full text-left cursor-pointer">
                  <IoCheckmarkOutline size={20} className="text-white" />
                  <span className="text-white text-[15px]">
                    Mark all as read
                  </span>
                </button>
              </div>
            )}
          </div>
          {/* New message button */}
          <button suppressHydrationWarning
            onClick={() => setShowNewConvo(true)}
            className="p-2 rounded-full hover:bg-hover cursor-pointer border border-border"
          >
            <div className="relative">
              <TbMessageCirclePlus size={20} className="text-white" />
            </div>
          </button>
        </div>
      </div>

      {/* Search bar — 50px */}
      <div ref={searchRef} className="relative">
        <div className="flex items-center h-[50px] px-4 py-1 mb-4">
          <div
            className={`flex items-center gap-2 w-full h-full rounded-full px-3 border ${searchFocused ? "border-primary bg-transparent" : "border-white/5 bg-bg-grey justify-center"}`}
          >
            <IoSearchOutline
              size={20}
              className={
                searchFocused
                  ? "text-primary shrink-0"
                  : "text-secondary-text shrink-0"
              }
            />
            <input
              suppressHydrationWarning
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              placeholder="Search"
              className={`bg-transparent text-white text-[15px] outline-none placeholder:text-secondary-text ${searchFocused ? "w-full" : "w-[50px]"}`}
            />
          </div>
        </div>

        {/* Search results dropdown */}
        {searchFocused && (
          <div className="absolute top-[50px] left-0 right-0 bg-black border-b border-border max-h-[400px] overflow-y-auto z-20 shadow-lg">
            {searchQuery.length >= 2 && searchResults ? (
              searchResults.length > 0 ? (
                searchResults.map((user) => (
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
                      className="rounded-full w-10 h-10 object-cover shrink-0"
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
                ))
              ) : (
                <p className="text-secondary-text text-[15px] px-4 py-6 text-center">
                  No people found
                </p>
              )
            ) : /* Recent conversations when search is empty/short */
            conversations && conversations.length > 0 ? (
              conversations.slice(0, 5).map((convo) => (
                <button
                suppressHydrationWarning 
                  key={convo.id}
                  onClick={() => handleSelectConversation(convo.id)}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-hover cursor-pointer w-full text-left"
                >
                  <Image
                    src={
                      convo.otherUser?.avatar_url ||
                      "/images/default-avatar.svg"
                    }
                    alt={convo.otherUser?.name || "User"}
                    width={40}
                    height={40}
                    className="rounded-full w-10 h-10 object-cover shrink-0"
                  />
                  <div className="flex flex-col">
                    <span className="text-white font-bold text-[15px]">
                      {convo.otherUser?.name}
                    </span>
                    <span className="text-secondary-text text-[13px]">
                      @{convo.otherUser?.username}
                    </span>
                  </div>
                </button>
              ))
            ) : (
              <p className="text-secondary-text text-[14px] px-4 py-6 text-center">
                No recent conversations
              </p>
            )}
          </div>
        )}
      </div>

      {/* Conversation list or empty state */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center min-h-[200px]">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : !conversations || conversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center pt-20 px-8">
            <IoChatbubbleOutline
              size={48}
              className="text-secondary-text mb-4"
            />
            <h3 className="text-white text-[24px] font-bold mb-1">
              Empty inbox
            </h3>
            <p className="text-secondary-text text-[15px]">Message someone</p>
          </div>
        ) : (
          <div>
            {conversations.map((convo) => (
              <Link
                key={convo.id}
                href={`/home/messages/${convo.id}`}
                className="flex items-center gap-3 px-4 h-[80px] hover:bg-hover cursor-pointer"
              >
                <Image
                  src={
                    convo.otherUser?.avatar_url || "/images/default-avatar.svg"
                  }
                  alt={convo.otherUser?.name || "User"}
                  width={56}
                  height={56}
                  className="rounded-full w-14 h-14 object-cover shrink-0"
                />
                <div className="flex items-center gap-3 border-b border-border h-full w-full min-w-0">
                  <div className="flex flex-col min-w-0 flex-1">
                    <span className="text-white font-bold text-[15px] truncate">
                      {convo.otherUser?.name}
                    </span>
                    {convo.lastMessage && (
                      <p className="text-secondary-text text-[14px] truncate">
                        {convo.lastMessage.sender_id === userId && "You: "}
                        {convo.lastMessage.content}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col items-end shrink-0 gap-1">
                    {convo.lastMessage && (
                      <span className="text-secondary-text text-[13px]">
                        {formatTweetDate(convo.lastMessage.created_at)}
                      </span>
                    )}
                    {/* Unread dot — only shown for unread conversations */}
                    {unreadSet.has(convo.id) && (
                      <div className="w-[8px] h-[8px] rounded-full bg-primary" />
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {showNewConvo && (
        <NewConversationModal onClose={() => setShowNewConvo(false)} />
      )}
    </div>
  );
}
