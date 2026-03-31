"use client";
import React, { useState, useRef, useEffect, ChangeEvent } from "react";
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




export default function CreatePost() {
  const [post, setPost] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const isDisabled = post.trim() === "" && !selectedImage;
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiRef = useRef<HTMLDivElement | null>(null);
  const [isFocused, setIsFocused] = useState(false);

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
    setPost((prev) => prev + emojiData.emoji);
  };

  return (
    <div className="flex gap-[10px] px-4 pt-3 pb-2 border-y border-border">
      <Image
        src="/images/profile.jpg"
        alt="Profile"
        width={500}
        height={500}
        className="w-10 h-10 mt-1 object-cover rounded-full shrink-0"
      />
      <div className="w-full">
        <input
          value={post}
          onChange={(e) => setPost(e.target.value)}
          onFocus={() => setIsFocused(true)}
          placeholder="What's happening?"
          id=""
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
          className={`relative flex justify-between pt-[13px] pl-[1px] items-center ${isFocused ? "border-t border-border mt-8" : ""}`}
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
              <Image src={Grok} alt="Grok" width={20} height={20} className="translate-x-[-3px]" />
            </div>
            <div className="hidden sm:block text-primary cursor-pointer translate-x-[-4px]">
              <CiBoxList size={20} />
            </div>
            <div ref={emojiRef}>
              <div
                className="text-primary cursor-pointer"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              >
                <FaRegFaceSmile size={17} className="translate-x-[-5px] translate-y-[1px]" />
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
            <div className="hidden sm:block text-primary cursor-pointer translate-x-[-5px]">
              <IoLocationOutline size={18} />
            </div>
            <div className="text-primary cursor-pointer translate-x-[-5px]">
              <RiFlag2Line size={19} style={{ transform: "scaleY(1.1)" }} />
            </div>
          </div>
          {isDisabled ? (
            <button className="bg-secondary-background-2 border border-border text-black text-[15px] font-bold px-[17px] py-[6px] mt-[2px] rounded-full cursor-not-allowed translate-y-[-2px] translate-x-[1px] opacity-50">
              Post
            </button>
          ) : (
            <button className="bg-white text-black text-[15px] font-bold px-4 py-[5px] rounded-full cursor-pointer">
              Post
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
