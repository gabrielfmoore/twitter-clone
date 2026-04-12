"use client";

import { useEffect, useRef } from "react";

interface DeleteConfirmModalProps {
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting: boolean;
}

export default function DeleteConfirmModal({
  onConfirm,
  onCancel,
  isDeleting,
}: DeleteConfirmModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[#5b708366]">
      <div
        ref={modalRef}
        className="w-[320px] max-w-[80vw] bg-black rounded-3xl p-8 flex flex-col  "
      >
        <h2 className="text-white text-xl font-bold ">Delete post?</h2>
        <p className="text-secondary-text text-[15px] mt-2 leading-[1.3]">
          This can&apos;t be undone and it will be removed from your profile,
          the timeline of any accounts that follow you, and from search results.
        </p>
        <button
          onClick={onConfirm}
          disabled={isDeleting}
          className="mt-6 w-full py-3 rounded-full bg-red-600 text-white text-[15px] font-bold cursor-pointer hover:bg-red-700 disabled:opacity-50"
        >
          {isDeleting ? "Deleting..." : "Delete"}
        </button>
        <button
          onClick={onCancel}
          className="mt-3 w-full py-3 rounded-full bg-transparent border border-border text-white text-[15px] font-bold cursor-pointer hover:bg-hover"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
