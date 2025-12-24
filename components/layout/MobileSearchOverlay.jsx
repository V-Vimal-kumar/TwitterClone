"use client";

import SearchBox from "@/components/right/SearchBox";
import { useRef } from "react";

export default function MobileSearchOverlay({ open, onClose }) {
  const panelRef = useRef(null);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 bg-black/40" 
    onClick={onClose}  >

      <div  ref={panelRef}
      onClick={e => e.stopPropagation()}
      className="bg-[var(--bg)] p-4"
      >
        <SearchBox />
      </div>
    </div>
  );
}
