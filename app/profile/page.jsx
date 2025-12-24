"use client";

import { useEffect, useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfilePostList from "@/components/profile/ProfilePostList";
import ProfilePageHeader from "@/components/profile/ProfilePageHeader";

export default function MyProfilePage() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch("/api/users/me", { credentials: "include" })
      .then(res => res.json())
      .then(setUser);
  }, []);

  if (!user) return null;

  return (
  <AppLayout>
    <div className="w-full md:max-w-[680px] border-x border-[var(--border)]">
      
      <ProfilePageHeader
        title="Profile"
        showBack={false}
      />

      <ProfileHeader user={user} isMe />
      <ProfilePostList username={user.username} />
    </div>
  </AppLayout>
);
}
