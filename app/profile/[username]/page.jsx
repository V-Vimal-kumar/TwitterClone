"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import AppLayout from "@/components/layout/AppLayout";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfilePostList from "@/components/profile/ProfilePostList";
import ProfilePageHeader from "@/components/profile/ProfilePageHeader";

export default function UserProfilePage() {
  const { username } = useParams();
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch(`/api/users/${username}`)
      .then(res => res.json())
      .then(setUser);
  }, [username]);

  if (!user) return null;

return (
  <AppLayout>
    <div className="w-full md:max-w-[680px] border-x border-[var(--border)]">
      
      <ProfilePageHeader
        title={user.name}
        showBack
      />

      <ProfileHeader user={user} isMe={false} />
      <ProfilePostList username={username} />
    </div>
  </AppLayout>
);
}