"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Edit3 } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  usePolicyContent,
  useCreateAboutOrTerm,
  useUpdateAboutOrTerm,
} from "../hooks/useAboutAndTerm";
import type { AboutOrTermDocType } from "../types/settings.types";

const Editor = dynamic(() => import("./PolicyQuillEditor"), {
  ssr: false,
  loading: () => <p className="p-6">Loading editor...</p>,
});
const Preview = dynamic(() => import("./PolicyHtmlPreview"), {
  ssr: false,
  loading: () => <p>Loading content...</p>,
});

function richHtml(content: string) {
  if (/<\/?[a-z][^>]*>/i.test(content)) return content;
  const text = content
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  return text
    .split(/\n\s*\n/)
    .map((p) => `<p>${p.replace(/\r?\n/g, "<br>")}</p>`)
    .join("");
}

function EditPolicy({
  title,
  content,
  saving,
  error,
  onClose,
  onSave,
}: {
  title: string;
  content: string;
  saving: boolean;
  error: string;
  onClose: () => void;
  onSave: (html: string) => Promise<void>;
}) {
  const [html, setHtml] = useState(() => richHtml(content));
  const hasText =
    html
      .replace(/<[^>]*>/g, "")
      .replace(/&(?:nbsp|#160);/gi, " ")
      .trim().length > 0;
  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open && !saving) onClose();
      }}
    >
      <DialogContent className="flex max-h-[92dvh] w-[calc(100vw-24px)] max-w-4xl sm:max-w-4xl flex-col overflow-y-auto bg-white p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle>Edit {title}</DialogTitle>
          <DialogDescription>
            Save and publish this content to the teacher, student and parent
            app.
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            if (hasText && !saving) void onSave(html);
          }}
          className="min-w-0 space-y-4"
        >
          <Editor value={html} onChange={setHtml} readOnly={saving} />
          <details className="rounded-lg border p-3">
            <summary className="cursor-pointer font-medium">Preview</summary>
            <div className="mt-4">
              <Preview html={html} />
            </div>
          </details>
          {error && (
            <p role="alert" className="text-sm text-red-600">
              {error}
            </p>
          )}
          <div className="flex flex-wrap justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="rounded-lg border px-5 py-2 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || !hasText}
              className="rounded-lg bg-[#871dad] px-5 py-2 font-semibold text-white disabled:opacity-50"
            >
              {saving ? "Publishing..." : "Save & publish"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function PolicyContent({
  docType,
  readOnly = false,
}: {
  docType: AboutOrTermDocType;
  readOnly?: boolean;
}) {
  const title = docType === "about" ? "About Us" : "Terms and Conditions";
  const query = usePolicyContent(docType);
  const create = useCreateAboutOrTerm();
  const update = useUpdateAboutOrTerm();
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState("");
  const saving = create.isPending || update.isPending;
  const save = async (description: string) => {
    setError("");
    try {
      if (query.data?._id)
        await update.mutateAsync({
          id: query.data._id,
          payload: { docType, description },
        });
      else await create.mutateAsync({ docType, description });
      setEditing(false);
      toast.success(`${title} published`);
    } catch {
      setError("Could not publish. Your changes are still here. Please retry.");
    }
  };
  return (
    <section className="min-w-0 space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-xl font-semibold sm:text-2xl">{title}</h2>
        {!readOnly && (
          <button
            disabled={query.isLoading || query.isError}
            onClick={() => {
              setError("");
              setEditing(true);
            }}
            aria-label={`Edit ${title}`}
            className="rounded-lg p-2 text-[#871dad] hover:bg-purple-50 disabled:opacity-50"
          >
            <Edit3 size={22} />
          </button>
        )}
      </div>
      {query.isLoading && <p>Loading content...</p>}
      {query.isError && (
        <div role="alert">
          <p>Unable to load {title}.</p>
          <button
            onClick={() => void query.refetch()}
            className="mt-2 text-purple-700 underline"
          >
            Retry
          </button>
        </div>
      )}
      {!query.isLoading &&
        !query.isError &&
        (query.data?.description ? (
          <Preview html={richHtml(query.data.description)} />
        ) : (
          <p className="text-gray-500">
            {readOnly
              ? "No content published yet."
              : "No content published yet. Use Edit to add it."}
          </p>
        ))}
      {query.data?.updatedAt && (
        <p className="text-sm text-gray-500">
          Last published: {new Date(query.data.updatedAt).toLocaleString()}
        </p>
      )}
      {editing && !readOnly && (
        <EditPolicy
          title={title}
          content={query.data?.description ?? ""}
          saving={saving}
          error={error}
          onClose={() => setEditing(false)}
          onSave={save}
        />
      )}
    </section>
  );
}
