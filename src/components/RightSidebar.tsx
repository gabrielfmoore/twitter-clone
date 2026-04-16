import { IoSearch } from "react-icons/io5";
import Image from "next/image";
import { RxCross2 } from "react-icons/rx";

export default function RightSidebar() {
  return (
    <aside className=" top-0 lg:w-[310px] xl:w-[390px] pl-[20px] xl:pl-[30px] lg:mr-[10px] shrink-0 h-screen hidden lg:block">
      <div className="flex flex-col w-full xl:w-[350px]">
        <div suppressHydrationWarning className="sticky top-0 z-10 bg-black/65 backdrop-blur-md text-secondary-text flex items-center gap-[4px] border border-border px-[12px] py-[11px] mt-[5px] rounded-full">
          <IoSearch size={18} className="text-thin text-gray-500" />
          <input
            type="text"
            placeholder="Search"
            suppressHydrationWarning
            className="border-none outline-none text-white w-full text-sm bg-transparent"
          />
        </div>
        <div className="border border-border px-5 pt-[14px] pb-[16px] text-white mt-[16px] rounded-2xl">
          <div className="flex items-center gap-[10px] mt-[2px] mb-[10px] leading-0.5">
            <h3 className="font-extrabold text-xl  leading-[1.2]">Subscribe to Premium</h3>
            <div className="text-sm/[1.4] tracking-[-0.027em] font-[600] rounded-md whitespace-nowrap text-green-300 bg-[#00472e] px-[7px] py-[2px]">
              50% off
            </div>
          </div>
          <p className="text-[15px] tracking-[-0.01em] font-[500] leading-[1.3]">
            Get rid of ads, see your analytics, boost your replies and unlock
            20+ features.
          </p>
          <button suppressHydrationWarning className="bg-primary text-[15px] tracking-[-0.035em] text-white mt-[19px] px-[17px] py-[6px] pb-[7px] rounded-full font-black cursor-pointer">
            Subscribe
          </button>
        </div>
        <div className="border border-border h-[364px] flex flex-col justify-between px-4 py-3 text-[20px] text-white font-black mt-4 rounded-2xl">
          <div className="flex justify-between items-center">
            <h3 className="flex flex-row justify-between tracking-[-0.01em]">Today&apos;s News</h3>
            <RxCross2 size={18} className="text-white mr-[7px] mt-[2px]" />
          </div>
        </div>
        <div className="border border-border h-[306px] flex flex-col justify-between px-4 py-3 text-[20px]/[1.3] text-white font-black mt-4 rounded-2xl">
          <div className="flex justify-between items-center">
            <h3 className="flex flex-row justify-between tracking-[-0.01em]">What&apos;s happening</h3>
          </div>
        </div>
        <div className="border border-border p-4 text-white mt-4 rounded-2xl">
          <h3 className="flex justify-between mb-4 font-bold text-2xl">
            Who to follow
          </h3>
          <div className="flex justify-between items-center mb-6">
            <div className="flex gap-2 items-center">
              <Image
                src="/images/image1.jpg"
                alt="Profile"
                width={800}
                height={800}
                className="w-10 h-10 object-cover rounded-full"
              />
              <div>
                <p className="font-bold">Gabriel Moore</p>
                <p className="text-secondary-text text-sm font-light">
                  @GabrielMoore
                </p>
              </div>
            </div>
            <button suppressHydrationWarning className="bg-white text-black text-sm px-4 h-[36px] border rounded-full border font-bold cursor-pointer">
              Follow
            </button>
          </div>
          <div className="flex justify-between items-center mb-6">
            <div className="flex gap-2 items-center">
              <Image
                src="/images/image2.jpg"
                alt="Profile"
                width={800}
                height={800}
                className="w-10 h-10 object-cover rounded-full"
              />
              <div>
                <p className="font-bold">Gabriel Moore</p>
                <p className="text-secondary-text text-sm font-light">
                  @GabrielMoore
                </p>
              </div>
            </div>
            <button suppressHydrationWarning className="bg-white text-black text-sm px-4 h-[36px] border rounded-full border font-bold cursor-pointer">
              Follow
            </button>
          </div>
          <div className="flex justify-between items-center mb-6">
            <div className="flex gap-2 items-center">
              <Image
                src="/images/image3.jpg"
                alt="Profile"
                width={800}
                height={800}
                className="w-10 h-10 object-cover rounded-full"
              />
              <div>
                <p className="font-bold">Gabriel Moore</p>
                <p className="text-secondary-text text-sm font-light">
                  @GabrielMoore
                </p>
              </div>
            </div>
            <button suppressHydrationWarning className="bg-white text-black text-sm px-4 h-[36px] border rounded-full border font-bold cursor-pointer">
              Follow
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
