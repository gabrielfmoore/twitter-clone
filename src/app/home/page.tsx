"use client";

import CreatePost from "@/src/components/CreatePost";
import Posts from "@/src/components/Posts";
import { useState } from "react";

export default function Page() {
  const tabs = ["For you", "Following"];
  const [activeTab, setActiveTab] = useState("For you");

  return (
    <div className="flex flex-col lg:border-none border-r border-border min-h-screen">
      <div className="h-[53px] w-full text-[15px] grid grid-cols-2 text-white pr-1">
        {tabs.map((tab) => (
          <button
            suppressHydrationWarning
            key={tab}
            onClick={() => setActiveTab(tab)}
            className="flex items-center justify-center cursor-pointer hover:bg-hover"
          >
            <div className="relative h-full flex items-center">
              <span
                className={
                  activeTab === tab
                    ? "font-bold"
                    : "text-secondary-text font-[500]"
                }
              >
                {tab}
              </span>
              {activeTab === tab && (
                <div className="absolute h-1 w-full bg-primary bottom-0 rounded-full" />
              )}
            </div>
          </button>
        ))}
      </div>
      <CreatePost />
      <Posts />
    </div>
  );
}