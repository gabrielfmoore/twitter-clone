"use client";

import InboxPanel from "@/src/components/InboxPanel";
import React from "react";

export default function MessagesInnerLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex w-full sm:w-[598px] md:w-[599px] lg:w-[909px] xl:w-auto min-h-screen">
      {/* Inbox sidebar — visible only at xl+ */}
      <div className="hidden xl:flex xl:flex-col xl:w-[400px] 2xl:w-[415px] border-r border-border shrink-0">
        <InboxPanel />
      </div>
      {/* Main content area */}
      <div className="w-full xl:w-[579px] 2xl:w-[771px] border-r border-border min-h-screen">
        {children}
      </div>
    </div>
  );
}
