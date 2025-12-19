"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterForm() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Registration failed");
        setLoading(false);
        return;
      }

      // After successful register → login page
      router.push("/login");
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
          Create your account
        </h1>

        {error && (
          <p className="text-sm text-red-500 text-center">{error}</p>
        )}

        {["name", "username", "email", "password"].map((field) => (
          <input
            key={field}
            type={field === "password" ? "password" : "text"}
            placeholder={field[0].toUpperCase() + field.slice(1)}
            required
            onChange={(e) =>
              setForm({ ...form, [field]: e.target.value })
            }
            className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-transparent px-4 py-3 text-black dark:text-white focus:outline-none focus:border-[#1d9bf0]"
          />
        ))}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-[#1d9bf0] py-3 font-semibold text-white hover:bg-[#1a8cd8] disabled:opacity-60"
        >
          {loading ? "Creating..." : "Sign up"}
        </button>

        <p className="text-center text-sm text-gray-500">
          Already have an account?{" "}
          <a href="/login" className="text-[#1d9bf0] hover:underline">
            Sign in
          </a>
        </p>
      </form>
    </div>
  );
}
