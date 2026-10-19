"use client";
import { useState } from "react";
import { api } from "@/lib/api";

export default function GuardianInvitations() {
  const [childId, setChildId] = useState("");
  const [parentEmail, setParentEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [invitation, setInvitation] = useState<{
    code: string;
    expiresAt: string;
    studentId: string;
  } | null>(null);
  async function create(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    setInvitation(null);
    try {
      const response = await api.post("/parent/child/invitations", {
        childId,
        parentEmail,
      });
      setInvitation(response.data.data);
    } catch {
      setError(
        "Unable to create an invitation. Check the student ID and school access.",
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <section className="mx-auto max-w-2xl space-y-5 rounded-2xl bg-white p-6 shadow-sm mt-24">
      <h1 className="text-2xl font-semibold">Guardian invitations</h1>
      <p className="text-gray-600">
        Verify the guardian relationship with the school before creating an
        invitation. The code can only be used by a parent account with the email
        below.
      </p>
      <form onSubmit={create} className="space-y-4">
        <label className="block">
          Student ID
          <input
            required
            value={childId}
            onChange={(e) => setChildId(e.target.value)}
            className="mt-1 w-full rounded-lg border p-3"
          />
        </label>
        <label className="block">
          Guardian email
          <input
            required
            type="email"
            value={parentEmail}
            onChange={(e) => setParentEmail(e.target.value)}
            className="mt-1 w-full rounded-lg border p-3"
          />
        </label>
        <button
          disabled={busy}
          className="rounded-lg bg-purple-700 px-5 py-3 text-white disabled:opacity-50"
        >
          {busy ? "Creating..." : "Create invitation"}
        </button>
      </form>
      {error && (
        <p role="alert" className="text-red-600">
          {error}
        </p>
      )}
      {invitation && (
        <div className="rounded-xl border border-green-300 p-4 space-y-2">
          <p>Student: {invitation.studentId}</p>
          <p className="font-mono text-2xl tracking-widest">
            {invitation.code}
          </p>
          <p>Expires {new Date(invitation.expiresAt).toLocaleString()}</p>
          <p>
            Share this code securely with the verified guardian. It is shown
            only when created.
          </p>
        </div>
      )}
    </section>
  );
}
