"use client";

export default function ConfirmLogoutModal({ open, onClose, onConfirm }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
      <div className="bg-[var(--bg)] rounded-xl p-5 w-[90%] max-w-sm">
        <h3 className="text-lg font-semibold mb-2">Log out?</h3>
        <p className="text-sm text-[var(--muted)] mb-5">
          Are you sure you want to log out?
        </p>

        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="text-sm">
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-1.5 rounded-full bg-red-500 text-white text-sm font-semibold"
          >
            Log out
          </button>
        </div>
      </div>
    </div>
  );
}
