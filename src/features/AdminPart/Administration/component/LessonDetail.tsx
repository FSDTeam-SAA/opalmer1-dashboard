"use client";

import { FileText, Download } from "lucide-react";
import PageHeader from "@/components/sheard/PageHeader";
import { useLessonDetails } from "../hooks/useLessons";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";

export default function LessonDetail({
  slug: _slug,
  studentSlug: _studentSlug,
  subjectSlug: _subjectSlug,
  lessonSlug,
}: {
  slug?: string;
  studentSlug: string;
  subjectSlug: string;
  lessonSlug: string;
}) {
  const { data: lesson, isLoading, isError } = useLessonDetails(lessonSlug);

  if (isLoading) {
    return (
      <div className="space-y-8 pt-10 mt-32">
        <PageHeader title="Lessons Overview" />
        <Skeleton className="h-[40px] w-[200px]" />
        <Skeleton className="h-[100px] w-full rounded-[10px]" />
        <Skeleton className="h-[40px] w-[200px]" />
        <Skeleton className="h-[200px] w-full rounded-[10px]" />
      </div>
    );
  }

  if (isError || !lesson) {
    return (
      <div className="space-y-8 pt-10 mt-32">
        <PageHeader title="Lessons Overview" />
        <div className="rounded-[20px] bg-white p-10 text-center shadow-[0px_0px_20px_0px_rgba(0,0,0,0.08)]">
          <p className="text-[18px] font-medium text-[#e64540]">
            Failed to load lesson details
          </p>
        </div>
      </div>
    );
  }

  const dateStr = lesson.created_at
    ? format(new Date(lesson.created_at), "dd/MM/yyyy")
    : "N/A";

  const fileName = lesson.document?.url.split("/").pop() || "Lesson Attachment";

  return (
    <div className="space-y-8 pt-10 mt-32">
      <PageHeader title="Lessons Overview" />
      {/* Topic */}
      <div>
        <h2 className="text-[30px] font-semibold text-[#333]">Topic</h2>
        <div className="mt-2 flex items-center justify-between max-w-[529px]">
          <p className="text-[20px] text-[#666]">{lesson.title}</p>
          <p className="text-[20px] text-[#666]">{dateStr}</p>
        </div>

        {/* Attachment */}
        {lesson.document && (
          <div className="mt-4 flex max-w-[529px] items-center justify-between rounded-[10px] bg-white px-5 py-3 shadow-[0px_0px_20px_0px_rgba(6,51,54,0.1)]">
            <div className="flex items-center gap-3">
              <FileText size={22} className="text-[#871dad]" />
              <span className="text-[16px] text-[#333] truncate max-w-[300px]">
                {fileName}
              </span>
            </div>
            <a
              href={lesson.document.url}
              target="_blank"
              rel="noopener noreferrer"
              className="cursor-pointer text-[#871dad] hover:text-[#751a99] transition-colors"
            >
              <Download size={24} />
            </a>
          </div>
        )}
      </div>

      {/* Description */}
      <div>
        <h2 className="text-[30px] font-semibold text-[#333]">Description</h2>
        <div className="mt-3">
          <p className="text-[20px] font-medium text-[#333]">Objective:</p>
          <p className="text-[20px] font-light text-[#666]">
            {lesson.objective}
          </p>
        </div>

        <div className="mt-6">
          <p className="text-[20px] font-medium text-[#333]">Note:</p>
          <div
            className="mt-2 text-[20px] font-light text-[#666] whitespace-pre-wrap"
            dangerouslySetInnerHTML={{ __html: lesson.note }}
          />
        </div>
      </div>
    </div>
  );
}
