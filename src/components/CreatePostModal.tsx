"use client";

import { useState, useRef, useEffect, ChangeEvent } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { IoClose } from "react-icons/io5";
import { TbPhoto } from "react-icons/tb";
import { FaRegFaceSmile } from "react-icons/fa6";
import { IoLocationOutline } from "react-icons/io5";
import { RiCalendarScheduleLine } from "react-icons/ri";
import { RxCross2 } from "react-icons/rx";
import EmojiPicker, { EmojiClickData, Theme } from "emoji-picker-react";
import Grok from "../../public/images/Grok-transparent.png";
import { CiBoxList } from "react-icons/ci";
import { MdOutlineGifBox } from "react-icons/md";
import { RiFlag2Line } from "react-icons/ri";
import { useGetUser } from "@/custom-hooks/useGetUser";
import { usePostTweet } from "@/custom-hooks/useTweet";
import { FaGlobeAmericas } from "react-icons/fa";


interface CreatePostModalProps {
  onClose: () => void;
}

export default function CreatePostModal({ onClose }: CreatePostModalProps) {
    // GIF Picker State
    const [showGifPicker, setShowGifPicker] = useState(false);
    const [gifSearch, setGifSearch] = useState("");
    const [gifResults, setGifResults] = useState<any[]>([]);
    const gifRef = useRef<HTMLDivElement>(null);
  const { profile, session } = useGetUser();
  const [post, setPost] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [tweetImage, setTweetImage] = useState<File | null>(null);
  const isDisabled = post.trim() === "" && !selectedImage;
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiRef = useRef<HTMLDivElement | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const { mutate, isPending } = usePostTweet();

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

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
      setTweetImage(file);
    }
  };

  const onEmojiClick = (emojiData: EmojiClickData) => {
    setPost((prev) => prev + emojiData.emoji);
  };

  const PostTweet = () => {
    if (!post.trim() && !tweetImage) return;
    if (!session?.user.id) return;
    mutate(
      {
        userId: session.user.id,
        content: post,
        tweetImage: tweetImage || null,
      },
      {
        onSuccess: () => {
          setPost("");
          setSelectedImage(null);
          setTweetImage(null);
          onClose();
        },
      },
    );
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black sm:bg-background-2 pt-[1px] sm:pt-[35px]">
      <div
        ref={modalRef}
        className="bg-black w-full flex flex-col justify-between min-h-[290px] sm:min-h-[292px] max-w-[602px] rounded-2xl sm:border border-border"
      >
        <div className="pl-[16px] pr-[10px] sm:pl-[15px] sm:pr-[15px]">
          {/* Header */}
          <div className="flex h-[52px] items-center justify-between mb-[16px] sm:mb-[17px]">
            <button
              onClick={onClose}
              className="p-2 -translate-x-2 rounded-full hover:bg-hover cursor-pointer text-white"
            >
              <IoClose size={22} />
            </button>
            <span className="font-extrabold text-[14px] text-primary mr-4">
              Drafts
            <button
              suppressHydrationWarning
              disabled={isDisabled || isPending}
              onClick={PostTweet}
              className={`sm:hidden text-[14px] font-bold ml-[18px] px-[17px] pt-[5px] pb-[6px] translate-x-[9px] rounded-full ${
                isDisabled || isPending
                  ? "bg-primary/50 text-white/50 cursor-not-allowed"
                  : "bg-primary text-white cursor-pointer"
              }`}
            >
              {isPending ? "Posting..." : "Post"}
            </button>
            </span>
          </div>

          {/* Post input */}
          <div className="flex gap-[10px]">
            <Image
              src={profile?.avatar_url || "/images/default-avatar.svg"}
              alt="Your avatar"
              width={40}
              height={40}
              className="w-10 h-10 rounded-full object-cover shrink-0"
            />
            <div className="flex-1 min-w-0">
              <textarea
                value={post}
                onChange={(e) => setPost(e.target.value)}
                placeholder="What's happening?"
                suppressHydrationWarning
                rows={1}
                className="w-full py-1 text-white text-[21px] placeholder:text-secondary-text placeholder:font-normal outline-none bg-transparent resize-none field-sizing-content"
              />
              {selectedImage && (
                <div className="relative h-60 rounded-lg overflow-hidden border border-border mb-3">
                  <Image
                    src={selectedImage}
                    alt="Selected"
                    width={500}
                    height={500}
                    className="h-full w-full object-cover"
                  />
                  <button
                    className="absolute flex items-center justify-center top-2 right-2 bg-black w-8 h-8 rounded-full opacity-70 cursor-pointer hover:opacity-100"
                    onClick={() => {
                      setSelectedImage(null);
                      if (fileRef.current) fileRef.current.value = "";
                      setTweetImage(null);
                    }}
                  >
                    <RxCross2 size={18} className="text-white" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer with icons + post button */}
        <div className="relative h-[58px] sm:h-auto flex items-center justify-between  ml-2 mr-6 pl-2 mt-2 border-t border-border py-[9px]">
          <div className="absolute bottom-full left-[11px] pb-[15px] pl-1 sm:pl-[3px] flex items-center gap-1 text-primary text-[13px] font-bold cursor-pointer">
            <FaGlobeAmericas size={14} />
            <span className="text-[14px]">Everyone can reply</span>
          </div>
          <div className="flex gap-[18px] pl-1 sm:pl-[3px] translate-y-[-1px] sm:translate-y-0">
            <div
              className="text-primary cursor-pointer"
              onClick={() => fileRef.current?.click()}
            >
              <TbPhoto size={18} className="translate-y-[1px]" />
            </div>
            <div ref={gifRef} className="text-primary cursor-pointer relative">
              <div
                className="text-primary cursor-pointer"
                onClick={() => setShowGifPicker((v) => !v)}
              >
                <MdOutlineGifBox size={20} className="translate-x-[-1px]" />
              </div>
              {showGifPicker && (
                <div className="absolute z-50 top-full left-0 mt-2 w-[300px] h-[400px] bg-black border border-border rounded-xl flex flex-col shadow-2xl">
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
                          setTweetImage(null);
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
              <div
                className="w-[20px] h-[20px] translate-x-[-3px] bg-primary"
                style={{
                  WebkitMaskImage: `url(${Grok.src})`,
                  maskImage: `url(${Grok.src})`,
                  WebkitMaskSize: "contain",
                  maskSize: "contain",
                  WebkitMaskRepeat: "no-repeat",
                  maskRepeat: "no-repeat",
                }}
              />
            </div>
            <div className="text-primary cursor-pointer translate-x-[-4px]">
              <CiBoxList size={20} />
            </div>
            <div ref={emojiRef}>
              <div
                className="text-primary cursor-pointer"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              >
                <FaRegFaceSmile
                  size={17}
                  className="translate-x-[-5px] translate-y-[1px]"
                />
              </div>
              {showEmojiPicker && (
                <div className="absolute z-10 top-full left-0 w-[320px] max-w-2xl border border-border rounded-lg">
                  <EmojiPicker
                    onEmojiClick={onEmojiClick}
                    theme={Theme.DARK}
                    style={{ width: "320", background: "black" }}
                  />
                </div>
              )}
            </div>
            <div className="text-primary cursor-pointer translate-x-[-6px]">
              <RiCalendarScheduleLine size={18} />
            </div>
            <div className="text-primary cursor-pointer translate-x-[-5px]">
              <IoLocationOutline size={18} />
            </div>
            <div className="text-primary cursor-pointer translate-x-[-5px]">
              <RiFlag2Line size={19} style={{ transform: "scaleY(1.1)" }} />
            </div>
          </div>
          <button
            suppressHydrationWarning
            disabled={isDisabled || isPending}
            onClick={PostTweet}
            className={`hidden sm:block text-[15px] font-bold px-[17px] py-[6.6px] translate-x-[9px] rounded-full ${
              isDisabled || isPending
                ? "bg-secondary-background-2 border border-border text-black cursor-not-allowed opacity-50"
                : "bg-white text-black cursor-pointer"
            }`}
          >
            {isPending ? "Posting..." : "Post"}
          </button>
        </div>
        <input
          type="file"
          ref={fileRef}
          className="hidden"
          onChange={handleImageChange}
        />
      </div>
    </div>,
    document.body,
  );
}
