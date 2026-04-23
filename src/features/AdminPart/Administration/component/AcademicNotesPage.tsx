"use client";

import { FileText, Download } from "lucide-react";
import PageHeader from "@/components/sheard/PageHeader";

const academicNotes = Array.from({ length: 14 }, (_, i) => ({
  id: i + 1,
  name: "Academic Notes PDF",
}));

export default function AcademicNotesPage({
  slug,
  studentSlug,
  subjectSlug,
}: {
  slug?: string;
  studentSlug: string;
  subjectSlug: string;
}) {
  return (
    <div className="pt-10 mt-32">
      <PageHeader title="Academic Documents" />
      <div className="grid grid-cols-2 gap-5">
        {academicNotes.map((note) => (
          <div
            key={note.id}
            className="flex items-center justify-between rounded-[10px] bg-white px-5 py-4 shadow-[0px_0px_20px_0px_rgba(0,0,0,0.1)]"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-[32px] w-[32px] items-center justify-center rounded-full bg-[#f3e8ff]">
                <FileText size={18} className="text-[#871dad]" />
              </div>
              <span className="text-[20px] text-[#333]">{note.name}</span>
            </div>
            <button className="flex h-[28px] w-[28px] cursor-pointer items-center justify-center rounded-full bg-[#871dad] text-white hover:bg-[#751a99] transition-colors">
              <Download size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
