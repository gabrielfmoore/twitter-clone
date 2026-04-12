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

export default function ReplyPost({ tweetId }: { tweetId: string }) {
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

  useEffect(() => {
    if (!showEmojiPicker) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (emojiRef.current && !emojiRef.current.contains(e.target as Node)) {
        setShowEmojiPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showEmojiPicker]);

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
    if (!reply.trim()) return;
    if (!userId) return;
    mutate({
      userId,
      tweetId,
      content: reply,
    
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
      <div className="w-full">
        <input
          value={reply}
          onChange={(e) => setReply(e.target.value)}
          onFocus={() => setIsFocused(true)}
          placeholder="Post your reply"
          suppressHydrationWarning
          className="w-full py-3 -my-[2px] text-white font-bold placeholder:text-secondary-text placeholder:font-normal outline-none text-xl tracking-[0.02em] text-white resize-none"
        ></input>
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
          className={`${isFocused ? "block" : "hidden"} relative flex justify-between pt-[13px] pl-[1px] items-center`}
        >
          <div className="flex gap-[18px] ">
            <div
              className="text-primary cursor-pointer"
              onClick={() => fileRef.current?.click()}
            >
              <TbPhoto size={18} className="translate-y-[1px]" />
            </div>
            <div className="text-primary cursor-pointer">
              <MdOutlineGifBox size={20} className="translate-x-[-1px]" />
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
              className="bg-secondary-background-2 border border-border text-black text-[15px] font-bold px-[17px] py-[6px] mt-[2px] rounded-full cursor-not-allowed translate-y-[-2px] translate-x-[1px] opacity-50"
            >
              Reply
            </button>
          ) : (
            <button
                onClick={PostComment}
              suppressHydrationWarning
              className="bg-white text-black text-[15px] font-bold px-4 py-[5px] rounded-full cursor-pointer"
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
