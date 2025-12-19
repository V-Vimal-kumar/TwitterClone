"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Login failed");
        setLoading(false);
        return;
      }

      // ✅ JWT cookie is set by backend
      router.push("/feed");
    } catch {
      setError("Something went wrong");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm space-y-6"
      >
        <div className="text-center text-3xl font-bold text-black dark:text-white">
          X
        </div>

        <h1 className="text-2xl font-bold text-center text-black dark:text-white">
          Sign in to X
        </h1>

        {error && (
          <p className="text-sm text-red-500 text-center">{error}</p>
        )}

        <input
          type="text"
          placeholder="Phone, email, or username"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          required
          className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-transparent px-4 py-3 text-black dark:text-white focus:outline-none focus:border-[#1d9bf0]"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-transparent px-4 py-3 text-black dark:text-white focus:outline-none focus:border-[#1d9bf0]"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-[#1d9bf0] py-3 font-semibold text-white hover:bg-[#1a8cd8] disabled:opacity-60"
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>

        <p className="text-center text-sm text-gray-500">
          Don’t have an account?{" "}
          <a href="/register" className="text-[#1d9bf0] hover:underline">
            Sign up
          </a>
        </p>
      </form>
    </div>
  );
}
