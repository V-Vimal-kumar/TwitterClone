import ChatListItem from "./ChatListItem";

export default function ChatList({ conversations, activeChat, onSelect }) {
  return (
    <div
      className={`w-full md:w-[320px] border-r border-[var(--border)]
      ${activeChat ? "hidden md:block" : "block"}`}
    >
      <h2 className="px-4 py-4 text-xl font-bold border-b border-[var(--border)]">
        Messages
      </h2>

      {conversations.length === 0 && (
        <div className="p-4 text-sm text-[var(--muted)]">
          No conversations yet
        </div>
      )}

      <ul>
        {conversations.map(chat => (
          <ChatListItem
            key={chat.id}
            chat={chat}
            onClick={() => onSelect(chat)}
          />
        ))}
      </ul>
    </div>
  );
}
