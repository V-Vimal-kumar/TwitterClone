import { useEffect, useState } from "react";

export function useChatMessages(activeChat) {
  const [messages, setMessages] = useState([]);

  const reloadMessages = async () => {
    if (!activeChat?.id) return;
    const res = await fetch(
      `/api/messages?conversationId=${activeChat.id}`,
      { credentials: "include" }
    );
    if (!res.ok) return;
    const data = await res.json();
    setMessages(data);
  };

  useEffect(() => {
    if (!activeChat?.id) return;
    reloadMessages();
  }, [activeChat?.id]);

  return { messages, setMessages, reloadMessages };
}
