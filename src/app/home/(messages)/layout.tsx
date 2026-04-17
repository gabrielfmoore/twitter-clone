import LeftSidebar from "@/src/components/LeftSidebar";
import React from "react";

export default function MessagesLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div suppressHydrationWarning className="flex justify-center max-w-[100vw]">
      <LeftSidebar collapsed />
      <div className="flex-1 sm:flex-none min-w-0 min-h-screen">
        {children}
      </div>
    </div>
  );
}
