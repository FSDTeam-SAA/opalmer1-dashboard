"use client";

import Link from "next/link";
import { CalendarDays } from "lucide-react";
import PageHeader from "@/components/sheard/PageHeader";

import { useLessons } from "../hooks/useLessons";
import { Skeleton } from "@/components/ui/skeleton";
import { LessonData } from "../types/lesson.types";
import { format } from "date-fns";

/* ───── Lesson Card ───── */
function LessonCard({ lesson, href }: { lesson: LessonData; href: string }) {
  const dateStr = lesson.created_at
    ? format(new Date(lesson.created_at), "MMMM d, yyyy")
    : "N/A";

  return (
    <div className="rounded-[10px] bg-white px-5 py-5 shadow-[0px_0px_20px_0px_rgba(6,51,54,0.1)]">
      <h3 className="text-[22px] font-medium text-black">{lesson.title}</h3>
      <p className="mt-2 text-[18px] font-light text-[#666]">
        {lesson.objective}
      </p>
      <div className="my-3 h-[1px] bg-gray-200" />
      <div className="flex items-center justify-between">
        <p className="text-[14px] font-light text-[#666]">Created: {dateStr}</p>
        <Link
          href={href}
          className="text-[20px] text-[#4aa678] underline hover:text-[#3d8f66] transition-colors"
        >
          View
        </Link>
      </div>
    </div>
  );
}

export default function LessonsPage({
  slug,
  studentSlug,
  subjectSlug,
  basePath = "/admin/administration",
}: {
  slug?: string;
  studentSlug: string;
  subjectSlug: string;
  basePath?: string;
}) {
  const prefix = slug ? `${basePath}/${slug}` : `${basePath}`;
  const subjectName = subjectSlug.replace(/-/g, " ");

  const { data: lessons = [], isLoading, isError } = useLessons(studentSlug);

  // Filter lessons for this specific subject
  const subjectLessons = lessons.filter(
    (l) => l.classId.subject.toLowerCase() === subjectName.toLowerCase(),
  );

  const activeLessons = subjectLessons.filter((l) => !l.isArchived);
  const archivedLessons = subjectLessons.filter((l) => l.isArchived);

  if (isLoading) {
    return (
      <div className="space-y-8 pt-10 mt-32">
        <PageHeader title="Lessons" />
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
        <PageHeader title="Lessons" />
        <div className="rounded-[20px] bg-white p-10 text-center shadow-[0px_0px_20px_0px_rgba(0,0,0,0.08)]">
          <p className="text-[18px] font-medium text-[#e64540]">
            Failed to load lessons
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pt-10 mt-32">
      <PageHeader title="Lessons" />

      {/* Active Lessons */}
      <div>
        <h2 className="text-[30px] font-semibold text-[#333]">
          Active Lessons
        </h2>
        <div className="mt-4 grid grid-cols-2 gap-5">
          {activeLessons.map((lesson) => (
            <LessonCard
              key={lesson._id}
              lesson={lesson}
              href={`${prefix}/students/${studentSlug}/${subjectSlug}/lessons/${lesson._id}`}
            />
          ))}
          {activeLessons.length === 0 && (
            <p className="text-gray-500">
              No active lessons found for {subjectName}.
            </p>
          )}
        </div>
      </div>

      {/* Archived Lessons */}
      <div>
        <div className="flex items-center justify-between">
          <h2 className="text-[30px] font-semibold text-[#333]">
            Archived Lessons
          </h2>
          <button className="cursor-pointer text-[#871dad] hover:text-[#751a99] transition-colors">
            <CalendarDays size={32} />
          </button>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-5">
          {archivedLessons.map((lesson) => (
            <LessonCard
              key={lesson._id}
              lesson={lesson}
              href={`${prefix}/students/${studentSlug}/${subjectSlug}/lessons/${lesson._id}`}
            />
          ))}
          {archivedLessons.length === 0 && (
            <p className="text-gray-500">No archived lessons found.</p>
          )}
        </div>
      </div>
    </div>
  );
}
