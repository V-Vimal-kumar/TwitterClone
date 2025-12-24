"use client";

import { LogOut, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

export default function ProfileMenu({ open, onClose, buttonRef }) {
  const router = useRouter();
  const menuRef = useRef(null);

  useEffect(() => {
    function handlePointerDown(e) {
      const clickedMenu = menuRef.current?.contains(e.target);
      const clickedButton = buttonRef?.current?.contains(e.target);

      if (!clickedMenu && !clickedButton) {
        onClose();
      }
    }

    if (open) {
      document.addEventListener("pointerdown", handlePointerDown);
    }

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [open, onClose, buttonRef]);

  if (!open) return null;

  return (
    <div
      ref={menuRef}
      className="
        absolute z-50 w-48 rounded-xl border border-[var(--border)]
        bg-[var(--bg)] shadow-xl overflow-hidden

        /* 📱 Mobile */
        bottom-14 right-0

        /* 📲 Tablet */
        md:bottom-auto md:top-1/2 md:left-full md:right-auto md:ml-3 md:-translate-y-1/2
      "
    >
      <button
        onClick={() => {
          router.push("/profile");
          onClose();
        }}
        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[var(--hover)] text-left"
      >
        <User size={18} />
        Profile
      </button>

      <button
        onClick={() => {
          localStorage.clear();
          router.push("/login");
        }}
        className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-[var(--hover)] text-left"
      >
        <LogOut size={18} />
        Logout
      </button>
    </div>
  );
}
