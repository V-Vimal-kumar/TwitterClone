import { ArrowLeft } from "lucide-react";
import ChatBody from "./ChatBody";
import MessageInput from "./MessageInput";

export default function ChatWindow({
  activeChat,
  messages,
  me,
  onBack,
  onSend,
}) {
  return (
    <div
      className={`flex-1 flex flex-col
      ${activeChat ? "block" : "hidden md:flex"}`}
    >
      {activeChat ? (
        <>
          <div className="md:hidden flex items-center gap-3 px-4 py-3 border-b border-[var(--border)]">
            <button onClick={onBack}>
              <ArrowLeft />
            </button>
            <div className="font-semibold">{activeChat.name}</div>
          </div>

          <ChatBody messages={messages} me={me} />
          <MessageInput onSend={onSend} />
        </>
      ) : (
        <div className="hidden md:flex flex-1 items-center justify-center text-[var(--muted)]">
          Select a conversation
        </div>
      )}
    </div>
  );
}
