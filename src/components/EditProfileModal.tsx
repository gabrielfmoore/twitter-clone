"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { FaArrowLeft } from "react-icons/fa6";
import { IoCameraOutline } from "react-icons/io5";
import { supabase } from "@/lib/SupabaseClient";
import { resizeImage } from "@/lib/resizeImage";
import { useQueryClient } from "@tanstack/react-query";
import { profileCache } from "@/custom-hooks/useGetUser";

interface EditProfileModalProps {
  onClose: () => void;
  profile: {
    id: string;
    name: string;
    username: string;
    avatar_url: string | null;
    created_at: string;
  };
}

export default function EditProfileModal({
  onClose,
  profile,
}: EditProfileModalProps) {
  const [name, setName] = useState(profile.name || "");
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [website, setWebsite] = useState("");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const birthDate = "";

  const currentAvatar =
    avatarPreview || profile.avatar_url || "/images/default-avatar.svg";

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarPreview(URL.createObjectURL(file));
  }

  async function handleSave() {
    setSaving(true);

    const updates: Record<string, string> = {};
    if (name.trim() !== profile.name) {
      updates.name = name.trim();
    }

    // Upload avatar if changed
    let file = fileInputRef.current?.files?.[0];
    if (file) {
      file = await resizeImage(file, 400);
      const fileExt = "jpg";
      const filePath = `${profile.id}/avatar.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, { upsert: true });

      if (!uploadError) {
        const {
          data: { publicUrl },
        } = supabase.storage.from("avatars").getPublicUrl(filePath);
        updates.avatar_url = publicUrl;
      }
    }

    if (Object.keys(updates).length > 0) {
      await supabase
        .from("profiles")
        .update(updates)
        .eq("id", profile.id);

      queryClient.invalidateQueries({ queryKey: ["profile", profile.username] });
      queryClient.invalidateQueries({ queryKey: ["user"] });
      delete profileCache[profile.id];
    }

    setSaving(false);
    onClose();
  }

  const joinedFormatted = profile.created_at
    ? new Date(profile.created_at).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "";

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black sm:bg-[rgba(91,112,131,0.4)]"
      onClick={onClose}
    >
      <div
        className="bg-black w-full h-full sm:h-[650px] sm:max-h-[90vh] sm:rounded-2xl flex flex-col max-w-[600px] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header — 53px */}
        <div className="flex items-center px-4 h-[53px] shrink-0">
          <button
            onClick={onClose}
            className="w-[34px] h-[34px] flex items-center justify-center rounded-full hover:bg-hover cursor-pointer"
          >
            <FaArrowLeft size={15} className="text-white" />
          </button>
          <h2 className="text-white text-xl font-bold flex-1 ml-6">
            Edit profile
          </h2>
          <button
            onClick={handleSave}
            disabled={saving || !name.trim()}
            className="bg-white text-black font-bold text-[14px] px-4 py-[6px] rounded-full cursor-pointer hover:bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto pb-12">
          {/* Banner */}
          <div className="h-[170px] w-full overflow-hidden">
            <Image
              src="/images/brody.jpeg"
              alt="Banner"
              width={600}
              height={170}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Avatar */}
          <div className="px-4">
            <div className="relative -mt-8 w-[124px] max-w-[25vw] aspect-square">
              <Image
                src={currentAvatar}
                alt="Avatar"
                width={124}
                height={124}
                className="w-full h-full rounded-full object-cover border-4 border-black"
              />
              {/* Camera overlay */}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 cursor-pointer hover:bg-black/50"
              >
                <IoCameraOutline size={20} className="text-white" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </div>
          </div>

          {/* Fields */}
          <div className="px-4 mt-6 flex flex-col gap-4">
            {/* Name */}
            <div className="border border-border rounded px-3 pt-2 pb-1 focus-within:border-primary">
              <label className="text-secondary-text text-[13px]">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={50}
                className="block w-full bg-transparent text-white text-[17px] outline-none"
              />
            </div>

            {/* Bio */}
            <div className="border border-border rounded px-3 pt-2 pb-1 focus-within:border-primary">
              <label className="text-secondary-text text-[13px]">Bio</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                maxLength={160}
                rows={3}
                className="block w-full bg-transparent text-white text-[17px] outline-none resize-none"
                placeholder="not setup yet"
              />
            </div>

            {/* Location */}
            <div className="border border-border rounded px-3 pt-2 pb-1 focus-within:border-primary">
              <label className="text-secondary-text text-[13px]">
                Location
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                maxLength={30}
                className="block w-full bg-transparent text-white text-[17px] outline-none"
                placeholder="not setup yet"
              />
            </div>

            {/* Website */}
            <div className="border border-border rounded px-3 pt-2 pb-1 focus-within:border-primary">
              <label className="text-secondary-text text-[13px]">
                Website
              </label>
              <input
                type="text"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                maxLength={100}
                className="block w-full bg-transparent text-white text-[17px] outline-none"
                placeholder="not setup yet"
              />
            </div>

            {/* Birth date */}
            <div className="py-2">
              <p className="text-secondary-text text-[15px]">Birth date</p>
              <p className="text-white text-[15px]">
                {birthDate || joinedFormatted || "Not set"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
