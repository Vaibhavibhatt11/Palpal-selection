"use client";

import { useState } from "react";

type Settings = {
  shopName: string;
  whatsappNumber: string;
  address: string;
  hours: string;
  deliveryText: string;
  announcementText: string | null;
};

export default function SettingsForm({ initial }: { initial: Settings }) {
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    const form = event.currentTarget;
    const data = {
      shopName: (form.elements.namedItem("shopName") as HTMLInputElement).value,
      whatsappNumber: (
        form.elements.namedItem("whatsappNumber") as HTMLInputElement
      ).value,
      address: (form.elements.namedItem("address") as HTMLInputElement).value,
      hours: (form.elements.namedItem("hours") as HTMLInputElement).value,
      deliveryText: (
        form.elements.namedItem("deliveryText") as HTMLInputElement
      ).value,
      announcementText: (
        form.elements.namedItem("announcementText") as HTMLInputElement
      ).value
    };

    const res = await fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      credentials: "same-origin"
    });
    setSaving(false);
    if (res.ok) {
      setMessage("Settings updated.");
    } else {
      setMessage("Failed to update settings.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <label className="text-xs font-semibold uppercase tracking-[0.1em] text-neutral-600">Shop Name</label>
        <input
          name="shopName"
          defaultValue={initial.shopName}
          placeholder="Shop name"
          className="input-soft"
        />
      </div>
      <div className="space-y-2">
        <label className="text-xs font-semibold uppercase tracking-[0.1em] text-neutral-600">WhatsApp Number</label>
        <input
          name="whatsappNumber"
          defaultValue={initial.whatsappNumber}
          placeholder="WhatsApp number"
          className="input-soft"
        />
      </div>
      <div className="space-y-2">
        <label className="text-xs font-semibold uppercase tracking-[0.1em] text-neutral-600">Address</label>
        <input
          name="address"
          defaultValue={initial.address}
          placeholder="Address"
          className="input-soft"
        />
      </div>
      <div className="space-y-2">
        <label className="text-xs font-semibold uppercase tracking-[0.1em] text-neutral-600">Hours</label>
        <input
          name="hours"
          defaultValue={initial.hours}
          placeholder="Hours"
          className="input-soft"
        />
      </div>
      <div className="space-y-2">
        <label className="text-xs font-semibold uppercase tracking-[0.1em] text-neutral-600">Delivery Text</label>
        <input
          name="deliveryText"
          defaultValue={initial.deliveryText}
          placeholder="Delivery text"
          className="input-soft"
        />
      </div>
      <div className="space-y-2">
        <label className="text-xs font-semibold uppercase tracking-[0.1em] text-neutral-600">Announcement (optional)</label>
        <input
          name="announcementText"
          defaultValue={initial.announcementText || ""}
          placeholder="Announcement (optional)"
          className="input-soft"
        />
      </div>
      <button
        disabled={saving}
        className="btn-primary w-full"
      >
        {saving ? "Saving..." : "Save Settings"}
      </button>
      {message && <p className="text-sm text-neutral-500">{message}</p>}
    </form>
  );
}
