"use client";

import { useState } from "react";
import ListPagination, {
  useListPagination,
} from "@/components/shared/ListPagination";
import { toast } from "sonner";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import CsvTemplateExample from "@/components/shared/CsvTemplateExample";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { api } from "@/lib/api";
import { schoolKeys } from "../hooks/useSchools";
import { schoolError } from "../lib/school-bulk";

type ImportRow = {
  row: number;
  values: Record<string, string>;
  status: "ready" | "error" | "created";
  error?: string;
};
type ImportResult = {
  committed: boolean;
  rows: ImportRow[];
  total: number;
  ready: number;
  created: number;
  failed: number;
};
const columns = {
  schools: [
    "name",
    "code",
    "districtCode",
    "email",
    "phone",
    "address",
    "city",
    "state",
    "country",
    "postalCode",
    "establishedYear",
  ],
  districts: [
    "name",
    "code",
    "email",
    "phone",
    "address",
    "city",
    "state",
    "country",
    "postalCode",
  ],
};

function csvCell(value: string) {
  // Spreadsheet programs must not evaluate error-report values as formulas.
  const safe = /^[=+@\-\t\r]/.test(value) ? "'" + value : value;
  return '"' + safe.replaceAll('"', '""') + '"';
}
function download(name: string, content: string) {
  const url = URL.createObjectURL(
    new Blob([content], { type: "text/csv;charset=utf-8" }),
  );
  const link = document.createElement("a");
  link.href = url;
  link.download = name;
  link.click();
  URL.revokeObjectURL(url);
}

export default function BulkSchoolUpload({ onClose }: { onClose: () => void }) {
  const queryClient = useQueryClient();
  const districts = useQuery({
    queryKey: ["school-districts"],
    queryFn: async () =>
      (
        await api.get<{ data: { _id: string; name: string; code: string }[] }>(
          "/school/districts",
        )
      ).data.data,
  });
  const [kind, setKind] = useState<"schools" | "districts">("schools");
  const [csv, setCsv] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);
  const pagination = useListPagination(result?.rows ?? [], kind);

  async function preview(text: string) {
    const { data } = await api.post<{ data: ImportResult }>("/school/import", {
      csv: text,
      kind,
      commit: false,
    });
    setResult(data.data);
  }
  async function commit() {
    setBusy(true);
    setError("");
    try {
      const { data } = await api.post<{ data: ImportResult }>(
        "/school/import",
        { csv, kind, commit: true },
      );
      setResult(data.data);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: schoolKeys.all }),
        queryClient.invalidateQueries({ queryKey: ["school-districts"] }),
      ]);
      if (data.data.committed && data.data.failed === 0) {
        toast.success(`${data.data.created} ${kind} imported successfully.`);
        onClose();
      }
    } catch (err) {
      // A lost response may follow a successful save. Re-preview before retrying.
      setResult(null);
      setError(
        schoolError(err) +
          ". Preview again before retrying; some records may already have been saved.",
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
        showCloseButton={!busy}
        className="max-h-[90dvh] overflow-y-auto sm:max-w-[800px]"
      >
        <DialogHeader>
          <DialogTitle>Upload Schools & Districts</DialogTitle>
          <DialogDescription>
            1. Import districts first. 2. Add their codes to the school
            template. 3. Preview and confirm. Existing records are never
            overwritten. Up to 500 records and 512 KB per CSV.
          </DialogDescription>
        </DialogHeader>
        <label className="text-sm">
          Upload type
          <select
            aria-label="Upload type"
            disabled={busy}
            value={kind}
            onChange={(e) => {
              setKind(e.target.value as typeof kind);
              setCsv("");
              setResult(null);
              setError("");
            }}
            className="ml-3 rounded border p-2"
          >
            <option value="schools">Schools</option>
            <option value="districts">Districts</option>
          </select>
        </label>
        <button
          type="button"
          onClick={() =>
            download(kind + "-template.csv", columns[kind].join(",") + "\r\n")
          }
          className="text-left text-[#871dad] underline"
        >
          Download CSV template
        </button>
        <CsvTemplateExample
          columns={columns[kind]}
          requiredColumns={
            kind === "schools"
              ? ["name", "code", "districtCode"]
              : ["name", "code"]
          }
          example={{
            name: kind === "schools" ? "Example School" : "Example District",
            code: kind === "schools" ? "SCH001" : "DIST001",
            districtCode: districts.data?.[0]?.code ?? "DIST001",
            email:
              kind === "schools"
                ? "school@example.com"
                : "district@example.com",
            phone: "0123456789",
            address: "123 Main Road",
            city: "Dhaka",
            state: "Dhaka",
            country: "Bangladesh",
            postalCode: "1207",
            establishedYear: "2010",
          }}
        />
        {kind === "schools" && (
          <p className="text-sm text-muted-foreground">
            Use an existing code from Available district codes for districtCode.
            DIST001 is only an example unless you have created that district.
            Enter establishedYear as a four-digit year, such as 2010.
          </p>
        )}
        <p className="text-sm">
          Name and code are required. Schools also need an existing
          districtCode. New schools can also be linked to districts in Edit
          School. Uploading does not create user accounts or class assignments.
        </p>
        <details className="text-sm">
          <summary>Available district codes</summary>
          {districts.isLoading && <p>Loading districts...</p>}
          {districts.isError && (
            <p role="alert">
              Unable to load districts.{" "}
              <button type="button" onClick={() => districts.refetch()}>
                Retry
              </button>
            </p>
          )}
          {districts.data?.length === 0 && (
            <p>No districts yet. Import districts first.</p>
          )}
          <ul className="max-h-32 overflow-auto">
            {districts.data?.map((d) => (
              <li key={d._id}>
                {d.code} - {d.name}
              </li>
            ))}
          </ul>
        </details>
        <label className="space-y-2 text-sm">
          Choose CSV file
          <input
            key={kind}
            type="file"
            accept=".csv,text/csv"
            disabled={busy}
            className="block w-full rounded border p-3"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              setCsv("");
              setResult(null);
              setError("");
              if (!file) return;
              setBusy(true);
              try {
                if (file.size > 512 * 1024)
                  throw new Error("File must be 512 KB or smaller");
                const text = await file.text();
                setCsv(text);
                await preview(text);
              } catch (err) {
                setError(schoolError(err));
              } finally {
                setBusy(false);
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
          <>
            <p role="status">
              {result.committed
                ? result.created + " created"
                : result.ready + " ready"}
              ; {result.failed} failed; {result.total} total.
            </p>
            <div className="max-h-64 overflow-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr>
                    <th>CSV line</th>
                    <th>Name</th>
                    <th>Code</th>
                    <th>District</th>
                    <th>Status / issue</th>
                  </tr>
                </thead>
                <tbody>
                  {pagination.items.map((r) => (
                    <tr key={r.row} className="border-t">
                      <td className="p-2">{r.row}</td>
                      <td>{r.values.name}</td>
                      <td>{r.values.code}</td>
                      <td>{r.values.districtCode || "-"}</td>
                      <td
                        className={r.status === "error" ? "text-red-600" : ""}
                      >
                        {r.error || r.status}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <ListPagination {...pagination} />
            {result.failed > 0 && (
              <button
                type="button"
                className="text-left underline"
                onClick={() =>
                  download(
                    kind + "-errors.csv",
                    [
                      ["row", ...columns[kind], "error"].map(csvCell).join(","),
                      ...result.rows
                        .filter((r) => r.status === "error")
                        .map((r) =>
                          [
                            String(r.row),
                            ...columns[kind].map((c) => r.values[c] || ""),
                            r.error || "",
                          ]
                            .map(csvCell)
                            .join(","),
                        ),
                    ].join("\r\n"),
                  )
                }
              >
                Download error report
              </button>
            )}
            {result.committed && (
              <p className="text-sm">
                Correct failed rows in the original template and upload them
                again. Do not include rows already created.
              </p>
            )}
          </>
        )}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            disabled={busy}
            onClick={onClose}
            className="rounded border px-4 py-2"
          >
            Close
          </button>
          {csv && !result && (
            <button
              type="button"
              disabled={busy}
              onClick={async () => {
                setBusy(true);
                setError("");
                try {
                  await preview(csv);
                } catch (err) {
                  setError(schoolError(err));
                } finally {
                  setBusy(false);
                }
              }}
              className="rounded border px-4 py-2"
            >
              Preview again
            </button>
          )}
          <button
            type="button"
            disabled={busy || !result?.ready || result.committed}
            onClick={commit}
            className="rounded bg-[#871dad] px-4 py-2 text-white disabled:opacity-50"
          >
            {busy ? "Processing..." : "Confirm import of valid rows"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
