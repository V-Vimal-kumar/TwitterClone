"use client";
import { createContext, useContext, useState } from "react";

const UnreadContext = createContext();

export function UnreadProvider({ children }) {
  const [unread, setUnread] = useState({});

const increment = (userId) => {
  setUnread((prev) => {
    if (prev[userId]) return prev;

    return {
      ...prev,
      [userId]: 1,
    };
  });
};


  const clear = (userId) => {
    setUnread((prev) => ({ ...prev, [userId]: 0 }));
  };

  const total = Object.values(unread).reduce((a, b) => a + b, 0);

  return (
    <UnreadContext.Provider value={{ increment, clear, total }}>
      {children}
    </UnreadContext.Provider>
  );
}

export const useUnread = () => useContext(UnreadContext);
