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
import { createSchool } from "../api/school.api";
import { schoolKeys } from "../hooks/useSchools";
import {
  parseSchoolCsv,
  runSchoolBatch,
  schoolColumns,
  schoolError,
} from "../lib/school-bulk";
import type { CreateSchoolPayload } from "../types/school.types";

export default function BulkSchoolUpload({ onClose }: { onClose: () => void }) {
  const queryClient = useQueryClient();
  const [rows, setRows] = useState<CreateSchoolPayload[]>([]);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [reading, setReading] = useState(false);
  const [done, setDone] = useState(0);
  const [result, setResult] = useState<Awaited<
    ReturnType<typeof runSchoolBatch<CreateSchoolPayload>>
  > | null>(null);

  function downloadTemplate() {
    const url = URL.createObjectURL(
      new Blob(
        [
          schoolColumns.join(",") +
            "\r\nExample School,EXAMPLE-001,school@example.com,0123456789,School Road,Dhaka,Dhaka,Bangladesh,1200,2000\r\n",
        ],
        { type: "text/csv;charset=utf-8" },
      ),
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = "schools-template.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  async function upload() {
    setBusy(true);
    setDone(0);
    setError("");
    try {
      const outcome = await runSchoolBatch(rows, createSchool, setDone);
      setResult(outcome);
      // Retrying submits only failed rows, never schools already created.
      setRows(outcome.failed.map((f) => f.item));
      await queryClient.invalidateQueries({ queryKey: schoolKeys.all });
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
          <DialogTitle>Bulk Upload Schools</DialogTitle>
          <DialogDescription>
            Upload a CSV with up to 500 schools. School name is required; other
            template columns are optional. Use unique school names and codes.
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
                setRows(parseSchoolCsv(await file.text()));
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
              {result.succeeded.length} schools created. {result.failed.length}{" "}
              failed.
            </p>
            <ul className="max-h-32 overflow-auto text-red-600">
              {result.failed.map((f, i) => (
                <li key={i}>
                  {f.item.name}: {f.error}
                </li>
              ))}
            </ul>
          </div>
        )}
        {rows.length > 0 && (
          <div className="max-h-52 overflow-auto text-sm">
            <p className="mb-2 font-medium">
              {rows.length} schools{" "}
              {result ? "remaining for retry" : "ready to upload"}
            </p>
            <table className="w-full text-left">
              <thead>
                <tr>
                  <th className="p-2">School Name</th>
                  <th className="p-2">Code</th>
                  <th className="p-2">Email</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={i} className="border-t">
                    <td className="p-2">{r.name}</td>
                    <td className="p-2">{r.code || "—"}</td>
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
                ? "Retry Failed Schools"
                : "Upload Schools"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
