"use client";

import { useEffect } from "react";
import toast from "react-hot-toast";
import socket from "@/lib/socket";
import { useUnread } from "@/context/UnreadContext";

export default function SocketProvider({ children }) {
  const { increment } = useUnread();

  useEffect(() => {
    /* ===========================
       NEW MESSAGE TOAST
       - no unused variables
    =========================== */
    socket.on("new_message_notify", ({ fromName, text }) => {
      const name = fromName || "New message";
      toast(`💬 ${name}: ${text}`);
    });

    /* ===========================
       UNREAD USER COUNT
    =========================== */
    socket.on("unread_increment", ({ fromUserId }) => {
      if (!fromUserId) return;
      increment(fromUserId);
    });

    return () => {
      socket.off("new_message_notify");
      socket.off("unread_increment");
    };
  }, [increment]);

  return children;
}
