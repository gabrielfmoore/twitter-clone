"use client";

import Image from "next/image";
import { MdVerified } from "react-icons/md";
import { IoClose } from "react-icons/io5";
import { TbPhoto } from "react-icons/tb";
import { FaRegFaceSmile } from "react-icons/fa6";
import { IoLocationOutline } from "react-icons/io5";
import { RiCalendarScheduleLine, RiFlag2Line } from "react-icons/ri";
import { MdOutlineGifBox } from "react-icons/md";
import { CiBoxList } from "react-icons/ci";
import Grok from "../../public/images/Grok-transparent.png";
import { Tweet } from "@/types/types";
import { useGetUser } from "@/custom-hooks/useGetUser";
import { useCreateComment } from "@/custom-hooks/useComment";
import { useEffect, useRef, useState } from "react";
import { RxCross2 } from "react-icons/rx";
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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiRef = useRef<HTMLDivElement>(null);
  const isDisabled = reply.trim() === "" && !selectedImage;
  const modalRef = useRef<HTMLDivElement>(null);
  const { mutate, isPending } = useCreateComment();

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
              onClick={handleReply}
              className={`sm:hidden text-[14px] font-bold ml-[18px] px-[17px] pt-[5px] pb-[6px] translate-x-[9px] rounded-full ${
                isDisabled || isPending
                  ? "bg-primary/50 text-white/50 cursor-not-allowed"
                  : "bg-primary text-white cursor-pointer"
              }`}
            >
              {isPending ? "Replying..." : "Reply"}
            </button>
            </span>
          </div>
          <div className="flex gap-[10px]">
            <div className="flex flex-col items-center">
              <Image
                src={tweet.profiles?.avatar_url || "/images/default-avatar.svg"}
                alt="Profile"
                width={40}
                height={40}
                className="w-10 h-10 rounded-full object-cover shrink-0"
              />
              <div className="w-[2px] flex-1 bg-border mt-1" />
            </div>
            <div className="flex-1 min-w-0 pb-4">
              <div className="flex gap-1 text-[15px]">
                <span className="text-white font-bold">{tweet.profiles?.name}</span>
                <MdVerified className="text-primary mt-[2px] w-[17px] h-[17px]" />
                <span className="text-secondary-text">@{tweet.profiles?.username}</span>
                <span className="text-secondary-text">·</span>
                <span className="text-secondary-text">{formatTweetDate(tweet.created_at)}</span>
              </div>
              {tweet.content && (
                <p className="text-white text-[15px] mt-1 leading-[1.3]">{tweet.content}</p>
              )}
              <p className="text-secondary-text text-[15px] mt-3">
                Replying to{" "}
                <span className="text-primary">@{tweet.profiles?.username}</span>
              </p>
            </div>
          </div>

          {/* Reply input */}
          <div className="flex gap-[10px] min-h-[110px] mt-4">
            <Image
              src={profile?.avatar_url || "/images/default-avatar.svg"}
              alt="Your avatar"
              width={40}
              height={40}
              className="w-10 h-10 rounded-full object-cover shrink-0"
            />
            <div className="flex-1 min-w-0">
              <textarea
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                placeholder="Post your reply"
                suppressHydrationWarning
                rows={1}
                className="w-full py-1 text-white text-[21px] placeholder:text-secondary-text placeholder:font-normal outline-none bg-transparent resize-none field-sizing-content"
              />
              {selectedImage && (
                <div className="relative mt-2 rounded-2xl overflow-hidden border border-border">
                  <Image
                    src={selectedImage}
                    alt="Selected"
                    width={500}
                    height={300}
                    className="w-full max-h-[300px] object-cover"
                  />
                  <button
                    onClick={() => {
                      setSelectedImage(null);
                      if (fileInputRef.current) fileInputRef.current.value = "";
                    }}
                    className="absolute top-2 right-2 bg-black/70 w-8 h-8 flex items-center justify-center rounded-full cursor-pointer hover:bg-black/90"
                  >
                    <RxCross2 size={18} className="text-white" />
                  </button>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) setSelectedImage(URL.createObjectURL(file));
                }}
                className="hidden"
              />
            </div>
          </div>
        </div>

        {/* Footer with icons + reply button */}
        <div className="relative h-[58px] sm:h-auto flex items-center justify-between ml-2 mr-6 pl-2 mt-2 py-[9px]">
          <div className="flex gap-[18px] pl-1 sm:pl-[3px] translate-y-[-1px] sm:translate-y-0">
            <div className="text-primary cursor-pointer" onClick={() => fileInputRef.current?.click()}>
              <TbPhoto size={18} className="translate-y-[1px]" />
            </div>
            <div className="text-primary cursor-pointer">
              <MdOutlineGifBox size={20} className="translate-x-[-1px]" />
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
            <div ref={emojiRef} className="relative">
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
                <div className="absolute z-10 bottom-full left-0 mb-2 w-[320px] border border-border rounded-lg">
                  <EmojiPicker
                    onEmojiClick={(emojiData: EmojiClickData) => setReply((prev) => prev + emojiData.emoji)}
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
            onClick={handleReply}
            className={`hidden sm:block text-[15px] font-bold px-[17px] py-[6.6px] translate-x-[9px] rounded-full ${
              isDisabled || isPending
                ? "bg-secondary-background-2 border border-border text-black cursor-not-allowed opacity-50"
                : "bg-white text-black cursor-pointer"
            }`}
          >
            {isPending ? "Replying..." : "Reply"}
          </button>
        </div>
      </div>
    </div>
  );
}
