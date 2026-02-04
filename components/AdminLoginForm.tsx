"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useSearchParams } from "next/navigation";

export default function AdminLoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const params = useSearchParams();
  const callbackUrl = params.get("from") || "/admin";

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl
    });
    if (!res?.ok) {
      setError(
        "Login failed. Check admin email/password and database connection."
      );
      return;
    }
    window.location.href = callbackUrl;
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md bg-white rounded-3xl shadow-soft p-6 border border-pink-100"
    >
      <h1 className="text-2xl font-bold mb-4">Admin Login</h1>
      <div className="space-y-3">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Admin email"
          className="w-full rounded-xl border border-pink-200 px-3 py-2"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full rounded-xl border border-pink-200 px-3 py-2"
          required
        />
        {error && <p className="text-sm text-red-500">{error}</p>}
        <button className="w-full rounded-xl bg-brand-600 text-white px-4 py-2">
          Sign In
        </button>
      </div>
    </form>
  );
}
