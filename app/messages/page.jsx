"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import socket from "@/lib/socket";

import ChatList from "@/components/messages/ChatList";
import ChatWindow from "@/components/messages/ChatWindow";

import { useMe } from "@/hooks/useMe";
import { useConversations } from "@/hooks/useConversations";
import { useChatMessages } from "@/hooks/useChatMessages";
import { useChatSocket } from "@/hooks/useChatSocket";

export default function MessagesPage() {
  const me = useMe();

  const {
    conversations,
    loadConversations,
  } = useConversations();

  const [activeChat, setActiveChat] = useState(null);

  const {
    messages,
    setMessages,
    reloadMessages,
  } = useChatMessages(activeChat);

  const searchParams = useSearchParams();
  const profileUserId = searchParams.get("userId");

  /* =====================
     PROFILE → NEW CHAT
  ===================== */
  useEffect(() => {
    if (!profileUserId) return;

    setActiveChat({
      id: null,
      user_id: Number(profileUserId),
      name: "New conversation",
    });

    setMessages([]);
  }, [profileUserId]);

  /* =====================
     SOCKET HANDLING
  ===================== */
  useChatSocket({
    me,
    activeChat,
    setMessages,
    reloadMessages,
    loadConversations,
  });

  /* =====================
     SEND MESSAGE
  ===================== */
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

    const data = await res.json(); // { message, conversationId }

    // attach conversation id for new chat
    if (!activeChat.id) {
      setActiveChat(prev => ({
        ...prev,
        id: data.conversationId,
      }));
    }

    // optimistic message
    setMessages(prev => [...prev, data.message]);

    // socket emit (real-time)
    socket.emit("send_message", {
      toUserId: activeChat.user_id,
      message: {
        ...data.message,
        sender_name: me.username || me.name || me.email,
      },
    });

    // refresh conversation list (DB truth)
    loadConversations();
  }

  return (
    <div className="flex w-full h-[calc(100vh-56px)] md:h-screen border-x border-[var(--border)]">
      <ChatList
        conversations={conversations}
        activeChat={activeChat}
        onSelect={async (chat) => {
          console.log("🟡 Chat clicked:", chat.id);

          setActiveChat(chat);
          setMessages([]);

          // 1️⃣ mark messages as read (DB)
          await fetch("/api/conversations/read", {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ conversationId: chat.id }),
          });

          // 2️⃣ real-time notify (socket)
          if (socket.connected && me?.id) {
            socket.emit("mark_as_read", {
              conversationId: chat.id,
              readerId: me.id,
            });
          }

          // 3️⃣ reload conversations from DB (SOURCE OF TRUTH)
          loadConversations();
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
