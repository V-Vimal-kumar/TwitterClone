"use client";

import { useState } from "react";
import EditProfileModal from "./EditProfileModal";

export default function ProfileHeader({ user, isMe }) {
  const [open, setOpen] = useState(false);
  const [profile, setProfile] = useState(() => user ?? null);

  return (
    <div className="px-4 py-6 border-b border-[var(--border)]">
      {/* Avatar */}
      <div className="w-20 h-20 rounded-full bg-[var(--border)] overflow-hidden mb-4">
        {profile.avatar_url && (
          <img
            src={profile.avatar_url}
            className="w-full h-full object-cover"
          />
        )}
      </div>

      <h2 className="text-xl font-bold">{profile.name}</h2>
      <p className="text-[#71767B]">@{profile.username}</p>

      {profile.bio && (
        <p className="mt-2 text-sm">{profile.bio}</p>
      )}

      {isMe && (
        <button
          onClick={() => setOpen(true)}
          className="mt-4 px-4 py-1.5 rounded-full border border-[var(--border)] hover:bg-[var(--hover)]"
        >
          Edit profile
        </button>
      )}

      {open && profile && (
        <EditProfileModal
          user={profile}
          onClose={() => setOpen(false)}
          onSaved={setProfile}
        />
      )}

    </div>
  );
}
