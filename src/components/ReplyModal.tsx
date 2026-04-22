"use client";

import Image from "next/image";
import { MdVerified, MdOutlineGifBox } from "react-icons/md";
import { IoClose, IoLocationOutline } from "react-icons/io5";
import { TbPhoto } from "react-icons/tb";
import { FaRegFaceSmile } from "react-icons/fa6";
import { RiCalendarScheduleLine, RiFlag2Line } from "react-icons/ri";
import { CiBoxList } from "react-icons/ci";
import { RxCross2 } from "react-icons/rx";
import Grok from "../../public/images/Grok-transparent.png";
import { Tweet } from "@/types/types";
import { useGetUser } from "@/custom-hooks/useGetUser";
import { useCreateComment } from "@/custom-hooks/useComment";
import { useEffect, useRef, useState } from "react";
import EmojiPicker, { EmojiClickData, Theme } from "emoji-picker-react";
import { formatTweetDate } from "@/lib/formatDate";

interface ReplyModalProps {
  tweet: Tweet;
  onClose: () => void;
}

export default function ReplyModal({ tweet, onClose }: ReplyModalProps) {
  const { profile, session } = useGetUser();
  const [reply, setReply] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const { mutate, isPending } = useCreateComment();
  
  // Refs for Focus & Modals
  const modalRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Emoji Picker State
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiRef = useRef<HTMLDivElement>(null);
  const emojiButtonRef = useRef<HTMLButtonElement>(null);

  // GIF Picker State
  const [showGifPicker, setShowGifPicker] = useState(false);
  const [gifSearch, setGifSearch] = useState("");
  const [gifResults, setGifResults] = useState<any[]>([]);
  const gifRef = useRef<HTMLDivElement>(null);
  const gifButtonRef = useRef<HTMLButtonElement>(null);

  const isDisabled = reply.trim() === "" && !selectedImage;

  // --- FOCUS TRAP LOGIC (SENTINELS) ---
  const getFocusableElements = () => {
    if (!modalRef.current) return [];
    return Array.from(
      modalRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      ),
    ).filter((el) => {
      const style = window.getComputedStyle(el);
      return style.display !== "none" && style.visibility !== "hidden";
    }) as HTMLElement[];
  };

  const handleFocusTop = () => {
    const focusable = getFocusableElements();
    if (focusable.length > 0) focusable[focusable.length - 1].focus();
  };

  const handleFocusBottom = () => {
    const focusable = getFocusableElements();
    if (focusable.length > 0) focusable[0].focus();
  };

  useEffect(() => {
    const focusable = getFocusableElements();
    if (focusable.length > 0) focusable[0].focus();
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  // --- GIPHY API LOGIC ---
  useEffect(() => {
    const fetchGifs = async () => {
      const apiKey = "aKs3kXfnrKXzCIqTE4FC4L0DUwSej6iO";
      const endpoint = gifSearch.trim() 
        ? `https://api.giphy.com/v1/gifs/search?api_key=${apiKey}&q=${gifSearch}&limit=20`
        : `https://api.giphy.com/v1/gifs/trending?api_key=${apiKey}&limit=20`;

      try {
        const res = await fetch(endpoint);
        const { data } = await res.json();
        setGifResults(data || []);
      } catch (err) {
        console.error("Giphy fetch failed", err);
      }
    };

    const timer = setTimeout(fetchGifs, 500);
    return () => clearTimeout(timer);
  }, [gifSearch]);

  // --- UNIFIED OUTSIDE ACTIONS (CLICK & ESCAPE) ---
  useEffect(() => {
    const handleOutsideActions = (e: MouseEvent | KeyboardEvent) => {
      // 1. Handle Main Modal Click-Outside
      if (e instanceof MouseEvent && modalRef.current && !modalRef.current.contains(e.target as Node)) {
        // Only close main modal if no sub-pickers are open
        if (!showEmojiPicker && !showGifPicker) onClose();
      }

      // 2. Handle Escape Key
      if (e instanceof KeyboardEvent && e.key === "Escape") {
        if (showEmojiPicker) {
          e.stopPropagation();
          setShowEmojiPicker(false);
          emojiButtonRef.current?.focus();
        } else if (showGifPicker) {
          e.stopPropagation();
          setShowGifPicker(false);
          gifButtonRef.current?.focus();
        } else {
          onClose();
        }
      }

      // 3. Handle Picker Clicks-Outside
      if (e instanceof MouseEvent) {
        if (showEmojiPicker && emojiRef.current && !emojiRef.current.contains(e.target as Node)) {
          setShowEmojiPicker(false);
        }
        if (showGifPicker && gifRef.current && !gifRef.current.contains(e.target as Node)) {
          setShowGifPicker(false);
        }
      }
    };

    document.addEventListener("mousedown", handleOutsideActions);
    document.addEventListener("keydown", handleOutsideActions);
    return () => {
      document.removeEventListener("mousedown", handleOutsideActions);
      document.removeEventListener("keydown", handleOutsideActions);
    };
  }, [showEmojiPicker, showGifPicker, onClose]);

  const handleReply = () => {
    if ((!reply.trim() && !selectedImage) || !session?.user.id) return;
    const file = fileInputRef.current?.files?.[0] ?? null;
    mutate(
      { userId: session.user.id, tweetId: tweet.id, content: reply, commentImage: file },
      {
        onSuccess: () => {
          setReply("");
          setSelectedImage(null);
          onClose();
        },
      },
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black sm:bg-background-2 pt-[1px] sm:pt-[35px]">
      {/* TOP SENTINEL */}
      <div tabIndex={0} onFocus={handleFocusTop} className="sr-only" />

      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        className="bg-black w-full flex flex-col justify-between min-h-[290px] sm:min-h-[292px] max-w-[602px] rounded-2xl sm:border border-border"
      >
        <div className="pl-[16px] pr-[10px] sm:pl-[15px] sm:pr-[15px]">
          {/* Header */}
          <div className="flex h-[52px] items-center justify-between mb-[16px] sm:mb-[17px]">
            <button
              onClick={onClose}
              className="p-2 -translate-x-2 rounded-full hover:bg-hover text-white outline-none focus-visible:ring-2 ring-primary"
            >
              <IoClose size={22} />
            </button>
            <span className="font-extrabold text-[14px] text-primary mr-4 flex items-center">
              Drafts
              <button
                disabled={isDisabled || isPending}
                onClick={handleReply}
                className={`sm:hidden text-[14px] font-bold ml-[18px] px-[17px] pt-[5px] pb-[6px] rounded-full transition-opacity ${
                  isDisabled || isPending ? "bg-primary/50 text-white/50 cursor-not-allowed" : "bg-primary text-white"
                }`}
              >
                {isPending ? "Replying..." : "Reply"}
              </button>
            </span>
          </div>

          {/* Original Tweet Info */}
          <div className="flex gap-[10px]">
            <div className="flex flex-col items-center">
              <Image
                src={tweet.profiles?.avatar_url || "/images/default-avatar.svg"}
                alt="Profile" width={40} height={40} className="w-10 h-10 rounded-full object-cover shrink-0"
              />
              <div className="w-[2px] flex-1 bg-border mt-1" />
            </div>
            <div className="flex-1 min-w-0 pb-4">
              <div className="flex gap-1 text-[15px] items-center">
                <span className="text-white font-bold truncate">{tweet.profiles?.name}</span>
                <MdVerified className="text-primary shrink-0" />
                <span className="text-secondary-text truncate">@{tweet.profiles?.username}</span>
                <span className="text-secondary-text">·</span>
                <span className="text-secondary-text">{formatTweetDate(tweet.created_at)}</span>
              </div>
              {tweet.content && <p className="text-white text-[15px] mt-1 leading-[1.3]">{tweet.content}</p>}
              <p className="text-secondary-text text-[15px] mt-3">
                Replying to <span className="text-primary">@{tweet.profiles?.username}</span>
              </p>
            </div>
          </div>

          {/* User Input Area */}
          <div className="flex gap-[10px] min-h-[110px] mt-4">
            <Image
              src={profile?.avatar_url || "/images/default-avatar.svg"}
              alt="Your avatar" width={40} height={40} className="w-10 h-10 rounded-full object-cover shrink-0"
            />
            <div className="flex-1 min-w-0">
              <textarea
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                placeholder="Post your reply"
                rows={1}
                className="w-full py-1 text-white text-[21px] placeholder:text-secondary-text outline-none bg-transparent resize-none field-sizing-content"
              />
              {selectedImage && (
                <div className="relative mt-2 rounded-2xl overflow-hidden border border-border group">
                  <img src={selectedImage} alt="Selected" className="w-full max-h-[300px] object-cover" />
                  <button
                    onClick={() => { setSelectedImage(null); if (fileInputRef.current) fileInputRef.current.value = ""; }}
                    className="absolute top-2 right-2 bg-black/70 w-8 h-8 flex items-center justify-center rounded-full text-white hover:bg-black/90"
                  >
                    <RxCross2 size={18} />
                  </button>
                </div>
              )}
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" 
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) setSelectedImage(URL.createObjectURL(file));
                }} 
              />
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="relative flex items-center justify-between ml-2 mr-6 pl-2 mt-2 py-[9px]">
          <div className="flex gap-[12px] items-center">
            {/* Photo Button */}
            <button type="button" onClick={() => fileInputRef.current?.click()} className="text-primary hover:bg-primary/10 p-2 rounded-full outline-none focus-visible:ring-2 ring-primary">
              <TbPhoto size={18} />
            </button>

            {/* GIF Picker Button */}
            <div ref={gifRef}>
              <button ref={gifButtonRef} type="button" onClick={() => setShowGifPicker(!showGifPicker)} className="text-primary hover:bg-primary/10 p-2 rounded-full outline-none focus-visible:ring-2 ring-primary">
                <MdOutlineGifBox size={20} />
              </button>
              {showGifPicker && (
                <div className="absolute z-50 top-full left-0 mb-2 w-[300px] h-[400px] bg-black border border-border rounded-xl flex flex-col shadow-2xl">
                  <div className="p-2 border-b border-border">
                    <input autoFocus type="text" placeholder="Search GIFs" value={gifSearch} onChange={(e) => setGifSearch(e.target.value)}
                      className="w-full bg-[#16181c] text-white p-2 rounded-lg outline-none ring-primary focus:ring-1" />
                  </div>
                  <div className="flex-1 overflow-y-auto p-2 grid grid-cols-2 gap-2 custom-scrollbar">
                    {gifResults.map((gif) => (
                      <button key={gif.id} type="button" onClick={() => { setSelectedImage(gif.images.fixed_height.url); setShowGifPicker(false); gifButtonRef.current?.focus(); }}
                        className="w-full h-24 rounded overflow-hidden focus:ring-2 ring-primary outline-none hover:opacity-80">
                        <img src={gif.images.fixed_height.url} alt={gif.title} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Grok, List, etc (Placeholders) */}
            <button type="button" className="text-primary hover:bg-primary/10 p-2 rounded-full outline-none focus-visible:ring-2 ring-primary">
              <div className="w-[20px] h-[20px] bg-primary" style={{ WebkitMaskImage: `url(${Grok.src})`, maskImage: `url(${Grok.src})`, WebkitMaskSize: "contain", WebkitMaskRepeat: "no-repeat" }} />
            </button>
            <button type="button" className="text-primary hover:bg-primary/10 p-2 rounded-full outline-none focus-visible:ring-2 ring-primary">
              <CiBoxList size={20} />
            </button>

            {/* Emoji Picker Button */}
            <div ref={emojiRef}>
              <button ref={emojiButtonRef} type="button" onClick={() => setShowEmojiPicker(!showEmojiPicker)} className="text-primary hover:bg-primary/10 p-2 rounded-full outline-none focus-visible:ring-2 ring-primary">
                <FaRegFaceSmile size={17} />
              </button>
              {showEmojiPicker && (
                <div className="absolute z-50 top-full left-0 mb-2 border border-border rounded-lg overflow-hidden">
                  <EmojiPicker theme={Theme.DARK} autoFocusSearch onEmojiClick={(data) => setReply(p => p + data.emoji)} />
                </div>
              )}
            </div>

            <button type="button" className="text-primary hover:bg-primary/10 p-2 rounded-full outline-none focus-visible:ring-2 ring-primary">
              <RiCalendarScheduleLine size={18} />
            </button>
            <button type="button" className="text-primary hover:bg-primary/10 p-2 rounded-full outline-none focus-visible:ring-2 ring-primary">
              <IoLocationOutline size={18} />
            </button>
          </div>

          {/* Desktop Reply Button */}
          <button
            disabled={isDisabled || isPending} onClick={handleReply}
            className={`hidden sm:block text-[15px] font-bold px-[17px] py-[6.6px] rounded-full outline-none focus-visible:ring-2 ring-primary ${
              isDisabled || isPending ? "bg-secondary-background-2 text-black opacity-50 border border-border" : "bg-white text-black"
            }`}
          >
            {isPending ? "Replying..." : "Reply"}
          </button>
        </div>
      </div>

      {/* BOTTOM SENTINEL */}
      <div tabIndex={0} onFocus={handleFocusBottom} className="sr-only" />
    </div>
  );
}