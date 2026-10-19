"use client";

import { useState, type FormEvent } from "react";
import { useSession } from "next-auth/react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { api } from "@/lib/api";

type Profile = {
  id: string;
  username: string;
  email?: string;
  phoneNumber?: string;
};

export default function ProfileSettings() {
  const { data: session } = useSession();
  const profile = useQuery({
    queryKey: ["settings", "profile", session?.user.id],
    enabled: Boolean(session?.user.id),
    queryFn: async () => {
      const { data } = await api.get<{ data: Profile }>("/users/me");
      return data.data;
    },
  });

  if (profile.isError) {
    return (
      <div role="alert" className="space-y-3 text-red-600">
        <p>Unable to load your profile.</p>
        <button onClick={() => profile.refetch()} className="underline">
          Try again
        </button>
      </div>
    );
  }

  if (!profile.data) return <p role="status">Loading profile...</p>;

  return <ProfileForm key={profile.data.id} profile={profile.data} />;
}

function ProfileForm({ profile }: { profile: Profile }) {
  const queryClient = useQueryClient();
  const [username, setUsername] = useState(profile.username ?? "");
  const [email, setEmail] = useState(profile.email ?? "");
  const [phoneNumber, setPhoneNumber] = useState(profile.phoneNumber ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (saving) return;
    setSaving(true);
    setError("");
    setSaved(false);
    try {
      const { data } = await api.put<{ data: Profile }>(
        `/users/${profile.id}`,
        {
          username: username.trim(),
          email: email.trim(),
          phoneNumber: phoneNumber.trim(),
        },
      );
      queryClient.setQueryData(["settings", "profile", profile.id], data.data);
      setSaved(true);
    } catch (err) {
      setError(
        isAxiosError(err)
          ? err.response?.data?.message ||
              "Unable to update your profile. Please try again."
          : "Unable to update your profile. Please try again.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={save} className="max-w-xl space-y-6">
      <h2 className="text-2xl font-semibold text-[#333]">Profile Update</h2>
      <fieldset
        disabled={saving}
        className="space-y-5 disabled:opacity-60"
        onChange={() => setSaved(false)}
      >
        <div className="space-y-2">
          <label htmlFor="profile-name" className="block text-sm font-medium">
            Name
          </label>
          <input
            id="profile-name"
            autoComplete="name"
            required
            maxLength={100}
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            pattern=".*\S.*"
            className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-[#871dad] focus:outline-none"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="profile-email" className="block text-sm font-medium">
            Email
          </label>
          <input
            id="profile-email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-[#871dad] focus:outline-none"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="profile-phone" className="block text-sm font-medium">
            Phone Number
          </label>
          <input
            id="profile-phone"
            type="tel"
            autoComplete="tel"
            value={phoneNumber}
            onChange={(event) => setPhoneNumber(event.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-[#871dad] focus:outline-none"
          />
        </div>
        <button
          type="submit"
          className="cursor-pointer rounded-lg bg-[#871dad] px-6 py-3 font-medium text-white hover:bg-[#751a99] disabled:cursor-wait"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </fieldset>
      {error && (
        <p role="alert" className="text-red-600">
          {error}
        </p>
      )}
      {saved && (
        <p role="status" className="text-green-700">
          Profile updated successfully.
        </p>
      )}
    </form>
  );
}
