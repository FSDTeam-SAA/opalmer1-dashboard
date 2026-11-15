"use client";

import styles from "@/components/ui/dashboard-modal.module.css";

import { useState } from "react";
import { X } from "lucide-react";

export default function EditModal({
  title,
  question,
  answer,
  onClose,
  onSave,
}: {
  title: string;
  question: string;
  answer: string;
  onClose: () => void;
  onSave: (question: string, answer: string) => void | Promise<void>;
}) {
  const [q, setQ] = useState(question);
  const [a, setA] = useState(answer);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  async function save() {
    if (saving) return;
    if (!q.trim() || !a.trim()) {
      setError("Question and answer are required.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await onSave(q.trim(), a.trim());
    } catch {
      setError("Unable to save. Your text has been kept; please retry.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-[3px]"
      onClick={() => {
        if (!saving) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={styles.panel}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          disabled={saving}
          aria-label="Close editor"
          className="absolute right-5 top-5 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-[#666] hover:bg-gray-100 transition-colors"
        >
          <X size={20} />
        </button>

        {/* Title */}
        <h2 className="text-center text-[24px] font-bold text-[#333]">
          {title}
        </h2>

        {/* Form */}
        <div className="mt-8 space-y-5">
          <div>
            <label
              htmlFor="help-question"
              className="block text-[16px] font-bold text-[#333]"
            >
              Question
            </label>
            <input
              id="help-question"
              type="text"
              placeholder="Enter question"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="mt-2 h-[50px] w-full rounded-[8px] border border-[#c7c7c7] bg-white px-4 text-[16px] text-[#333] outline-none placeholder:text-[#999]"
            />
          </div>
          <div>
            <label
              htmlFor="help-answer"
              className="block text-[16px] font-bold text-[#333]"
            >
              Answer
            </label>
            <textarea
              id="help-answer"
              placeholder="Enter answer"
              value={a}
              onChange={(e) => setA(e.target.value)}
              className="mt-2 h-[50px] w-full rounded-[8px] border border-[#c7c7c7] bg-white px-4 text-[16px] text-[#333] outline-none placeholder:text-[#999]"
            />
          </div>
          {error && <p role="alert">{error}</p>}
          <button
            onClick={() => void save()}
            disabled={saving}
            className="h-[50px] w-full cursor-pointer rounded-[10px] bg-[#871dad] text-[18px] font-bold uppercase text-white hover:bg-[#751a99] transition-colors"
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
