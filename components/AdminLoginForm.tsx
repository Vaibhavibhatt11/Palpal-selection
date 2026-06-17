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
      className="w-full max-w-md border border-[var(--line)] bg-white p-7 shadow-card dark:bg-[var(--surface)]"
    >
      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-brand-700">
        Admin Panel
      </p>
      <h1 className="mt-2 font-display text-3xl font-medium text-neutral-900 dark:text-white">
        Sign In
      </h1>
      <p className="mt-1 text-sm text-neutral-500">Use admin credentials to continue.</p>

      <div className="mt-6 space-y-4">
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-[0.1em] text-neutral-600">
            Admin Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Admin email"
            className="input-soft"
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-[0.1em] text-neutral-600">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="input-soft"
            required
          />
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
        <button className="btn-primary w-full">Sign In</button>
      </div>
    </form>
  );
}
