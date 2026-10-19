"use client";

import { useState, type FormEvent } from "react";
import { isAxiosError } from "axios";
import { api } from "@/lib/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

type Invitation = {
  code: string;
  expiresAt: string;
  studentId: string;
  parentEmail: string;
};

export default function GuardianInvitationModal({
  student,
  onClose,
}: {
  student: { _id: string; userId: string; name: string };
  onClose: () => void;
}) {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [invitation, setInvitation] = useState<Invitation | null>(null);

  async function create(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy || invitation) return;
    setBusy(true);
    setError("");
    try {
      const { data } = await api.post<{ data: Invitation }>(
        "/parent/child/invitations",
        {
          childId: student._id,
          parentEmail: email.trim(),
        },
      );
      setInvitation(data.data);
    } catch (err) {
      setError(
        isAxiosError(err)
          ? err.response?.data?.message ||
              "Unable to create invitation. Please try again."
          : "Unable to create invitation. Please try again.",
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open && !busy) onClose();
      }}
    >
      <DialogContent
        className="max-h-[90vh] overflow-y-auto rounded-2xl bg-white sm:max-w-lg"
        showCloseButton={!busy}
      >
        <DialogHeader>
          <DialogTitle className="text-xl text-[#333]">
            Guardian Invitation
          </DialogTitle>
          <DialogDescription>
            Invite a verified guardian for {student.name}. Enter the
            guardian&apos;s email below.
          </DialogDescription>
        </DialogHeader>
        {invitation ? (
          <div role="status" className="space-y-4">
            <p className="font-medium text-green-700">
              Invitation created successfully.
            </p>
            <div className="space-y-2 rounded-xl border border-green-200 bg-green-50 p-4">
              <p className="text-sm">Student ID: {invitation.studentId}</p>
              <p className="break-all text-sm">
                Guardian: {invitation.parentEmail}
              </p>
              <p className="font-mono text-2xl tracking-widest text-[#871dad]">
                {invitation.code}
              </p>
              <p className="text-sm text-gray-600">
                Expires {new Date(invitation.expiresAt).toLocaleString()}
              </p>
            </div>
            <p className="text-sm text-gray-600">
              Share this code securely with the guardian. Only a parent account
              using this email can redeem it. The code is shown only when
              created.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer rounded-lg bg-[#871dad] px-5 py-2.5 font-medium text-white"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={create} className="space-y-5">
            <div className="space-y-2">
              <label
                htmlFor="invitation-student-id"
                className="block text-sm font-medium text-[#333]"
              >
                Student ID
              </label>
              <input
                id="invitation-student-id"
                readOnly
                value={student.userId}
                className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-gray-600"
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="invitation-guardian-email"
                className="block text-sm font-medium text-[#333]"
              >
                Guardian email
              </label>
              <input
                id="invitation-guardian-email"
                type="email"
                autoComplete="email"
                required
                disabled={busy}
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="guardian@example.com"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-[#871dad] focus:outline-none"
              />
            </div>
            {error && (
              <p role="alert" className="text-sm text-red-600">
                {error}
              </p>
            )}
            <div className="flex justify-end gap-3">
              <button
                type="button"
                disabled={busy}
                onClick={onClose}
                className="cursor-pointer rounded-lg border border-gray-300 px-5 py-2.5 text-[#555] disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={busy}
                className="cursor-pointer rounded-lg bg-[#871dad] px-5 py-2.5 font-medium text-white hover:bg-[#751a99] disabled:opacity-50"
              >
                {busy ? "Creating..." : "Create Invitation"}
              </button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
