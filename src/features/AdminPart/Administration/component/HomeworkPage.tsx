"use client";

import { CalendarDays } from "lucide-react";
import PageHeader from "@/components/sheard/PageHeader";

import { useHomework } from "../hooks/useHomework";
import { Skeleton } from "@/components/ui/skeleton";
import { HomeworkData } from "../types/homework.types";
import { format } from "date-fns";

/* ───── Homework Card ───── */
function HomeworkCard({ homework }: { homework: HomeworkData }) {
  const dateStr = homework.created_at
    ? format(new Date(homework.created_at), "MMMM d, yyyy")
    : "N/A";

  return (
    <div className="rounded-[10px] bg-white px-5 py-5 shadow-[0px_0px_20px_0px_rgba(6,51,54,0.1)]">
      <h3 className="text-[22px] font-medium text-black">{homework.title}</h3>
      <p className="mt-2 text-[18px] font-light text-[#666]">
        {homework.description || "No description provided."}
      </p>
      {homework.file && homework.file.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {homework.file.map((f) => (
            <a
              key={f._id}
              href={f.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[14px] text-[#871dad] underline"
            >
              View File
            </a>
          ))}
        </div>
      )}
      <div className="my-3 h-[1px] bg-gray-200" />
      <p className="text-[14px] font-light text-[#666]">Created: {dateStr}</p>
    </div>
  );
}

export default function HomeworkPage({
  slug: _slug,
  studentSlug,
  subjectSlug: _subjectSlug,
}: {
  slug?: string;
  studentSlug: string;
  subjectSlug: string;
}) {
  const { data: homework = [], isLoading, isError } = useHomework(studentSlug);

  const activeHomework = homework.filter((hw) => !hw.archived);
  const archivedHomework = homework.filter((hw) => hw.archived);

  if (isLoading) {
    return (
      <div className="space-y-8 pt-10 mt-32">
        <PageHeader title="Homework" />
        <Skeleton className="h-[200px] w-full rounded-[10px]" />
        <div className="grid grid-cols-2 gap-5">
          <Skeleton className="h-[150px] rounded-[10px]" />
          <Skeleton className="h-[150px] rounded-[10px]" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-8 pt-10 mt-32">
        <PageHeader title="Homework" />
        <div className="rounded-[20px] bg-white p-10 text-center shadow-[0px_0px_20px_0px_rgba(0,0,0,0.08)]">
          <p className="text-[18px] font-medium text-[#e64540]">
            Failed to load homework
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pt-10 mt-32">
      <PageHeader title="Homework" />
      {/* Active Homework */}
      <div>
        <h2 className="text-[30px] font-semibold text-[#333]">
          Active Homework
        </h2>
        <div className="mt-4 grid grid-cols-2 gap-5">
          {activeHomework.map((hw) => (
            <HomeworkCard key={hw._id} homework={hw} />
          ))}
          {activeHomework.length === 0 && (
            <p className="text-gray-500">No active homework found.</p>
          )}
        </div>
      </div>

      {/* Archived Homework */}
      <div>
        <div className="flex items-center justify-between">
          <h2 className="text-[30px] font-semibold text-[#333]">
            Archived Homework
          </h2>
          <button className="cursor-pointer text-[#871dad] hover:text-[#751a99] transition-colors">
            <CalendarDays size={32} />
          </button>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-5">
          {archivedHomework.map((hw) => (
            <HomeworkCard key={hw._id} homework={hw} />
          ))}
          {archivedHomework.length === 0 && (
            <p className="text-gray-500">No archived homework found.</p>
          )}
        </div>
      </div>
    </div>
  );
}
