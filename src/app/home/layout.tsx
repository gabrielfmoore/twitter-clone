import QueryProvider from "@/providers/QueryProvider";

import LeftSidebar from "@/src/components/LeftSidebar";
import RightSidebar from "@/src/components/RightSidebar";
import React from "react";

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <QueryProvider>
        <div suppressHydrationWarning className="flex md:justify-center max-w-[100vw]">
          <LeftSidebar />
          <div className="flex-1 min-w-0 md:flex-none md:w-[600px] 2xl:w-[600px] h-full shrink-0 min-h-screen lg:mr-0 md:mr-0 mr-0 border-x border-border">
            {children}
            <div className="w-full h-[200px]"></div>
          </div>
          <RightSidebar />
        </div>
      </QueryProvider>
    </>
  );
}
