"use client";

import { FileText, Download } from "lucide-react";
import PageHeader from "@/components/sheard/PageHeader";

export default function LessonDetail({
  slug,
  studentSlug,
  subjectSlug,
  lessonSlug,
}: {
  slug: string;
  studentSlug: string;
  subjectSlug: string;
  lessonSlug: string;
}) {
  return (
    <div className="space-y-8 pt-10 mt-32">
      <PageHeader title="Lessons Overview" />
      {/* Topic */}
      <div>
        <h2 className="text-[30px] font-semibold text-[#333]">Topic</h2>
        <div className="mt-2 flex items-center justify-between max-w-[529px]">
          <p className="text-[20px] text-[#666]">Photosynthesis</p>
          <p className="text-[20px] text-[#666]">16/06/2025</p>
        </div>

        {/* PDF Attachment */}
        <div className="mt-4 flex max-w-[529px] items-center justify-between rounded-[10px] bg-white px-5 py-3 shadow-[0px_0px_20px_0px_rgba(6,51,54,0.1)]">
          <div className="flex items-center gap-3">
            <FileText size={22} className="text-[#871dad]" />
            <span className="text-[16px] text-[#333]">Photosynthesis PDF</span>
          </div>
          <button className="cursor-pointer text-[#871dad] hover:text-[#751a99] transition-colors">
            <Download size={24} />
          </button>
        </div>
      </div>

      {/* Description */}
      <div>
        <h2 className="text-[30px] font-semibold text-[#333]">Description</h2>
        <p className="mt-3 text-[20px]">
          <span className="font-medium text-[#333]">Workbook Task:</span>{" "}
          <span className="font-light text-[#666]">
            Complete page 42, Questions 1–5
          </span>
        </p>

        <div className="mt-6">
          <p className="text-[20px] font-medium text-[#333]">
            Questions to Think About:
          </p>
          <ul className="mt-2 list-disc space-y-2 pl-6">
            <li className="text-[20px] font-light text-[#666]">
              What is the main purpose of photosynthesis?
            </li>
            <li className="text-[20px] font-light text-[#666]">
              Why is sunlight important?
            </li>
            <li className="text-[20px] font-light text-[#666]">
              How do plants store energy?
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
