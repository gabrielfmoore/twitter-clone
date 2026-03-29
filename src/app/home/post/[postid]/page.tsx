import React from "react";
import { FaArrowLeft } from "react-icons/fa6";

export default function Page() {
  return (
    <div>
      <div className="flex justify-between text-white items-center mb-3 px-4 py-2">
        <div className="flex items-center gap-10">
          <button className="cursor-pointer">
            <FaArrowLeft size={15} className="ml-[2px]"/>
          </button>
            <span className="font-bold text-xl">Post</span>
        </div>
        <button className="border border-border rounded-full px-4 py-1 cursor-pointer">Reply</button>
      </div>
    </div>
  );
}
