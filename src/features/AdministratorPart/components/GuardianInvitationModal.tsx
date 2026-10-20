"use client";

import styles from "@/components/ui/dashboard-modal.module.css";

import { useState, type FormEvent } from "react";
import { isAxiosError } from "axios";
import { api } from "@/lib/api";
import ParentPicker from "./ParentPicker";
import type { ParentRow } from "../api/parents.api";
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
  const [parent, setParent] = useState<ParentRow | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [invitation, setInvitation] = useState<Invitation | null>(null);

  async function create(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy || invitation) return;
    if (!parent) {
      setError("Select a parent from the list.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      const { data } = await api.post<{ data: Invitation }>(
        "/parent/child/invitations",
        {
          childId: student._id,
          parentId: parent._id,
        },
      );
      setInvitation(data.data);
    } catch (err) {
      setError(
        isAxiosError(err)
          ? err.response?.data?.message ||
              "Unable to send invitation. Please try again."
          : "Unable to send invitation. Please try again.",
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
        className={`${styles.panel} ${styles.compact} ${styles.dialog}`}
        showCloseButton={!busy}
      >
        <DialogHeader>
          <DialogTitle className="text-xl text-[#333]">
            Guardian Invitation
          </DialogTitle>
          <DialogDescription>
            Invite a verified guardian for {student.name}. Search and select a
            parent to send the invitation by email.
          </DialogDescription>
        </DialogHeader>
        {invitation ? (
          <div role="status" className="space-y-4">
            <p className="font-medium text-green-700">
              Invitation email sent to {invitation.parentEmail}.
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
              The email includes this code and instructions to link the child in
              the parent app. Only a parent account using this email can redeem
              it.
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
            <ParentPicker
              value={parent}
              onChange={(value) => {
                setParent(value);
                setError("");
              }}
              disabled={busy}
            />
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
                disabled={busy || !parent}
                className="cursor-pointer rounded-lg bg-[#871dad] px-5 py-2.5 font-medium text-white hover:bg-[#751a99] disabled:opacity-50"
              >
                {busy ? "Sending..." : "Send Invitation"}
              </button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
