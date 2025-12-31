import { useEffect } from "react";
import socket from "@/lib/socket";

export function useChatSocket({
  me,
  activeChat,
  setMessages,
  loadConversations,
}) {

  console.log("🟢 useChatSocket mounted", {
  me: me?.id,
  activeChat: activeChat?.id,
  socketConnected: socket.connected,
});

  useEffect(() => {
    if (!me?.id) return;

    socket.connect();
    socket.emit("register", me.id);

    socket.on("connect", () => {
  console.log("🟢 socket CONNECTED:", socket.id);
});

    // RECEIVE MESSAGE
    const onReceive = async (message) => {
      if (message.sender_id === me.id) return;

      if (activeChat?.id === message.conversation_id) {
        setMessages((prev) => [...prev, message]);

        await fetch("/api/conversations/read", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            conversationId: message.conversation_id,
          }),
        });

        socket.emit("mark_as_read", {
          conversationId: message.conversation_id,
          readerId: me.id,
        });

      }

      loadConversations();
    };

    // ✓✓ delivered
    const onDelivered = ({ conversationId }) => {
      setMessages(prev =>
        prev.map(m =>
          m.conversation_id === conversationId &&
            m.sender_id === me.id &&
            !m.delivered_at
            ? { ...m, delivered_at: new Date().toISOString() }
            : m
        )
      );
    };

    // ✓✓ blue
    const onRead = ({ conversationId }) => {
      setMessages(prev =>
        prev.map(m =>
          m.conversation_id === conversationId &&
            m.sender_id === me.id &&
            !m.read_at
            ? { ...m, read_at: new Date().toISOString() }
            : m
        )
      );
    };

    socket.on("receive_message", onReceive);
    socket.on("message_delivered", onDelivered);
    socket.on("mark_as_read", onRead);

    return () => {
      socket.off("receive_message", onReceive);
      socket.off("message_delivered", onDelivered);
      socket.off("mark_as_read", onRead);
      socket.disconnect();
    };
  }, [me?.id, activeChat?.id]);
}
