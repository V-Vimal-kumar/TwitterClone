"use client";

import { useRef, useState } from "react";

export default function EditProfileModal({
  user = {},
  onClose,
  onSaved,
}) {
  if (!user) return null;

  const [name, setName] = useState(user.name);
  const [bio, setBio] = useState(user.bio || "");
  const [avatar, setAvatar] = useState(null);
  const [preview, setPreview] = useState(user.avatar_url || null);
  const [loading, setLoading] = useState(false);
  const fileRef = useRef(null);

  const save = async () => {
    if (!name.trim()) return;
    setLoading(true);

    try {
      let avatar_url = user.avatar_url;

      // ✅ SIMPLE upload (no crop)
      if (avatar) {
        const fd = new FormData();
        fd.append("file", avatar);
        fd.append("upload_preset", "twitterclone");

        const res = await fetch(
          `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
          { method: "POST", body: fd }
        );

        const data = await res.json();
        avatar_url = data.secure_url; // ✅ DONE
      }

      const res = await fetch("/api/users/me", {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, bio, avatar_url }),
      });

      const updated = await res.json();
      onSaved(updated);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
      <div className="bg-[var(--bg)] w-[90%] max-w-md rounded-xl p-4">
        <h2 className="text-lg font-bold mb-4">Edit profile</h2>

        {/* Avatar */}
        <div className="flex justify-center mb-4">
          <div
            onClick={() => fileRef.current.click()}
            className="w-24 h-24 rounded-full bg-[var(--border)] overflow-hidden cursor-pointer"
          >
            {preview ? (
              <img
                src={preview}
                alt="avatar"
                className="w-full h-full object-cover"
              />
            ) : null}
          </div>

          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            hidden
            onChange={e => {
              const file = e.target.files[0];
              if (!file) return;
              setAvatar(file);
              setPreview(URL.createObjectURL(file));
            }}
          />
        </div>

        {/* Name */}
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Name"
          className="w-full mb-3 px-3 py-2 rounded border border-[var(--border)] bg-transparent outline-none"
        />

        {/* Bio */}
        <textarea
          value={bio}
          onChange={e => setBio(e.target.value)}
          placeholder="Bio"
          rows={3}
          className="w-full mb-4 px-3 py-2 rounded border border-[var(--border)] bg-transparent outline-none resize-none"
        />

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="text-sm">
            Cancel
          </button>
          <button
            onClick={save}
            disabled={loading}
            className="px-4 py-1.5 rounded-full bg-[#1D9BF0] text-white font-semibold disabled:opacity-50"
          >
            {loading ? "Saving…" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
