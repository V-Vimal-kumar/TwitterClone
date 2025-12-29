"use client";

import { useEffect, useRef } from "react";
import socket from "@/lib/socket"; // adjust path if needed

export default function ChatBody({ messages, me, conversationId }) {
  const bottomRef = useRef(null);
  const hasMarkedRead = useRef(false);

  /* ===========================
     AUTO SCROLL
  =========================== */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* ===========================
     MARK AS READ (🔥 FIX)
     - only once
     - only if last message is from other user
  =========================== */
  useEffect(() => {
    if (!messages.length || !me || hasMarkedRead.current) return;

    const lastMsg = messages[messages.length - 1];

    if (lastMsg.sender_id !== me.id && !lastMsg.read_at) {
      socket.emit("mark_as_read", {
        conversationId,
        readerId: me.id,
      });

      hasMarkedRead.current = true;
    }
  }, [messages, me, conversationId]);

  
  useEffect(() => {
  if (!messages.length || !me) return;

  const lastMsg = messages[messages.length - 1];

  if (lastMsg.sender_id !== me.id) {
    socket.emit("mark_as_read", {
      conversationId,
      readerId: me.id,
    });
  }
}, [messages]);


  function renderTicks(msg) {
    // ✓ sent
    if (!msg.delivered_at) {
      return <span className="text-gray-400">✓</span>;
    }

    // ✓✓ delivered
    if (msg.delivered_at && !msg.read_at) {
      return (
        <>
          <span className="text-gray-400">✓</span>
          <span className="text-gray-400">✓</span>
        </>
      );
    }

    // ✓✓ read (blue)
    if (msg.read_at) {
      return (
        <>
          <span className="text-blue-500">✓</span>
          <span className="text-blue-500">✓</span>
        </>
      );
    }
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-3 flex flex-col">
      {messages.map((msg) => {
        const isMe = msg.sender_id === me?.id;

        return (
          <div
            key={msg.id}
            className={`flex ${isMe ? "justify-end" : "justify-start"}`}
          >
            <div className="flex items-end gap-1 max-w-[70%]">
              <div
                className={`px-4 py-2 rounded-2xl text-sm break-words
                  ${
                    isMe
                      ? "bg-black text-white dark:bg-white dark:text-black"
                      : "bg-[var(--hover)]"
                  }`}
              >
                {msg.text}
              </div>

              {/* TICKS (ONLY MY MESSAGES) */}
              {isMe && (
                <span className="flex items-center gap-[1px] text-xs">
                  {renderTicks(msg)}
                </span>
              )}
            </div>
          </div>
        );
      })}
      <div ref={bottomRef} />
    </div>
  );
}
