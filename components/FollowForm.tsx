"use client";

import { useState } from "react";

export default function FollowForm() {
  const [name, setName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  );

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setMessage("");
    setStatus("loading");
    const res = await fetch("/api/follow", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, whatsapp, email })
    });
    if (!res.ok) {
      const payload = await res.json().catch(() => null);
      setMessage(payload?.error || "Could not save. Please try again.");
      setStatus("error");
      return;
    }
    setStatus("success");
    setName("");
    setWhatsapp("");
    setEmail("");
  };

  return (
    <form onSubmit={submit} className="space-y-3">
      <div className="space-y-2">
        <label className="text-sm font-semibold">Full Name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          className="w-full rounded-xl border border-pink-200 px-3 py-3"
          required
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-semibold">WhatsApp Number</label>
        <input
          value={whatsapp}
          onChange={(e) => setWhatsapp(e.target.value)}
          placeholder="e.g. 9033339176"
          className="w-full rounded-xl border border-pink-200 px-3 py-3"
          required
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-semibold">Email (optional)</label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email for updates"
          className="w-full rounded-xl border border-pink-200 px-3 py-3"
        />
      </div>
      <button
        disabled={status === "loading"}
        className="w-full rounded-xl bg-brand-600 text-white px-4 py-3 text-base font-semibold"
      >
        {status === "loading" ? "Submitting..." : "Follow for Updates"}
      </button>
      {status === "success" && (
        <p className="text-sm text-green-600">
          You are now following. We will send daily arrivals on WhatsApp.
        </p>
      )}
      {status === "error" && (
        <p className="text-sm text-red-500">{message}</p>
      )}
    </form>
  );
}
