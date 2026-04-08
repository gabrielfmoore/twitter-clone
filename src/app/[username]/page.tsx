import LeftSidebar from "@/src/components/LeftSidebar";
import RightSidebar from "@/src/components/RightSidebar";
import ProfilePage from "@/src/components/ProfilePage";

export default function Page() {
  return (
    <div className="flex md:justify-center max-w-[100vw]">
      <LeftSidebar />
      <div className="flex-1 min-w-0 md:flex-none md:w-[600px] lg:w-[598px] shrink-0 min-h-screen lg:mr-0 md:mr-0 mr-0 border-x border-border">
        <ProfilePage />
      </div>
      <RightSidebar />
    </div>
  );
}
