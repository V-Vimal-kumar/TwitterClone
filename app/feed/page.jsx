"use client";

import { useEffect, useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import FeedLayout from "@/components/layout/FeedLayout";
import socket from "@/lib/socket";

export default function FeedPage() {
  const [user, setUser] = useState(null);

  // 1️⃣ get logged-in user
  useEffect(() => {
    fetch("/api/users/me", { credentials: "include" })
      .then((res) => (res.ok ? res.json() : null))
      .then(setUser)
      .catch(() => {});
  }, []);

  // 2️⃣ CONNECT + REGISTER SOCKET  (🔥 THIS WAS MISSING)
  useEffect(() => {
    if (!user?.id) return;

    socket.connect();
    socket.emit("register", user.id);

    return () => {
      socket.disconnect();
    };
  }, [user?.id]);

  return (
    <AppLayout>
      <FeedLayout />
    </AppLayout>
  );
}
