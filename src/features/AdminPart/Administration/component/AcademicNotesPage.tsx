"use client";

import { FileText, Download } from "lucide-react";
import PageHeader from "@/components/sheard/PageHeader";

import { useAcademicNotes } from "../hooks/useAcademicNotes";
import { Skeleton } from "@/components/ui/skeleton";

export default function AcademicNotesPage({
  slug: _slug,
  studentSlug,
  subjectSlug,
}: {
  slug?: string;
  studentSlug: string;
  subjectSlug: string;
}) {
  const subjectName = subjectSlug.replace(/-/g, " ");
  const {
    data: documents = [],
    isLoading,
    isError,
  } = useAcademicNotes(studentSlug);

  // Display all documents for the student as requested in the example
  const subjectDocuments = documents;

  if (isLoading) {
    return (
      <div className="pt-10 mt-32">
        <PageHeader title="Academic Documents" />
        <div className="grid grid-cols-2 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-[60px] rounded-[10px]" />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="pt-10 mt-32">
        <PageHeader title="Academic Documents" />
        <div className="rounded-[20px] bg-white p-10 text-center shadow-[0px_0px_20px_0px_rgba(0,0,0,0.08)]">
          <p className="text-[18px] font-medium text-[#e64540]">
            Failed to load academic documents
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-10 mt-32">
      <PageHeader title="Academic Documents" />
      <div className="grid grid-cols-2 gap-5">
        {subjectDocuments.map((doc) => {
          const fileName = doc.document.url.split("/").pop() || "Document";
          return (
            <div
              key={doc._id}
              className="flex items-center justify-between rounded-[10px] bg-white px-5 py-4 shadow-[0px_0px_20px_0px_rgba(0,0,0,0.1)]"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-[32px] w-[32px] items-center justify-center rounded-full bg-[#f3e8ff]">
                  <FileText size={18} className="text-[#871dad]" />
                </div>
                <span className="text-[18px] text-[#333] truncate max-w-[200px]">
                  {doc.classId.subject} - {fileName}
                </span>
              </div>
              <a
                href={doc.document.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-[28px] w-[28px] cursor-pointer items-center justify-center rounded-full bg-[#871dad] text-white hover:bg-[#751a99] transition-colors"
              >
                <Download size={14} />
              </a>
            </div>
          );
        })}
        {subjectDocuments.length === 0 && (
          <p className="text-gray-500">
            No academic documents found for {subjectName}.
          </p>
        )}
      </div>
    </div>
  );
}
