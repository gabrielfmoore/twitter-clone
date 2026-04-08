import Image from "next/image";
import { BsThreeDots } from "react-icons/bs";
import { MdVerified } from "react-icons/md";
import Grok from "../../public/images/Grok-transparent.png";
import Link from "next/link";
import { FaRegComment, FaRegHeart } from "react-icons/fa6";
import { FiRepeat } from "react-icons/fi";
import { IoIosStats } from "react-icons/io";
import { FaRegBookmark } from "react-icons/fa";
import { RiShare2Line } from "react-icons/ri";

export default function Posts() {
  return (
    <div>
      <div className="flex h-[49px] w-full justify-center items-center text-[15px] font-[500  ] text-primary border-b border-border">
        Show 70 posts
      </div>
      <div className="flex flex-col gap-3">
        <div className="flex w-full px-4 py-3  border-b border-border">
          <Image
            src="/images/image3.jpg"
            alt="Profile"
            width={100}
            height={100}
            className="w-10 h-10 mr-2 object-cover rounded-full shrink-0"
          />
          <div className="flex flex-col w-full min-w-0">
            <div className="w-full wrap-nowrap justify-between flex ">
              <div className="flex justify-between gap-1 text-sm">
                <div className="flex gap-[2px] text-[15px] cursor-pointer ">
                  <span className="text-white font-bold hover:underline">
                    NASA
                  </span>
                  <MdVerified className="text-primary mt-[2px] w-[17px] h-[17px]" />
                  <span className="text-secondary-text font-light ml-[3px]">
                    @NASA
                  </span>
                  <span className="text-secondary-text font-light ml-[2px]">
                    ·
                  </span>
                  <p className="text-secondary-text hover:underline">4h</p>
                </div>
              </div>
              <div className="flex gap-[10px]  mt-[2px]">
                <Image
                  src={Grok}
                  alt="Grok"
                  width={20}
                  height={20}
                  className="[@media(max-width:480px)]:hidden w-[20px] h-[20px] opacity-80 grayscale cursor-pointer hover:opacity-100 hover:grayscale-0"
                />
                <BsThreeDots
                  size={17}
                  className="text-secondary-text cursor-pointer"
                />
              </div>
            </div>
            <Link href={"/home/post/123"} className="text-white my-2 block">
              <p className="`text-[15px] font-[500] leading-[1.3]">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Incidunt eligendi veniam optio cumque architecto cum qui nostrum
                itaque ex obcaecati. <br />
                <br />
                Lorem ipsum <br />
                <span className="text-primary hover:underline cursor-pointer">
                  www.website.com
                </span>
              </p>
            </Link>
            <Link href=   "/home/post/125" className="block">
              <Image
                src="/images/brody.jpeg"
                alt="Post"
                width={500}
                height={500}
                className="w-full h-auto rounded-lg border border-border object-cover"
              />
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
        <div className="flex w-full px-4 py-3  border-b border-border">
          <Image
            src="/images/image3.jpg"
            alt="Profile"
            width={100}
            height={100}
            className="w-10 h-10 mr-2 object-cover rounded-full shrink-0"
          />
          <div className="flex flex-col w-full min-w-0">
            <div className="w-full wrap-nowrap justify-between flex ">
              <div className="flex justify-between gap-1 text-sm">
                <div className="flex gap-[2px] text-[15px] cursor-pointer ">
                  <span className="text-white font-bold hover:underline">
                    NASA
                  </span>
                  <MdVerified className="text-primary mt-[2px] w-[17px] h-[17px]" />
                  <span className="text-secondary-text font-light ml-[3px]">
                    @NASA
                  </span>
                  <span className="text-secondary-text font-light ml-[2px]">
                    ·
                  </span>
                  <p className="text-secondary-text hover:underline">4h</p>
                </div>
              </div>
              <div className="flex gap-[10px]  mt-[2px]">
                <Image
                  src={Grok}
                  alt="Grok"
                  width={20}
                  height={20}
                  className="[@media(max-width:480px)]:hidden w-[20px] h-[20px] opacity-80 grayscale cursor-pointer hover:opacity-100 hover:grayscale-0"
                />
                <BsThreeDots
                  size={17}
                  className="text-secondary-text cursor-pointer"
                />
              </div>
            </div>
            <Link href={"#"} className="text-white my-2 block">
              <p className="`text-[15px] font-[500] leading-[1.3]">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Incidunt eligendi veniam optio cumque architecto cum qui nostrum
                itaque ex obcaecati. <br />
                <br />
                Lorem ipsum <br />
                <span className="text-primary hover:underline cursor-pointer">
                  www.website.com
                </span>
              </p>
            </Link>
            <Link href="#" className="block">
              <Image
                src="/images/brody.jpeg"
                alt="Post"
                width={500}
                height={500}
                className="w-full h-auto rounded-lg border border-border object-cover"
              />
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
    </div>
  );
}
