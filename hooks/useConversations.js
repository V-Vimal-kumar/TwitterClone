import { useEffect, useState } from "react";

export function useConversations() {
  const [conversations, setConversations] = useState([]);

  const loadConversations = async () => {
    const res = await fetch("/api/conversations", {
      credentials: "include",
    });
    if (!res.ok) return;
    const text = await res.text();
    setConversations(text ? JSON.parse(text) : []);
  };

  useEffect(() => {
    loadConversations();
  }, []);

  return { conversations, setConversations, loadConversations };
}
