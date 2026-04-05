"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXTwitter, faApple } from "@fortawesome/free-brands-svg-icons";
import { IoClose } from "react-icons/io5";
import Link from "next/link";
import { supabase } from "../../lib/SupabaseClient";

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSignUp: () => void;
}

export default function SignInModal({
  isOpen,
  onClose,
  onSignUp,
}: SignInModalProps) {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [step, setStep] = useState<"identifier" | "password">("identifier");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleGoogleSignIn() {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/home` },
    });
  }

  async function handleAppleSignIn() {
    await supabase.auth.signInWithOAuth({
      provider: "apple",
      options: { redirectTo: `${window.location.origin}/home` },
    });
  }

  async function handleNext() {
    if (step === "identifier") {
      if (!identifier.trim()) return;
      setError("");
      setStep("password");
      return;
    }

    if (step === "password") {
      if (password.length < 6) {
        setError("Password must be at least 6 characters.");
        return;
      }

      setLoading(true);
      setError("");

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: identifier.trim(),
        password,
      });

      setLoading(false);

      if (signInError) {
        setError(signInError.message);
        return;
      }

      onClose();
      router.replace("/home");
    }
  }

  function handleClose() {
    setStep("identifier");
    setIdentifier("");
    setPassword("");
    setError("");
    onClose();
  }

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(91,112,131,0.4)]"
      onClick={handleClose}
    >
      <div
        className="bg-black w-full h-full sm:w-[600px] sm:h-auto sm:min-h-[400px] sm:max-h-[90vh] sm:rounded-2xl flex flex-col relative overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center px-2 h-[53px] shrink-0">
          <button
            onClick={handleClose}
            className="w-[34px] h-[34px] flex items-center justify-center rounded-full hover:bg-hover cursor-pointer"
          >
            <IoClose className="text-white text-[24px]" />
          </button>
          <div className="flex-1 flex justify-center">
            <FontAwesomeIcon
              icon={faXTwitter}
              className="text-white"
              style={{ width: 28, height: 28 }}
            />
          </div>
          <div className="w-[34px]" />
        </div>

        <div className="flex-1 flex flex-col items-center px-[80px] pt-[20px] pb-[24px]">
          {step === "identifier" && (
            <>
              <h1 className="text-white text-[31px] font-bold mb-[28px] self-start">
                Sign in to X
              </h1>

              <button
                onClick={handleGoogleSignIn}
                className="bg-white w-[300px] h-10 mb-[12px] flex justify-center items-center gap-1 cursor-pointer hover:bg-gray-200 rounded-full"
              >
                <Image
                  src="/images/google-icon.png"
                  alt="google-icon"
                  width={470}
                  height={470}
                  className="w-6 h-6 object-cover"
                />
                <span className="text-[15px] text-black">
                  Sign in with Google
                </span>
              </button>

              <button
                onClick={handleAppleSignIn}
                className="bg-white w-[300px] h-10 mb-[12px] flex justify-center items-center gap-1 cursor-pointer hover:bg-gray-200 rounded-full"
              >
                <FontAwesomeIcon
                  icon={faApple}
                  className="text-black"
                  style={{ width: 24, height: 24 }}
                />
                <span className="text-[15px] text-black">
                  Sign in with Apple
                </span>
              </button>

              <div className="w-[300px] h-[12px] flex items-center my-[12px] gap-[8px]">
                <div className="flex-1 h-px bg-gray-600"></div>
                <span className="text-[15px] text-white">or</span>
                <div className="flex-1 h-px bg-gray-600"></div>
              </div>

              <div className="relative w-[300px] mb-[24px]">
                <input
                  type="text"
                  name="identifier"
                  autoComplete="username"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder=" "
                  className="peer w-full h-[56px] bg-black border border-[#333] rounded-[4px] px-[12px] pt-[22px] pb-[6px] text-white text-[17px] outline-none focus:border-primary"
                />
                <label className="absolute left-[12px] top-[16px] text-secondary-text text-[17px] transition-all pointer-events-none peer-focus:top-[6px] peer-focus:text-[13px] peer-focus:text-primary peer-not-placeholder-shown:top-[6px] peer-not-placeholder-shown:text-[13px]">
                  Phone, email, or username
                </label>
              </div>

              <button
                onClick={handleNext}
                disabled={!identifier.trim()}
                className="w-[300px] h-[40px] bg-white text-black font-bold text-[15px] rounded-full cursor-pointer hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed mb-[20px]"
              >
                Next
              </button>

              <button className="w-[300px] h-[40px] border border-gray-600 text-white font-bold text-[15px] rounded-full cursor-pointer hover:bg-gray-900">
                Forgot password?
              </button>

              {error && (
                <p className="text-red-500 text-[14px] mt-[12px]">{error}</p>
              )}

              <p className="mt-[40px] text-secondary-text text-[15px]">
                Don&apos;t have an account?{" "}
                <button
                  onClick={() => {
                    handleClose();
                    onSignUp();
                  }}
                  className="text-primary hover:underline cursor-pointer"
                >
                  Sign up
                </button>
              </p>

              <Link
                href="/home"
                className="mt-[12px] text-secondary-text text-[13px] hover:underline"
              >
                Skip to home
              </Link>
            </>
          )}

          {step === "password" && (
            <>
              <h1 className="text-white text-[31px] font-bold mb-[28px] self-start">
                Enter your password
              </h1>

              <div className="relative w-[300px] mb-[12px]">
                <input
                  type="text"
                  value={identifier}
                  disabled
                  className="w-full h-[56px] bg-black border border-[#333] rounded-[4px] px-[12px] pt-[22px] pb-[6px] text-secondary-text text-[17px] outline-none opacity-60"
                />
                <label className="absolute left-[12px] top-[6px] text-secondary-text text-[13px] pointer-events-none">
                  Phone, email, or username
                </label>
              </div>

              <div className="relative w-[300px] mb-[24px]">
                <input
                  type="password"
                  name="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder=" "
                  className="peer w-full h-[56px] bg-black border border-[#333] rounded-[4px] px-[12px] pt-[22px] pb-[6px] text-white text-[17px] outline-none focus:border-primary"
                />
                <label className="absolute left-[12px] top-[16px] text-secondary-text text-[17px] transition-all pointer-events-none peer-focus:top-[6px] peer-focus:text-[13px] peer-focus:text-primary peer-not-placeholder-shown:top-[6px] peer-not-placeholder-shown:text-[13px]">
                  Password
                </label>
              </div>

              {error && (
                <p className="text-red-500 text-[14px] mb-[12px]">{error}</p>
              )}

              <button
                onClick={handleNext}
                disabled={loading || password.length < 6}
                className="w-[300px] h-[52px] bg-white text-black font-bold text-[17px] rounded-full cursor-pointer hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Signing in..." : "Log in"}
              </button>

              <p className="mt-[20px] text-secondary-text text-[15px]">
                Don&apos;t have an account?{" "}
                <button
                  onClick={() => {
                    handleClose();
                    onSignUp();
                  }}
                  className="text-primary hover:underline cursor-pointer"
                >
                  Sign up
                </button>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
