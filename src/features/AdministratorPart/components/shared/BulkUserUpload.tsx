"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  createSchoolUser,
  type BulkUserPayload,
  type SchoolUserType,
} from "../../api/bulk-users.api";
import { parseUserCsv, userCsvColumns } from "../../lib/bulk-users";
import {
  runSchoolBatch,
  schoolError,
} from "@/features/AdminPart/School/lib/school-bulk";

export default function BulkUserUpload({
  type,
  onClose,
  onComplete,
}: {
  type: SchoolUserType;
  onClose: () => void;
  onComplete: () => void;
}) {
  const queryClient = useQueryClient();
  const [rows, setRows] = useState<BulkUserPayload[]>([]);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [reading, setReading] = useState(false);
  const [done, setDone] = useState(0);
  const [result, setResult] = useState<Awaited<
    ReturnType<typeof runSchoolBatch<BulkUserPayload>>
  > | null>(null);

  function downloadTemplate() {
    const url = URL.createObjectURL(
      new Blob(
        [
          userCsvColumns(type).join(",") +
            "\r\n" +
            (type === "parent"
              ? "Example Parent,PARENT-001,ChangeMe123!,parent@example.com,0123456789"
              : "Example User,USER-001,ChangeMe123!,user@example.com,0123456789,5,12,male") +
            "\r\n",
        ],
        { type: "text/csv;charset=utf-8" },
      ),
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = `${type}s-template.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  async function upload() {
    setBusy(true);
    setDone(0);
    setError("");
    try {
      const outcome = await runSchoolBatch(
        rows,
        (row) => createSchoolUser(type, row),
        setDone,
      );
      setResult(outcome);
      // Retrying submits only failed rows, never users already created.
      setRows(outcome.failed.map((f) => f.item));
      await queryClient.invalidateQueries({ queryKey: ["administrator"] });
      await queryClient.invalidateQueries({ queryKey: ["parents"] });
      await queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      onComplete();
    } finally {
      setBusy(false);
    }
  }

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open && !busy && !reading) onClose();
      }}
    >
      <DialogContent
        showCloseButton={!busy && !reading}
        className="max-h-[90dvh] overflow-y-auto sm:max-w-[720px]"
      >
        <DialogHeader>
          <DialogTitle>
            Bulk Upload{" "}
            {type === "student"
              ? "Students"
              : type === "teacher"
                ? "Teachers"
                : "Parents"}
          </DialogTitle>
          <DialogDescription>
            Upload a CSV with up to 500 users. Name, ID and password are
            required. Other columns are optional. Accounts are added to your
            assigned school.
          </DialogDescription>
        </DialogHeader>
        <button
          type="button"
          onClick={downloadTemplate}
          className="text-left text-[#871dad] underline"
        >
          Download CSV template
        </button>
        <label className="space-y-2 text-sm">
          Choose CSV file
          <input
            type="file"
            accept=".csv,text/csv"
            disabled={busy || reading}
            className="block w-full rounded border p-3"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              setRows([]);
              setError("");
              setResult(null);
              if (!file) return;
              setReading(true);
              try {
                if (file.size > 2 * 1024 * 1024)
                  throw new Error("File must be 2 MB or smaller.");
                setRows(parseUserCsv(await file.text(), type));
              } catch (err) {
                setError(schoolError(err));
              } finally {
                setReading(false);
              }
            }}
          />
        </label>
        {error && (
          <p role="alert" className="text-sm text-red-600">
            {error}
          </p>
        )}
        {result && (
          <div role="status" className="space-y-2 text-sm">
            <p>
              {result.succeeded.length} users created. {result.failed.length}{" "}
              failed.
            </p>
            <ul className="max-h-32 overflow-auto text-red-600">
              {result.failed.map((f, i) => (
                <li key={i}>
                  {f.item.username}: {f.error}
                </li>
              ))}
            </ul>
          </div>
        )}
        {rows.length > 0 && (
          <div className="max-h-52 overflow-auto text-sm">
            <p className="mb-2 font-medium">
              {rows.length} users{" "}
              {result ? "remaining for retry" : "ready to upload"}
            </p>
            <table className="w-full text-left">
              <thead>
                <tr>
                  <th className="p-2">Name</th>
                  <th className="p-2">ID</th>
                  <th className="p-2">Email</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={i} className="border-t">
                    <td className="p-2">{r.username}</td>
                    <td className="p-2">{r.Id || "—"}</td>
                    <td className="p-2">{r.email || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            disabled={busy || reading}
            onClick={onClose}
            className="rounded-lg border px-4 py-2 disabled:opacity-50"
          >
            Close
          </button>
          <button
            type="button"
            disabled={!rows.length || busy || reading}
            onClick={upload}
            className="rounded-lg bg-[#871dad] px-4 py-2 text-white disabled:opacity-50"
          >
            {busy
              ? `Uploading ${done}/${rows.length}...`
              : result
                ? "Retry Failed Users"
                : "Upload Users"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
