"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ProfilePageHeader({ title, showBack }) {
  const router = useRouter();

  return (
    <div className="sticky top-0 z-40 h-14 bg-[var(--bg)] border-b border-[var(--border)] flex items-center gap-4 px-4">
      {showBack && (
        <button
          onClick={() => router.back()}
          className="p-1 rounded-full hover:bg-[var(--hover)]"
        >
          <ArrowLeft size={20} />
        </button>
      )}
      <h1 className="font-bold text-lg truncate">{title}</h1>
    </div>
  );
}
