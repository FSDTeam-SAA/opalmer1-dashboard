"use client";

import PageHeader from "@/components/sheard/PageHeader";
import { useState } from "react";
import { api } from "@/lib/api";
import { isAxiosError } from "axios";
import ParentPicker from "./ParentPicker";
import type { ParentRow } from "../api/parents.api";

export default function GuardianInvitations() {
  const [childId, setChildId] = useState("");
  const [parent, setParent] = useState<ParentRow | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [invitation, setInvitation] = useState<{
    code: string;
    expiresAt: string;
    studentId: string;
    parentEmail: string;
  } | null>(null);
  async function create(event: React.FormEvent) {
    event.preventDefault();
    if (busy || !parent) return;
    setBusy(true);
    setError("");
    setInvitation(null);
    try {
      const response = await api.post("/parent/child/invitations", {
        childId,
        parentId: parent._id,
      });
      setInvitation(response.data.data);
    } catch (error) {
      setError(
        isAxiosError(error)
          ? error.response?.data?.message ||
              "Unable to send invitation. Please try again."
          : "Unable to send invitation. Please try again.",
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <section className="mx-auto max-w-2xl space-y-5 rounded-2xl bg-white p-6 shadow-sm mt-24">
      <PageHeader title="Guardian Invitations" />
      <h1 className="text-2xl font-semibold">Guardian invitations</h1>
      <p className="text-gray-600">
        Verify the guardian relationship with the school before creating an
        invitation. Select a parent below to email the code and linking
        instructions.
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
        <ParentPicker
          value={parent}
          onChange={(value) => {
            setParent(value);
            setError("");
            setInvitation(null);
          }}
          disabled={busy}
        />
        <button
          disabled={busy || !parent}
          className="rounded-lg bg-purple-700 px-5 py-3 text-white disabled:opacity-50"
        >
          {busy ? "Sending..." : "Send invitation"}
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
            Invitation email sent to {invitation.parentEmail}. The parent can
            use this code to link the child in the app.
          </p>
        </div>
      )}
    </section>
  );
}
