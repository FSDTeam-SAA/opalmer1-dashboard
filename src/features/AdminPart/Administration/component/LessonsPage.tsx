"use client";

import Link from "next/link";
import { CalendarDays } from "lucide-react";
import PageHeader from "@/components/sheard/PageHeader";

/* ───── Lesson Data ───── */
const todaysLesson = {
  id: 1,
  title: "Fractions Practice",
  description: "Solve question 1-10 on page 42 of the textbook.",
  due: "June 13,2025",
};

const archivedLessons = Array.from({ length: 12 }, (_, i) => ({
  id: i + 2,
  title: "Fractions Practice",
  description: "Solve question 1-10 on page 42 of the textbook.",
  due: "June 13,2025",
}));

/* ───── Lesson Card ───── */
function LessonCard({
  lesson,
  href,
}: {
  lesson: { id: number; title: string; description: string; due: string };
  href: string;
}) {
  return (
    <div className="rounded-[10px] bg-white px-5 py-5 shadow-[0px_0px_20px_0px_rgba(6,51,54,0.1)]">
      <h3 className="text-[22px] font-medium text-black">{lesson.title}</h3>
      <p className="mt-2 text-[18px] font-light text-[#666]">
        {lesson.description}
      </p>
      <div className="my-3 h-[1px] bg-gray-200" />
      <div className="flex items-center justify-between">
        <p className="text-[14px] font-light text-[#666]">Due: {lesson.due}</p>
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
}: {
  slug: string;
  studentSlug: string;
  subjectSlug: string;
}) {
  return (
    <div className="space-y-8 pt-10 mt-32">
      <PageHeader title="Lessons" />
      {/* Today's Lesson */}
      <div>
        <h2 className="text-[30px] font-semibold text-[#333]">
          Today&apos;s Lesson
        </h2>
        <div className="mt-4 max-w-[529px]">
          <LessonCard
            lesson={todaysLesson}
            href={`/admin/administration/${slug}/students/${studentSlug}/${subjectSlug}/lessons/${todaysLesson.id}`}
          />
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
              key={lesson.id}
              lesson={lesson}
              href={`/admin/administration/${slug}/students/${studentSlug}/${subjectSlug}/lessons/${lesson.id}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
