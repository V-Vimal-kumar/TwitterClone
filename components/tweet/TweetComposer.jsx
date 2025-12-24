"use client";

import { useRef, useState } from "react";

export default function TweetComposer({ onPostCreated, user }) {
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileRef = useRef(null);

  const submit = async () => {
    if ((!content.trim() && !image) || loading) return;

    setLoading(true);
    let image_url = null;

    try {
      
      if (image) {
        const fd = new FormData();
        fd.append("file", image);
        fd.append("upload_preset", "twitterclone");

        const uploadRes = await fetch(
          `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
          { method: "POST", body: fd }
        );

        const uploadData = await uploadRes.json();
        image_url = uploadData.secure_url;
      }

      // 2️⃣ Create post (JSON ONLY)
      const res = await fetch("/api/posts", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, image_url }),
      });

      const post = await res.json();
      if (post?.id) onPostCreated(post);

      setContent("");
      setImage(null);
      setPreview(null);
    } catch (err) {
      console.error(err);
      alert("Failed to post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-4 py-4 border-b border-[var(--border)]">
      <div className="flex gap-3">
        {/* AVATAR */}
        <div className="w-10 h-10 rounded-full bg-[var(--border)] overflow-hidden">
          {user?.avatar_url && (
            <img
              src={user.avatar_url}
              className="w-full h-full object-cover"
              alt="avatar"
            />
          )}
        </div>

        {/* INPUT */}
        <input
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder="What is happening?!"
          className="flex-1 bg-transparent outline-none text-xl"
        />
      </div>

      {/* IMAGE PREVIEW */}
      {preview && (
        <div className="mt-3 pl-[52px] relative">
          <img
            src={preview}
            className="max-h-[300px] rounded-2xl object-cover"
          />
          <button
            onClick={() => {
              setImage(null);
              setPreview(null);
              fileRef.current.value = "";
            }}
            className="absolute top-2 right-2 bg-black/60 text-white rounded-full px-2 py-1 text-xs"
          >
            ✕
          </button>
        </div>
      )}

      {/* ACTIONS */}
      <div className="flex items-center justify-between mt-3 pl-[52px]">
        <button
          onClick={() => fileRef.current.click()}
          className="text-[#1D9BF0] text-sm"
        >
          Image
        </button>

        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          hidden
          onChange={e => {
            const file = e.target.files[0];
            if (!file) return;
            setImage(file);
            setPreview(URL.createObjectURL(file));
          }}
        />

        <button
          onClick={submit}
          disabled={(!content.trim() && !image) || loading}
          className="px-4 py-1.5 rounded-full bg-[#1D9BF0] text-white font-semibold disabled:opacity-50"
        >
          {loading ? "Posting…" : "Post"}
        </button>
      </div>
    </div>
  );
}
