"use client";

import { useState } from "react";
import Image from "next/image";
import MediaViewerModal from "./MediaViewerModal";

export default function TweetImage({
  tweetId,
  imageUrl,
}: {
  tweetId: string;
  imageUrl: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="cursor-pointer" onClick={() => setOpen(true)}>
        <Image
          src={imageUrl}
          alt="Post"
          width={600}
          height={400}
          className="w-full mt-2 h-auto rounded-2xl border border-border object-cover"
        />
      </div>
      {open && (
        <MediaViewerModal
          tweetId={tweetId}
          imageUrl={imageUrl}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}
