"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import  socket  from "@/lib/socket";

import ChatList from "@/components/messages/ChatList";
import ChatWindow from "@/components/messages/ChatWindow";

import { useMe } from "@/hooks/useMe";
import { useConversations } from "@/hooks/useConversations";
import { useChatMessages } from "@/hooks/useChatMessages";
import { useChatSocket } from "@/hooks/useChatSocket";

export default function MessagesPage() {
  const me = useMe();
  const { conversations, setConversations, loadConversations } =
    useConversations();

  const [activeChat, setActiveChat] = useState(null);
  const { messages, setMessages, reloadMessages } =
    useChatMessages(activeChat);

  const searchParams = useSearchParams();
  const profileUserId = searchParams.get("userId");

  // profile → new chat
  useEffect(() => {
    if (!profileUserId) return;
    setActiveChat({
      id: null,
      user_id: Number(profileUserId),
      name: "New conversation",
    });
    setMessages([]);
  }, [profileUserId]);

  // socket
  useChatSocket({
    me,
    activeChat,
    setMessages,
    reloadMessages,
    loadConversations,
  });

  // =====================
  // SEND MESSAGE
  // =====================
async function sendMessage(text) {
  if (!activeChat || !text.trim() || !me) return;

  const res = await fetch("/api/messages", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      receiverId: activeChat.user_id,
      text,
    }),
  });

  if (!res.ok) return;

  const data = await res.json(); // contains message + conversationId

  if (!activeChat.id) {
    setActiveChat(prev => ({ ...prev, id: data.conversationId }));
  }

  // optimistic bubble
  setMessages(prev => [...prev, data.message]);

  // 🔥 FIX: ATTACH SENDER NAME BEFORE EMIT
  socket.emit("send_message", {
    toUserId: activeChat.user_id,
    message: {
      ...data.message,
      sender_name: me.username || me.name || me.email, // ✅ REQUIRED
    },
  });

  loadConversations();
}

  return (
    <div className="flex w-full h-[calc(100vh-56px)] md:h-screen border-x border-[var(--border)]">
      <ChatList
        conversations={conversations}
        activeChat={activeChat}
        onSelect={chat => {
          setActiveChat(chat);
          setMessages([]);

          fetch("/api/conversations/read", {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ conversationId: chat.id }),
          });

          setConversations(prev =>
            prev.map(c =>
              c.id === chat.id ? { ...c, unread_count: 0 } : c
            )
          );
        }}
      />

      <ChatWindow
        activeChat={activeChat}
        messages={messages}
        me={me}
        onBack={() => setActiveChat(null)}
        onSend={sendMessage}
      />
    </div>
  );
}
