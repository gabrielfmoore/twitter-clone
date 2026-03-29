import CreatePost from "@/src/components/CreatePost";
import Posts from "@/src/components/Posts";

export default function Page() {
  return (
    <div className="flex flex-col lg:border-none border-r border-border min-h-screen">
      <div className="h-[53px] w-full text-[15px] grid grid-cols-2 text-white pr-1">
        <button className="flex items-center justify-center cursor-pointer pr-1 font-bold hover:bg-hover">
          <div className="relative h-full flex items-center hover:bg-hover">
            For you
            <div className="absolute h-1 w-full bg-primary bottom-0 rounded-full"></div>
          </div>
        </button>
        <button className="flex items-center text-secondary-text justify-center cursor-pointer font-[500] hover:bg-hover">
          <div className="relative h-full flex items-center hover:bg-hover">
            Following
            <div className="absolute hidden h-1 w-full bg-primary bottom-0 rounded-full"></div>
          </div>
        </button>
      </div>
      <CreatePost />
      <Posts />
    </div>
  );
}
