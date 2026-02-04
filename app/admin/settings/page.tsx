import { getSettings } from "../../../lib/settings";
import SettingsForm from "../../../components/SettingsForm";

export default async function AdminSettingsPage() {
  const settings = await getSettings();
  return (
    <div className="card-soft p-6">
      <h1 className="text-2xl font-bold mb-2">Settings</h1>
      <p className="text-sm text-neutral-500 mb-6">
        Update your shop name, WhatsApp number, address, and delivery text.
      </p>
      <SettingsForm initial={settings} />
    </div>
  );
}
