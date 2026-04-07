"use client";

import { useState } from "react";
import Image from "next/image";
import Grok from "../../public/images/grok-icon.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXTwitter, faApple } from "@fortawesome/free-brands-svg-icons";
import Link from "next/link";
import SignUpModal from "../components/SignUpModal";
import SignInModal from "../components/SignInModal";
import { supabase } from "../../lib/SupabaseClient";

export default function Home() {
  const [showSignUp, setShowSignUp] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false);

  async function handleGoogleSignUp() {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/home` },
    });
  }

  async function handleAppleSignUp() {
    await supabase.auth.signInWithOAuth({
      provider: "apple",
      options: { redirectTo: `${window.location.origin}/home` },
    });
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="lg:h-[744px] m-auto lg:m-0 w-auto flex flex-col lg:flex-row items-start lg:items-center justify-start lg:justify-center">
        <div className="hidden lg:flex flex-1 min-w-0 items-center justify-center p-[32px] overflow-hidden">
          <FontAwesomeIcon
            icon={faXTwitter}
            className="text-white"
            style={{
              width: "100%",
              maxWidth: 360,
              height: "100%",
              maxHeight: 360,
              outline: "none",
            }}
          />
        </div>
        <div className="lg:w-[45vw] lg:h-[587px] m-0 sm:mx-auto lg:min-w-[600px] xs:w-[600px] w-full flex justify-start">
          <div className="w-full flex flex-col items-start justify-center p-[36px]">
            <div className="lg:hidden flex items-start pb-[12px]">
              <FontAwesomeIcon
                icon={faXTwitter}
                className="text-white"
                style={{ width: 44, height: 44, outline: "none" }}
              />
            </div>
            <h2 className="text-[40px] xs:text-[70px] w-[470px] leading-[1.2] lg:w-full font-[900] text-primary-text whitespace-wrap lg:whitespace-nowrap my-[46px]">
              Happening now
            </h2>
            <h2 className="font-black text-3xl text-primary-text mt-[2px] mb-[34px]">
              Join today.
            </h2>
            <div className="flex flex-col w-[300px] text-black">
              <button
                suppressHydrationWarning
                onClick={handleGoogleSignUp}
                className="bg-white w-full h-10 mb-[16px] flex justify-center items-center gap-1 cursor-pointer hover:bg-gray-200 rounded-full"
              >
                <Image
                  src="/images/google-icon.png"
                  alt="google-icon"
                  width={470}
                  height={470}
                  className="w-6 h-6 object-cover"
                />
                <span className="text-[15px]">Sign up with Google</span>
              </button>
              <button
                suppressHydrationWarning
                onClick={handleAppleSignUp}
                className="bg-white w-full h-10 flex justify-center items-center gap-1 cursor-pointer hover:bg-gray-200 rounded-full"
              >
                <FontAwesomeIcon
                  icon={faApple}
                  className="text-black"
                  style={{ width: 24, height: 24 }}
                />
                <span className="text-[15px]">Sign up with Apple</span>
              </button>
              <div className="h-[12px] flex items-center my-[12px] gap-[8px]">
                <div className="flex-1 h-px bg-gray-600"></div>
                <span className="text-[15px] text-white">OR</span>
                <div className="flex-1 h-px bg-gray-600"></div>
              </div>
              <button
                suppressHydrationWarning
                onClick={() => setShowSignUp(true)}
                className="bg-white w-full h-10 mb-[14px] flex justify-center items-center gap-2 cursor-pointer hover:bg-gray-200 rounded-full"
              >
                <span className="font-bold text-[15px]">Create account</span>
              </button>
              <p className="text-secondary-text text-[11px] leading-[13px] ">
                By signing up, you agree to the{" "}
                <span className="text-blue-500">Terms of Service</span> and{" "}
                <span className="text-blue-500">Privacy Policy</span>, including{" "}
                <span className="text-blue-500">Cookie Use</span>.
              </p>
              <p className="mt-[58px] mb-[16px] text-white text-[17px] font-bold line-height-[12px]">
                Already have an account?
              </p>
              <div className="text-white leading-[12px] text-[15px]">
                <Link
                  href="/home"
                  onClick={(e) => {
                    e.preventDefault();
                    setShowSignIn(true);
                  }}
                  className="block w-full text-[15px] h-10 font-bold border border-solid border-gray-600 mb-[16px] text-center leading-10 cursor-pointer hover:bg-gray-900 rounded-full"
                >
                  Sign in
                </Link>
                <button suppressHydrationWarning className="w-full text-[15px] h-10 hidden lg:flex border border-solid border-gray-600 mb-[16px] justify-center items-center gap-1 cursor-pointer hover:bg-gray-900 rounded-full">
                  <Image
                    src={Grok}
                    alt="grok-icon"
                    width={24}
                    height={24}
                    className="w-7 h-7 object-cover"
                  />
                  <span className="font-bold">Get Grok</span>
                </button>
                <button suppressHydrationWarning className="w-full text-[15px] h-10 lg:hidden font-bold border border-solid border-gray-600 mb-[16px] flex justify-center items-center gap-2 cursor-pointer hover:bg-gray-900 rounded-full">
                  <FontAwesomeIcon
                    icon={faXTwitter}
                    className="text-white"
                    style={{
                      width: 24,
                      height: 24,
                      outline: "none",
                    }}
                  />
                  <span>Get the app</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <footer className="mt-auto w-full bottom-0 py-3 px-4 text-center">
        <nav className="flex flex-wrap justify-center gap-y-1 text-[11px] text-secondary-text">
          {[
            "About",
            "Download the X app",
            "Grok",
            "Help Center",
            "Terms of Service",
            "Privacy Policy",
            "Cookie Policy",
            "Accessibility",
            "Ads info",
            "Blog",
            "Careers",
            "Brand Resources",
            "Advertising",
            "Marketing",
            "X for Business",
            "Developers",
            "News",
            "Settings",
          ].map((item, i) => (
            <span key={item}>
              <a href="#">{item}</a>
              {i < 17 && <span className="mx-2">|</span>}
            </span>
          ))}
          <span className="mx-2">|</span>
          <span>© 2026 X Corp.</span>
        </nav>
      </footer>
      <SignUpModal isOpen={showSignUp} onClose={() => setShowSignUp(false)} />
      <SignInModal
        isOpen={showSignIn}
        onClose={() => setShowSignIn(false)}
        onSignUp={() => {
          setShowSignIn(false);
          setShowSignUp(true);
        }}
      />
    </div>
  );
}
