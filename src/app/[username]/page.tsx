"use client";

import { useParams } from "next/navigation";
import LeftSidebar from "@/src/components/LeftSidebar";
import RightSidebar from "@/src/components/RightSidebar";
import ProfilePage from "@/src/components/ProfilePage";
import QueryProvider from "@/providers/QueryProvider";

export default function Page() {
  const { username } = useParams<{ username: string }>();
  return (
    <QueryProvider>
      <div className="flex md:justify-center max-w-[100vw]">
        <LeftSidebar />
        <div className="flex-1 min-w-0 md:flex-none md:w-[600px] 2xl:w-[600px] shrink-0 min-h-screen lg:mr-0 md:mr-0 mr-0 border-x border-border">
          <ProfilePage username={username} />
        </div>
        <RightSidebar />
      </div>
    </QueryProvider>
  );
}
