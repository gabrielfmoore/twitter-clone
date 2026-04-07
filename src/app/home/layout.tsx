import LeftSidebar from "@/src/components/LeftSidebar";
import RightSidebar from "@/src/components/RightSidebar";
import React, { Children } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="flex md:justify-center max-w-[100vw]">
        <LeftSidebar />
        <div className="flex-1 min-w-0 md:flex-none md:w-[600px] lg:w-[598px] shrink-0 min-h-screen lg:mr-0 md:mr-[61px] mr-0 border-x border-border">
          {children}
        </div>
        <RightSidebar />
      </div>
    </>
  );
}
