"use client";
import React, { useState, useRef, useEffect, ChangeEvent } from "react";
import Image from "next/image";
import { TbPhoto } from "react-icons/tb";
import { FaRegFaceSmile } from "react-icons/fa6";
import { IoLocationOutline } from "react-icons/io5";
import { RxCross2 } from "react-icons/rx";
import EmojiPicker, { EmojiClickData, Theme } from "emoji-picker-react";
import Grok from "../../public/images/Grok-transparent.png";
import { MdOutlineGifBox } from "react-icons/md";
import { RiFlag2Line } from "react-icons/ri";
import { useUserSession } from "@/custom-hooks/useUserSession";
import { useCreateComment } from "@/custom-hooks/useComment";

export default function ReplyPost({ tweetId, tweetOwnerId }: { tweetId: string; tweetOwnerId?: string }) {
    // GIF Picker State
    const [showGifPicker, setShowGifPicker] = useState(false);
    const [gifSearch, setGifSearch] = useState("");
    const [gifResults, setGifResults] = useState<any[]>([]);
    const gifRef = useRef<HTMLDivElement>(null);
  const [reply, setReply] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const isDisabled = reply.trim() === "" && !selectedImage;
  const { mutate, isPending} = useCreateComment()
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiRef = useRef<HTMLDivElement | null>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [showAbove, setShowAbove] = useState(false);
  const { session } = useUserSession();
  const userId = session?.user.id;

  // Handle outside click and ESC for pickers
  useEffect(() => {
    if (!showEmojiPicker && !showGifPicker) return;
    const handle = (e: MouseEvent | KeyboardEvent) => {
      if (e instanceof MouseEvent) {
        if (showEmojiPicker && emojiRef.current && !emojiRef.current.contains(e.target as Node)) setShowEmojiPicker(false);
        if (showGifPicker && gifRef.current && !gifRef.current.contains(e.target as Node)) setShowGifPicker(false);
      }
      if (e instanceof KeyboardEvent && e.key === "Escape") {
        if (showEmojiPicker) setShowEmojiPicker(false);
        else if (showGifPicker) setShowGifPicker(false);
      }
    };
    document.addEventListener("mousedown", handle);
    document.addEventListener("keydown", handle);
    return () => {
      document.removeEventListener("mousedown", handle);
      document.removeEventListener("keydown", handle);
    };
  }, [showEmojiPicker, showGifPicker]);

  // Giphy API logic
  useEffect(() => {
    if (!showGifPicker) return;
    const fetchGifs = async () => {
      const apiKey = "aKs3kXfnrKXzCIqTE4FC4L0DUwSej6iO";
      const endpoint = gifSearch.trim()
        ? `https://api.giphy.com/v1/gifs/search?api_key=${apiKey}&q=${gifSearch}&limit=20`
        : `https://api.giphy.com/v1/gifs/trending?api_key=${apiKey}&limit=20`;
      try {
        const res = await fetch(endpoint);
        const { data } = await res.json();
        setGifResults(data || []);
      } catch {}
    };
    const timer = setTimeout(fetchGifs, 400);
    return () => clearTimeout(timer);
  }, [gifSearch, showGifPicker]);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
    }
  };

  const onEmojiClick = (emojiData: EmojiClickData) => {
    setReply((prev) => prev + emojiData.emoji);
  };

  const PostComment = () => {
    if (!reply.trim() && !selectedImage) return;
    if (!userId) return;
    const file = fileRef.current?.files?.[0] ?? null;
    mutate({
      userId,
      tweetId,
      content: reply,
      commentImage: file,
    },{
      onSuccess: () => {
        setReply("");
        setSelectedImage(null);
        if (fileRef.current) fileRef.current.value = "";
      }
    })
  };

  if (!session) return null;

  return (
    <div className={`flex min-h-[84px] gap-[10px] px-4 pt-3 pb-2 border-b border-border ${isPending ? "opacity-30" : ""}`}>
      <Image
        src="/images/profile.png"
        alt="Profile"
        width={500}
        height={500}
        className="w-10 h-10 mt-1 object-cover rounded-full shrink-0"
      />
      <div className="w-full min-w-0">
        <textarea
          value={reply}
          onChange={(e) => setReply(e.target.value)}
          onFocus={() => setIsFocused(true)}
          placeholder="Post your reply"
          suppressHydrationWarning
          rows={1}
          className="w-full py-3 -my-[2px] text-white font-bold placeholder:text-secondary-text placeholder:font-normal outline-none text-xl tracking-[0.02em] text-white resize-none field-sizing-content"
        />
        {selectedImage && (
          <div className="relative h-60 md:h-100 rounded-lg overflow-hidden border border border mb-10">
            <Image
              src={selectedImage}
              alt="Selected"
              width={500}
              height={500}
              className="h-full w-full object-cover"
            />
            <button className="absolute flex items-center justify-center top-5 right-5 bg-black w-8 h-8 rounded-full text-2x opacity-50 cursor-pointer hover:bg-hover">
              <RxCross2
                size={20}
                className="text-white"
                onClick={() => {
                  setSelectedImage(null);
                  if (fileRef.current) fileRef.current.value = "";
                }}
              />
            </button>
          </div>
        )}
        <div
          className={`${isFocused ? "flex" : "hidden"} relative justify-between pt-[13px] pl-[1px] items-center`}
          style={{zIndex: 1}}
        >
          <div className="flex gap-[18px] min-w-0 overflow-x-auto scrollbar-hidden">
            <div
              className="text-primary cursor-pointer"
              onClick={() => fileRef.current?.click()}
            >
              <TbPhoto size={18} className="translate-y-[1px]" />
            </div>
            <div ref={gifRef} className="text-primary cursor-pointer relative">
              <div
                className="text-primary cursor-pointer"
                onClick={() => {
                  if (!showGifPicker && gifRef.current) {
                    const rect = gifRef.current.getBoundingClientRect();
                    const spaceBelow = window.innerHeight - rect.bottom;
                    setShowAbove(spaceBelow < 450);
                  }
                  setShowGifPicker((v) => !v);
                }}
              >
                <MdOutlineGifBox size={20} className="translate-x-[-1px]" />
              </div>
              {showGifPicker && (
                <div
                  className={`absolute z-50 left-0 w-[320px] max-w-2xl border border-border rounded-lg ${showAbove ? "bottom-full" : "top-full"}`}
                  style={{ background: "black", height: 400 }}
                >
                  <div className="p-2 border-b border-border">
                    <input
                      autoFocus
                      type="text"
                      placeholder="Search GIFs"
                      value={gifSearch}
                      onChange={(e) => setGifSearch(e.target.value)}
                      className="w-full bg-[#16181c] text-white p-2 rounded-lg outline-none ring-primary focus:ring-1"
                    />
                  </div>
                  <div className="flex-1 overflow-y-auto p-2 grid grid-cols-2 gap-2 custom-scrollbar">
                    {gifResults.map((gif) => (
                      <button
                        key={gif.id}
                        type="button"
                        onClick={() => {
                          setSelectedImage(gif.images.fixed_height.url);
                          setShowGifPicker(false);
                        }}
                        className="w-full h-24 rounded overflow-hidden focus:ring-2 ring-primary outline-none hover:opacity-80"
                      >
                        <img src={gif.images.fixed_height.url} alt={gif.title} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="text-primary cursor-pointer shrink-0">
              <Image
                src={Grok}
                alt="Grok"
                width={20}
                height={20}
                className="translate-x-[-3px]"
              />
            </div>
            <div ref={emojiRef}>
              <div
                className="text-primary cursor-pointer"
                onClick={() => {
                  if (!showEmojiPicker && emojiRef.current) {
                    const rect = emojiRef.current.getBoundingClientRect();
                    const spaceBelow = window.innerHeight - rect.bottom;
                    setShowAbove(spaceBelow < 450);
                  }
                  setShowEmojiPicker(!showEmojiPicker);
                }}
              >
                <FaRegFaceSmile
                  size={17}
                  className="translate-x-[-5px] translate-y-[1px]"
                />
              </div>
              {showEmojiPicker && (
                <div
                  className={`absolute z-10 left-0 w-[320px] max-w-2xl border border-border rounded-lg ${showAbove ? "bottom-full" : "top-full"}`}
                >
                  <EmojiPicker
                    onEmojiClick={onEmojiClick}
                    theme={Theme.DARK}
                    style={{ width: "320", background: "black" }}
                  />
                </div>
              )}
            </div>
            <div className="hidden sm:block text-primary cursor-pointer translate-x-[-5px]">
              <IoLocationOutline size={18} />
            </div>
            <div className="text-primary cursor-pointer translate-x-[-5px]">
              <RiFlag2Line size={19} style={{ transform: "scaleY(1.1)" }} />
            </div>
          </div>
          {isDisabled ? (
            <button
              suppressHydrationWarning
              className="shrink-0 bg-secondary-background-2 border border-border text-black text-[15px] font-bold px-[17px] py-[6px] mt-[2px] rounded-full cursor-not-allowed translate-y-[-2px] translate-x-[1px] opacity-50"
            >
              Reply
            </button>
          ) : (
            <button
                onClick={PostComment}
              suppressHydrationWarning
              className="shrink-0 bg-white text-black text-[15px] font-bold px-4 py-[5px] rounded-full cursor-pointer"
            >
              Reply
            </button>
          )}
        </div>
        <input
          type="file"
          ref={fileRef}
          className="hidden"
          onChange={handleImageChange}
        />
      </div>
    </div>
  );
}
