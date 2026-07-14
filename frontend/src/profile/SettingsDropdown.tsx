import CollapsibleSection from "./CollapsibleSection";
import { enablePushNotifications } from "../push";
import { useToast } from "../context/ToastContext";

export default function SettingsDropdown() {
  const { showToast } = useToast();

  async function handleEnableNotifications() {
    try {
      await enablePushNotifications();
      showToast("Notifications enabled");
    } catch (err) {
      console.error(err);
      showToast("Could not enable notifications");
    }
  }
  return (
    <CollapsibleSection title="Settings">
      <button className="notifications-btn" onClick={handleEnableNotifications}>
        Enable notifications
      </button>
    </CollapsibleSection>
  );
}
