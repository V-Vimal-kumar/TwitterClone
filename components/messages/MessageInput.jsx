import { useState } from "react";

export default function MessageInput({ onSend }) {
  const [text, setText] = useState("");

  return (
    <div className="border-t border-[var(--border)] p-4">
      <form
        onSubmit={e => {
          e.preventDefault();
          if (!text.trim()) return;
          onSend(text);
          setText("");
        }}
        className="flex gap-2"
      >
        <input
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Type a message…"
          className="flex-1 px-4 py-2 rounded-full bg-[var(--hover)] text-sm outline-none"
        />
        <button
          type="submit"
          className="px-4 py-2 rounded-full bg-black text-white text-sm
            dark:bg-white dark:text-black"
        >
          Send
        </button>
      </form>
    </div>
  );
}
