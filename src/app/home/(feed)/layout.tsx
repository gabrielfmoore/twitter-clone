import LeftSidebar from "@/src/components/LeftSidebar";
import RightSidebar from "@/src/components/RightSidebar";
import React from "react";

export default function FeedLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div suppressHydrationWarning className="flex sm:justify-center max-w-[100vw]">
      <LeftSidebar />
      <div className="flex-1 min-w-0 sm:flex-none sm:w-[600px] lg:w-[598px] xl:w-[599px] h-full shrink-0 min-h-screen mr-0 border-r border-border">
        {children}
        <div className="w-full h-[200px]"></div>
      </div>
      <RightSidebar />
    </div>
  );
}
