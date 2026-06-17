import { getSettings } from "../../../lib/settings";
import SettingsForm from "../../../components/SettingsForm";

export default async function AdminSettingsPage() {
  const settings = await getSettings();
  return (
    <div className="border border-[var(--line)] bg-white p-6 dark:bg-[var(--surface)]">
      <h1 className="font-display text-3xl font-medium">Settings</h1>
      <p className="mt-2 text-sm text-neutral-500">
        Update your shop name, WhatsApp number, address, and delivery text.
      </p>
      <div className="mt-6">
        <SettingsForm initial={settings} />
      </div>
    </div>
  );
}
