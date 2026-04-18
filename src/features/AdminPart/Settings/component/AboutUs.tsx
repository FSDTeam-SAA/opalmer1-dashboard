"use client";

import { useState } from "react";
import { Edit3, X } from "lucide-react";
import {
  useAbout,
  useCreateAboutOrTerm,
  useUpdateAboutOrTerm,
} from "../hooks/useAboutAndTerm";

function EditAboutModal({
  content,
  saving,
  onClose,
  onSave,
}: {
  content: string;
  saving: boolean;
  onClose: () => void;
  onSave: (content: string) => void;
}) {
  const [text, setText] = useState(content);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(18,18,18,0.4)]"
      onClick={onClose}
    >
      <div
        className="relative max-h-[90vh] w-[629px] overflow-hidden rounded-[20px] bg-white shadow-[0px_0px_20px_0px_rgba(6,51,54,0.1)]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-5 top-5 z-10 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-[#666] hover:bg-gray-100 transition-colors"
        >
          <X size={20} />
        </button>

        <div className="flex flex-col p-10">
          <h2 className="text-center text-[24px] font-bold text-[#333]">
            Edit About Us
          </h2>

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="mt-6 h-[500px] w-full resize-none rounded-[10px] border border-[#c7c7c7] bg-white p-5 text-[16px] leading-[1.6] text-[#333] outline-none placeholder:text-[#999]"
            placeholder="Write about us content..."
          />

          <button
            onClick={() => onSave(text)}
            disabled={saving}
            className="mt-6 h-[50px] w-full cursor-pointer rounded-[10px] bg-[#871dad] text-[18px] font-bold uppercase text-white hover:bg-[#751a99] transition-colors disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}

function RenderAboutContent({ content }: { content: string }) {
  const paragraphs = content.split("\n\n");

  return (
    <div className="mt-6 space-y-6 text-[20px] leading-[1.6] text-[#666]">
      {paragraphs.map((block, i) => {
        const lines = block.split("\n");
        const firstLine = lines[0];

        const isHeading =
          firstLine === "Our Mission" ||
          firstLine === "What We Do" ||
          firstLine === "Why It Matters" ||
          firstLine === "Key Features Include:";

        if (isHeading && lines.length === 1) {
          return (
            <h3 key={i} className="text-[22px] font-medium text-[#333]">
              {firstLine}
            </h3>
          );
        }

        if (isHeading && lines.length > 1) {
          return (
            <div key={i}>
              <h3 className="text-[22px] font-medium text-[#333]">
                {firstLine}
              </h3>
              {lines.slice(1).map((line, j) => (
                <p key={j} className="mt-1">
                  {line}
                </p>
              ))}
            </div>
          );
        }

        return (
          <div key={i}>
            {lines.map((line, j) => (
              <p key={j} className={j > 0 ? "mt-1" : ""}>
                {line}
              </p>
            ))}
          </div>
        );
      })}
    </div>
  );
}

export default function AboutUs() {
  const { data: aboutDoc, isLoading, isError } = useAbout();
  const createAbout = useCreateAboutOrTerm();
  const updateAbout = useUpdateAboutOrTerm();

  const [showEditModal, setShowEditModal] = useState(false);

  const content = aboutDoc?.description ?? "";
  const saving = createAbout.isPending || updateAbout.isPending;

  const handleSave = async (next: string) => {
    try {
      if (aboutDoc?._id) {
        await updateAbout.mutateAsync({
          id: aboutDoc._id,
          payload: { docType: "about", description: next },
        });
      } else {
        await createAbout.mutateAsync({
          docType: "about",
          description: next,
        });
      }
      setShowEditModal(false);
    } catch {
      // Error surfaces via mutation state; keep modal open.
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="text-[24px] font-semibold tracking-[0.3px] text-[#121212]">
          About Us
        </h2>
        <button
          onClick={() => setShowEditModal(true)}
          className="cursor-pointer text-[#871dad] hover:text-[#751a99] transition-colors"
        >
          <Edit3 size={22} />
        </button>
      </div>

      {isLoading && <p className="mt-6 text-[16px] text-[#666]">Loading...</p>}
      {isError && (
        <p className="mt-6 text-[16px] text-[#e64540]">
          Failed to load About Us content.
        </p>
      )}
      {!isLoading && !isError && content && (
        <RenderAboutContent content={content} />
      )}
      {!isLoading && !isError && !content && (
        <p className="mt-6 text-[16px] text-[#999]">
          No About Us content yet. Click the edit icon to add.
        </p>
      )}

      {showEditModal && (
        <EditAboutModal
          content={content}
          saving={saving}
          onClose={() => setShowEditModal(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
