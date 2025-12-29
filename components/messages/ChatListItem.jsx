export default function ChatListItem({ chat, onClick }) {
  return (
    <li
      onClick={onClick}
      className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-[var(--hover)]"
    >
      <img
        src={chat.avatar_url}
        className="w-10 h-10 rounded-full"
      />

      <div className="flex-1 min-w-0">
        <div className="font-semibold">{chat.name}</div>
        <div className="text-sm text-[var(--muted)] truncate">
          {chat.last_message}
        </div>
      </div>

      {/* 🔥 UNREAD BADGE — CORRECT PLACE */}
      {chat.unread_count > 0 && (
        <span
          className="ml-2 min-w-[18px] h-[18px] px-1
          rounded-full bg-blue-500 text-white text-xs
          flex items-center justify-center"
        >
          {chat.unread_count}
        </span>
      )}
    </li>
  );
}
