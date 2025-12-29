import { useEffect, useState } from "react";

export function useMe() {
  const [me, setMe] = useState(null);

  useEffect(() => {
    fetch("/api/users/me", { credentials: "include" })
      .then(res => res.json())
      .then(setMe);
  }, []);

  return me;
}
