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
    const [posX, setPosX] = useState(50);
    const [posY, setPosY] = useState(50);


    const save = async () => {
        if (!name.trim()) return;

        setLoading(true);

        let avatar_url = user.avatar_url;

        if (avatar) {
            console.log("Uploading avatar...");
            console.log("Cloud name:", process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME);

            const fd = new FormData();
            fd.append("file", avatar);
            fd.append("upload_preset", "twitterclone");

            const res = await fetch(
                `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
                { method: "POST", body: fd }
            );

            console.log("Cloudinary status:", res.status);

            const data = await res.json();
            console.log("Cloudinary response:", data);

            const publicId = data.public_id;

            // Generate cropped avatar URL
            avatar_url = `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload
/c_fill,g_face,w_300,h_300
/x_${Math.round((posX - 50) * 3)}
/y_${Math.round((posY - 50) * 3)}
/${publicId}.jpg`
                .replace(/\s+/g, "");

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
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
            <div className="bg-[var(--bg)] w-[90%] max-w-md rounded-xl p-4">
                <h2 className="text-lg font-bold mb-4">Edit profile</h2>

                {/* Avatar */}
                <div className="flex justify-center mb-4">
                    <div className="flex flex-col items-center mb-4 gap-3">
                        <div
                            onClick={() => fileRef.current.click()}
                            className="w-24 h-24 rounded-full bg-[var(--border)] overflow-hidden cursor-pointer relative"
                        >
                            {preview && (
                                <img
                                    src={preview}
                                    className="w-full h-full object-cover"
                                    style={{
                                        objectPosition: `${posX}% ${posY}%`,
                                    }}
                                />
                            )}
                        </div>

                        {/* POSITION CONTROLS */}
                        {preview && (
                            <div className="w-full px-4 space-y-2">
                                <label className="text-xs text-[var(--muted)]">
                                    Horizontal
                                </label>
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={posX}
                                    onChange={e => setPosX(e.target.value)}
                                />

                                <label className="text-xs text-[var(--muted)]">
                                    Vertical
                                </label>
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={posY}
                                    onChange={e => setPosY(e.target.value)}
                                />
                            </div>
                        )}
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
