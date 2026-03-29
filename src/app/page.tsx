import Image from "next/image";
import Grok from "../../public/images/grok-icon.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXTwitter, faApple } from "@fortawesome/free-brands-svg-icons";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <div className="min-h-screen lg:ml-0 ml-[10%] flex flex-col lg:flex-row items-start lg:items-center justify-center">
        <div className="lg:hidden flex items-start px-[36px] pt-[36px] lg:pt-[12px] pb-[12px]">
          <FontAwesomeIcon
            icon={faXTwitter}
            className="text-white"
            style={{ width: 44, height: 44, outline: "none" }}
          />
        </div>
        <div className="hidden lg:flex w-[50%] items-center justify-center px-[32px]">
          <FontAwesomeIcon
            icon={faXTwitter}
            className="text-white px-4 pb-[36px]"
            style={{
              width: "100%",
              maxWidth: 360,
              height: "100%",
              maxHeight: 360,
              outline: "none",
            }}
          />
        </div>
        <div className="w-full lg:w-[45%] lg:min-w-[500px] flex flex-col items-start justify-center pt-0 lg:pt-[24px] px-[36px]">
          <h2 className="font-bold text-[64px] font-[800] text-primary-text whitespace-wrap lg:whitespace-nowrap my-[48px]">
            Happening now
          </h2>
          <h2 className="font-bold text-3xl text-primary-text mb-[36px]">
            Join today.
          </h2>
          <div className="flex flex-col w-[300px] text-black">
            <button className="bg-white w-full h-10 mb-[16px] flex justify-center items-center gap-2 cursor-pointer hover:bg-gray-200 rounded-full">
              <Image
                src="/images/google-icon.png"
                alt="google-icon"
                width={470}
                height={470}
                className="w-6 h-6 object-cover"
              />
              <span>Sign up with Google</span>
            </button>
            <button className="bg-white w-full h-10 flex justify-center items-center gap-2 cursor-pointer hover:bg-gray-200 rounded-full">
              <FontAwesomeIcon
                icon={faApple}
                className="text-black"
                style={{ width: 24, height: 24 }}
              />
              <span>Sign up with Apple</span>
            </button>
            <div className="h-[12px] flex items-center my-[16px] gap-[8px]">
              <div className="flex-1 h-px bg-gray-600"></div>
              <span className="text-[15px] text-white">OR</span>
              <div className="flex-1 h-px bg-gray-600"></div>
            </div>
            <button className="bg-white w-full h-10 mb-[16px] flex justify-center items-center gap-2 cursor-pointer hover:bg-gray-200 rounded-full">
              <span className="font-bold">Create account</span>
            </button>
            <p className="text-white text-[11px] line-height-[12px]">
              By signing up, you agree to the{" "}
              <span className="text-blue-500">Terms of Service</span> and{" "}
              <span className="text-blue-500">Privacy Policy</span>, including{" "}
              <span className="text-blue-500">Cookie Use</span>.
            </p>
            <p className="mt-[60px] mb-[20px] text-white text-[17px] font-bold line-height-[12px]">
              Already have an account?
            </p>
            <div className="text-white">
              <Link href="/home" className="block w-full h-10 font-bold border border-solid border-white mb-[16px] text-center leading-10 cursor-pointer hover:bg-gray-900 rounded-full">
                Sign in
              </Link> 
              <button className="w-full h-10 hidden lg:flex border border-solid border-white mb-[16px] justify-center items-center gap-2 cursor-pointer hover:bg-gray-900 rounded-full">
                <Image
                  src={Grok}
                  alt="grok-icon"
                  width={24}
                  height={24}
                  className="w-8 h-8 object-cover"
                />
                <span className="font-bold">Get Grok</span>
              </button>
              <button className="w-full h-10 lg:hidden font-bold border border-solid border-white mb-[16px] flex justify-center items-center gap-2 cursor-pointer hover:bg-gray-900 rounded-full">
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
      <footer className="w-full py-4 px-4 text-center">
        <nav className="flex flex-wrap justify-center gap-y-1 text-[13px] text-secondary-text">
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
    </>
  );
}
