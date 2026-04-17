"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXTwitter } from "@fortawesome/free-brands-svg-icons";
import { IoCameraOutline, IoNotificationsOutline, IoClose } from "react-icons/io5";
import { FaPlus } from "react-icons/fa6";
import { supabase } from "../../lib/SupabaseClient";

interface ProfileSetupModalProps {
  isOpen: boolean;
}

export default function ProfileSetupModal({ isOpen }: ProfileSetupModalProps) {
  const [step, setStep] = useState<"avatar" | "username" | "notifications">("avatar");
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [username, setUsername] = useState("");
  const [savingUsername, setSavingUsername] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreview(url);
  }

  async function handleUpload() {
    const file = fileInputRef.current?.files?.[0];
    if (!file) return;

    setUploading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setUploading(false);
      router.replace("/home");
      return;
    }

    const fileExt = file.name.split(".").pop();
    const filePath = `${user.id}/avatar.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      console.error("Avatar upload failed:", uploadError.message);
    } else {
      const {
        data: { publicUrl },
      } = supabase.storage.from("avatars").getPublicUrl(filePath);

      // Save avatar URL to the profiles table
      await supabase
        .from("profiles")
        .update({ avatar_url: publicUrl })
        .eq("id", user.id);
    }

    setUploading(false);
    setStep("username");
  }

  async function handleSaveUsername() {
    if (!username.trim()) return;

    setSavingUsername(true);

    // Get current user to update their profile row
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      await supabase
        .from("profiles")
        .update({ username: username.trim() })
        .eq("id", user.id);
    }

    setSavingUsername(false);
    setStep("notifications");
  }

  async function finishSetup() {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      await supabase
        .from("profiles")
        .update({ setup_complete: true })
        .eq("id", user.id);
    }
    router.replace("/home");
  }

  function handleSkip() {
    if (step === "avatar") {
      // Set avatar to default if skipped
      (async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await supabase
            .from("profiles")
            .update({ avatar_url: "/images/default-avatar.svg" })
            .eq("id", user.id);
        }
      })();
      setStep("username");
    } else {
      finishSetup();
    }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(91,112,131,0.4)]">
      <div className="bg-black w-full h-full sm:w-[600px] sm:h-[620px] sm:rounded-2xl flex flex-col relative overflow-y-auto">
        {step !== "notifications" && (
          <div className="flex items-center px-2 h-[53px] shrink-0">
            <div className="w-[34px]" />
            <div className="flex-1 flex justify-center">
              <FontAwesomeIcon
                icon={faXTwitter}
                className="text-white"
                style={{ width: 28, height: 28 }}
              />
            </div>
            <div className="w-[34px]" />
          </div>
        )}

        <div className="flex-1 flex flex-col items-center px-[20px] sm:px-[80px] py-[40px]">
          {step === "avatar" && (
            <>
              <h1 className="text-white text-[40px] font-bold mb-[2px] self-start">
                Pick a profile picture
              </h1>
              <p className="text-secondary-text text-[15px] mb-[24px] self-start">
                Have a favorite selfie? Upload it now.
              </p>

              <div className="relative mb-[32px]">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="relative w-[192px] h-[192px] rounded-full border-2 border-[#333] flex items-center justify-center cursor-pointer hover:bg-[rgba(255,255,255,0.03)] transition-colors group overflow-hidden"
                >
                  {preview ? (
                    <img
                      src={preview}
                      alt="Preview"
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <svg
                      viewBox="0 0 24 24"
                      className="w-[120px] h-[120px] text-[#333]"
                      fill="currentColor"
                    >
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
                    </svg>
                  )}

                  <div className="absolute inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.4)] rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="relative">
                      <IoCameraOutline className="text-white text-[28px]" />
                      <FaPlus className="absolute -top-1 -right-2 text-white text-[10px]" />
                    </div>
                  </div>
                </button>

                {preview && (
                  <button
                    onClick={() => {
                      setPreview(null);
                      if (fileInputRef.current) fileInputRef.current.value = "";
                    }}
                    className="absolute -top-1 -right-1 w-[28px] h-[28px] bg-black border border-[#333] rounded-full flex items-center justify-center cursor-pointer hover:bg-[rgba(255,255,255,0.1)]"
                  >
                    <IoClose className="text-white text-[16px]" />
                  </button>
                )}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />

              {preview && (
                <button
                  onClick={handleUpload}
                  disabled={uploading}
                  className="w-[300px] h-[52px] bg-white text-black font-bold text-[17px] rounded-full cursor-pointer hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed mb-[12px]"
                >
                  {uploading ? "Uploading..." : "Next"}
                </button>
              )}
            </>
          )}

          {step === "username" && (
            <>
              <h1 className="text-white text-[40px] font-bold leading-[1.1] mb-[2px] self-start">
                What should we call you?
              </h1>
              <p className="text-secondary-text text-[15px] mb-[32px] self-start">
                Your @username is unique. You can always change it later.
              </p>

              <div className="relative w-full mb-[24px]">
                <input
                  type="text"
                  name="username"
                  autoComplete="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder=" "
                  className="peer w-full h-[56px] bg-black border border-[#333] rounded-[4px] pl-[32px] pr-[12px] pt-[22px] pb-[6px] text-white text-[17px] outline-none focus:border-primary"
                />
                <label className={`absolute left-[12px] text-primary text-[17px] transition-all pointer-events-none peer-focus:top-[6px] peer-focus:text-[13px] peer-not-placeholder-shown:top-[6px] peer-not-placeholder-shown:text-[13px] ${username ? "top-[6px] text-[13px]" : "top-[16px]"}`}>
                  Username
                </label>
                <span className="absolute left-[12px] bottom-[10px] text-primary text-[17px] pointer-events-none peer-placeholder-shown:opacity-0 peer-focus:opacity-100 opacity-100 transition-opacity">
                  @
                </span>
              </div>

              {username.trim() && (
                <button
                  onClick={handleSaveUsername}
                  disabled={savingUsername}
                  className="w-full h-[52px] bg-white text-black font-bold text-[17px] rounded-full cursor-pointer hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed mb-[12px]"
                >
                  {savingUsername ? "Saving..." : "Next"}
                </button>
              )}
            </>
          )}

          {step === "notifications" && (
            <div className="flex-1 flex flex-col items-center justify-center p-[40px] sm:p-[40px]">
              <IoNotificationsOutline className="text-primary mb-[16px]" style={{ width: 100, height: 100 }} />
              <h1 className="text-white text-[36px] leading-[1.1] font-bold mb-[8px] text-center">
                Turn on notifications
              </h1>
              <p className="text-secondary-text text-[15px] px-[20px] mb-[32px] text-center">
                Get the most out of X by staying up to date with what&apos;s
                happening.
              </p>

              <button className="w-full h-[52px] bg-white text-black font-bold text-[17px] rounded-full cursor-not-allowed mb-[12px]">
                Allow notifications
              </button>
              <button
                onClick={handleSkip}
                className="w-full h-[52px] border border-gray-600 text-white font-bold text-[17px] rounded-full cursor-pointer hover:bg-gray-900"
              >
                Skip for now
              </button>
            </div>
          )}
        </div>

        {step === "avatar" && (
          <div className="px-[80px] pb-[24px] shrink-0">
            <button
              onClick={handleSkip}
              className="w-full h-[52px] border border-gray-600 text-white font-bold text-[17px] rounded-full cursor-pointer hover:bg-gray-900"
            >
              Skip for now
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
