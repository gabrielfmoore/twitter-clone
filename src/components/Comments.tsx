import Image from "next/image";
import Link from "next/link";
import { FaRegComment, FaRegHeart, FaRegBookmark } from "react-icons/fa6";
import { FiRepeat } from "react-icons/fi";
import { IoIosStats } from "react-icons/io";
import { MdVerified } from "react-icons/md";
import { BsThreeDots } from "react-icons/bs";
import { RiShare2Line } from "react-icons/ri";
import Grok from "@/public/images/grok-icon.png";

export default function Comments() {
  return (
    <div>
      <div className="flex w-full px-4 py-3 ">
        <div className="flex flex-col w-full">
          <div className="flex w-full wrap-nowrap justify-between">
            <div className="flex">
              <Image
                src="/images/image3.jpg"
                alt="Profile"
                width={100}
                height={100}
                className="w-10 h-10 mr-2 object-cover rounded-full shrink-0"
              />
              <div className="flex justify-between gap-1 text-sm">
                <div className="flex flex-col text-[15px] cursor-pointer ">
                  <div className="flex gap-1">
                    <span className="text-white font-bold hover:underline">
                      NASA
                    </span>
                    <MdVerified className="text-secondary-text mt-[2px] w-[17px] h-[17px]" />
                  </div>
                  <span className="text-secondary-text font-light ml-[3px]">
                    @NASA
                  </span>
                </div>
              </div>
            </div>
            <div className="flex gap-[10px] mt-[2px]">
              <Image
                src={Grok}
                alt="Grok"
                width={20}
                height={20}
                className="w-[20px] h-[20px] opacity-80 grayscale cursor-pointer scale-130 translate-x-[2px] hover:opacity-100 hover:grayscale-0"
              />
              <BsThreeDots
                size={17}
                className="text-secondary-text cursor-pointer translate-y-[2px]"
              />
            </div>
          </div>
          <Link href={"/home/post/123"} className="text-white my-2 block">
            <p className="`text-[15px] font-[500] leading-[1.3]">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Incidunt
              eligendi veniam optio cumque architecto cum qui nostrum itaque ex
              obcaecati. <br />
              <br />
              Lorem ipsum <br />
              <span className="text-primary hover:underline cursor-pointer">
                www.website.com
              </span>
            </p>
          </Link>
          <div className="flex justify-between my-4 text-secondary-text">
            <div className=" flex items-center gap-1 hover:text-blue-400 cursor-pointer">
              <FaRegComment />
              <span className="text-sm">1.2K</span>
            </div>
            <div className=" flex items-center gap-1 hover:text-green-400 cursor-pointer">
              <FiRepeat />
              <span className="text-sm">203</span>
            </div>
            <div className=" flex items-center gap-1 hover:text-red-500 cursor-pointer">
              <FaRegHeart />
              <span className="text-sm">1.2K</span>
            </div>
            <div className=" flex items-center
             gap-1 hover:text-blue-500 cursor-pointer">
              <IoIosStats />
              <span className="text-sm">5K</span>
            </div>
            <div className=" flex items-center gap-4">
              <FaRegBookmark className="hover:text-blue-400 cursor-pointer" />
              <RiShare2Line
                size={20}
                className="hover:text-blue-400 cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="flex w-full px-4 py-3 ">
        <div className="flex flex-col w-full">
          <div className="flex w-full wrap-nowrap justify-between">
            <div className="flex">
              <Image
                src="/images/image3.jpg"
                alt="Profile"
                width={100}
                height={100}
                className="w-10 h-10 mr-2 object-cover rounded-full shrink-0"
              />
              <div className="flex justify-between gap-1 text-sm">
                <div className="flex flex-col text-[15px] cursor-pointer ">
                  <div className="flex gap-1">
                    <span className="text-white font-bold hover:underline">
                      NASA
                    </span>
                    <MdVerified className="text-secondary-text mt-[2px] w-[17px] h-[17px]" />
                  </div>
                  <span className="text-secondary-text font-light ml-[3px]">
                    @NASA
                  </span>
                </div>
              </div>
            </div>
            <div className="flex gap-[10px] mt-[2px]">
              <Image
                src={Grok}
                alt="Grok"
                width={20}
                height={20}
                className="w-[20px] h-[20px] opacity-80 grayscale cursor-pointer scale-130 translate-x-[2px] hover:opacity-100 hover:grayscale-0"
              />
              <BsThreeDots
                size={17}
                className="text-secondary-text cursor-pointer translate-y-[2px]"
              />
            </div>
          </div>
          <Link href={"/home/post/123"} className="text-white my-2 block">
            <p className="`text-[15px] font-[500] leading-[1.3]">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Incidunt
              eligendi veniam optio cumque architecto cum qui nostrum itaque ex
              obcaecati. <br />
              <br />
              Lorem ipsum <br />
              <span className="text-primary hover:underline cursor-pointer">
                www.website.com
              </span>
            </p>
          </Link>
          <div className="flex justify-between my-4 text-secondary-text">
            <div className=" flex items-center gap-1 hover:text-blue-400 cursor-pointer">
              <FaRegComment />
              <span className="text-sm">1.2K</span>
            </div>
            <div className=" flex items-center gap-1 hover:text-green-400 cursor-pointer">
              <FiRepeat />
              <span className="text-sm">203</span>
            </div>
            <div className=" flex items-center gap-1 hover:text-red-500 cursor-pointer">
              <FaRegHeart />
              <span className="text-sm">1.2K</span>
            </div>
            <div className=" flex items-center gap-1 hover:text-blue-500 cursor-pointer">
              <IoIosStats />
              <span className="text-sm">5K</span>
            </div>
            <div className=" flex items-center gap-4">
              <FaRegBookmark className="hover:text-blue-400 cursor-pointer" />
              <RiShare2Line
                size={20}
                className="hover:text-blue-400 cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
