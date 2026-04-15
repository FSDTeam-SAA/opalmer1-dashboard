"use client";

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
  onSave: (question: string, answer: string) => void;
}) {
  const [q, setQ] = useState(question);
  const [a, setA] = useState(answer);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(18,18,18,0.4)]"
      onClick={onClose}
    >
      <div
        className="relative w-[480px] rounded-[20px] bg-white px-10 py-10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
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
            <label className="block text-[16px] font-bold text-[#333]">
              Question
            </label>
            <input
              type="text"
              placeholder="write"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="mt-2 h-[50px] w-full rounded-[8px] border border-[#c7c7c7] bg-white px-4 text-[16px] text-[#333] outline-none placeholder:text-[#999]"
            />
          </div>
          <div>
            <label className="block text-[16px] font-bold text-[#333]">
              Answer
            </label>
            <input
              type="text"
              placeholder="write"
              value={a}
              onChange={(e) => setA(e.target.value)}
              className="mt-2 h-[50px] w-full rounded-[8px] border border-[#c7c7c7] bg-white px-4 text-[16px] text-[#333] outline-none placeholder:text-[#999]"
            />
          </div>
          <button
            onClick={() => onSave(q, a)}
            className="h-[50px] w-full cursor-pointer rounded-[10px] bg-[#871dad] text-[18px] font-bold uppercase text-white hover:bg-[#751a99] transition-colors"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
