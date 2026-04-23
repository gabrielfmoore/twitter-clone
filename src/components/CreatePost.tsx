"use client";
import { useState, useRef, useEffect, ChangeEvent } from "react";
import Image from "next/image";
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
import Link from "next/link";
import { usePostTweet } from "@/custom-hooks/useTweet";
import { FaGlobeAmericas } from "react-icons/fa";

export default function CreatePost() {
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
  const [isFocused, setIsFocused] = useState(false);
  const { mutate, isPending } = usePostTweet();

  // Handle outside click and ESC for pickers
  useEffect(() => {
    if (!showEmojiPicker && !showGifPicker) return;
    const handle = (e: MouseEvent | KeyboardEvent) => {
      if (e instanceof MouseEvent) {
        if (
          showEmojiPicker &&
          emojiRef.current &&
          !emojiRef.current.contains(e.target as Node)
        )
          setShowEmojiPicker(false);
        if (
          showGifPicker &&
          gifRef.current &&
          !gifRef.current.contains(e.target as Node)
        )
          setShowGifPicker(false);
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
    if (!post.trim() && !tweetImage) {
      return;
    }
    if (!session?.user.id) return;
    mutate(
      {
        userId: session.user.id,
        // content: post || null,
        content: post,
        tweetImage: tweetImage || null,
      },
      {
        onSuccess: () => {
          setPost(() => "");
          setSelectedImage(() => null);
          setTweetImage(() => null);
        },
        onError: (error) => {
          console.log("Failed to post tweet", error.message);
        },
      },
    );
  };

  return (
    <div
      className={`flex gap-[10px] px-4 pt-3 pb-2 border-y border-border ${isPending ? "opacity-30" : ""}`}
    >
      <Link href={`/${profile?.username || ""}`} className="shrink-0">
        <Image
          src={profile?.avatar_url || "/images/default-avatar.svg"}
          alt="Profile"
          width={500}
          height={500}
          priority
          className="w-10 h-10 mt-1 object-cover rounded-full shrink-0"
        />
      </Link>
      <div suppressHydrationWarning className="w-full">
        <textarea
          suppressHydrationWarning
          value={post}
          onChange={(e) => setPost(e.target.value)}
          onFocus={() => setIsFocused(true)}
          placeholder="What's happening?"
          rows={1}
          className="w-full py-3 -my-[2px] text-white font-bold placeholder:text-secondary-text placeholder:font-normal outline-none [@media(min-width:360px)]:text-xl tracking-[0.02em] text-white resize-none field-sizing-content"
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
                  setTweetImage(null);
                }}
              />
            </button>
          </div>
        )}
        <div
          className={`relative flex items-center h-[46px] pt-[13px] pb-2 pl-[1px] ml-[-50px] [@media(min-width:360px)]:ml-0 ${isFocused ? "border-t border-border mt-8" : ""}`}
        >
          {isFocused && (
            <div className="absolute flex flex-row items-center bottom-[calc(80%+25px)] gap-2 text-primary">
              <FaGlobeAmericas size={14} />
              <span className="text-[14px] font-extrabold">
                Everyone can reply
              </span>
            </div>
          )}
          <div className="flex gap-[18px] w-[202px] scrollbar-hidden max-w-[calc(100%-73px)] ">
            <div
              className="text-primary cursor-pointer w-[36px]"
              onClick={() => fileRef.current?.click()}
            >
              <TbPhoto size={18} className="translate-y-[1px]" />
            </div>
            <div
              ref={gifRef}
              className="text-primary cursor-pointer w-[36px] relative"
            >
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
                        <img
                          src={gif.images.fixed_height.url}
                          alt={gif.title}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="text-primary cursor-pointer w-[36px] ">
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
            <div className="hidden sm:block text-primary cursor-pointer translate-x-[-4px] w-[36px]">
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
            <div className="text-primary cursor-pointer translate-x-[-6px] w-[36px]">
              <RiCalendarScheduleLine size={18} />
            </div>
            <div className="hidden sm:block text-primary cursor-pointer translate-x-[-5px] w-[36px]">
              <IoLocationOutline size={18} />
            </div>
            <div className="text-primary cursor-pointer translate-x-[-5px] w-[36px]">
              <RiFlag2Line size={19} style={{ transform: "scaleY(1.1)" }} />
            </div>
          </div>
          <div className="absolute right-0 bg-black z-10 pl-1 ml-auto shrink-0">
            {isDisabled ? (
              <button
                suppressHydrationWarning
                className="bg-secondary-background-2 border border-border text-black text-[15px] font-bold px-[17px] py-[6.5px] mt-[2px] rounded-full translate-y-[-2px] translate-x-[1px] opacity-50"
              >
                Post
              </button>
            ) : (
              <button
                onClick={PostTweet}
                className="bg-white text-black text-[15px] font-bold px-4 py-[6.5px] rounded-full cursor-pointer"
              >
                Post
              </button>
            )}
          </div>
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
