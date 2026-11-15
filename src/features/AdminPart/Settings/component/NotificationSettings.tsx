"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import SettingsToggle from "./SettingsToggle";
type Account = {
  id?: string;
  _id?: string;
  notificationPreferences?: Record<string, boolean>;
};
const choices = [
  ["enabled", "All notifications"],
  ["message", "Messages"],
  ["announcements", "Announcements"],
  ["grades", "Grades"],
  ["documents", "Academic documents"],
] as const;
export default function NotificationSettings() {
  const { data: session } = useSession();
  const id = session?.user.id;
  const query = useQuery({
    queryKey: ["notification-preferences", id],
    enabled: !!id,
    queryFn: async () =>
      (await api.get<{ data: Account }>("/users/me")).data.data,
  });
  if (!id || query.isPending)
    return <p role="status">Loading notification preferences...</p>;
  if (query.isError || !query.data)
    return (
      <div role="alert">
        <p>Unable to load notification preferences.</p>
        <button onClick={() => void query.refetch()}>Retry</button>
      </div>
    );
  return <PreferenceForm key={id} profile={query.data} userId={id} />;
}
function PreferenceForm({
  profile,
  userId,
}: {
  profile: Account;
  userId: string;
}) {
  const queryClient = useQueryClient();
  const [preferences, setPreferences] = useState<Record<string, boolean>>(
    profile.notificationPreferences ?? {},
  );
  const [saving, setSaving] = useState(false),
    [error, setError] = useState(""),
    [saved, setSaved] = useState(false);
  async function save() {
    if (saving) return;
    setSaving(true);
    setError("");
    setSaved(false);
    try {
      await api.put("/users/" + userId, {
        notificationPreferences: preferences,
      });
      queryClient.setQueryData(["notification-preferences", userId], {
        ...profile,
        notificationPreferences: preferences,
      });
      setSaved(true);
    } catch {
      setError("Unable to save your preferences. Please retry.");
    } finally {
      setSaving(false);
    }
  }
  return (
    <div>
      <p className="mb-4 text-gray-600">
        Choose which updates appear in your notification feed.
      </p>
      {choices.map(([key, label]) => (
        <div
          key={key}
          className="flex items-center justify-between gap-3 border-b border-gray-200 py-3"
        >
          <span className="text-lg text-gray-700">{label}</span>
          <SettingsToggle
            label={label}
            active={preferences[key] !== false}
            disabled={saving}
            onChange={() => {
              setSaved(false);
              setPreferences((previous) => ({
                ...previous,
                [key]: previous[key] === false,
              }));
            }}
          />
        </div>
      ))}
      {error && (
        <p role="alert" className="mt-3 text-red-600">
          {error}
        </p>
      )}
      {saved && (
        <p role="status" className="mt-3 text-green-700">
          Notification preferences saved.
        </p>
      )}
      <button
        className="mt-5 rounded-lg bg-[#871dad] px-5 py-3 text-white disabled:opacity-50"
        disabled={saving}
        onClick={() => void save()}
      >
        {saving ? "Saving..." : "Save preferences"}
      </button>
    </div>
  );
}
