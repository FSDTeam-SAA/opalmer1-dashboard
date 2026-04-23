"use client";

import { CalendarDays } from "lucide-react";
import PageHeader from "@/components/sheard/PageHeader";

/* ───── Homework Data ───── */
const todaysHomework = {
  id: 1,
  title: "Fractions Practice",
  description: "Solve question 1-10 on page 42 of the textbook.",
  due: "June 13,2025",
};

const archivedHomework = Array.from({ length: 12 }, (_, i) => ({
  id: i + 2,
  title: "Fractions Practice",
  description: "Solve question 1-10 on page 42 of the textbook.",
  due: "June 13,2025",
}));

/* ───── Homework Card ───── */
function HomeworkCard({
  homework,
}: {
  homework: { id: number; title: string; description: string; due: string };
}) {
  return (
    <div className="rounded-[10px] bg-white px-5 py-5 shadow-[0px_0px_20px_0px_rgba(6,51,54,0.1)]">
      <h3 className="text-[22px] font-medium text-black">{homework.title}</h3>
      <p className="mt-2 text-[18px] font-light text-[#666]">
        {homework.description}
      </p>
      <div className="my-3 h-[1px] bg-gray-200" />
      <p className="text-[14px] font-light text-[#666]">Due: {homework.due}</p>
    </div>
  );
}

export default function HomeworkPage({
  slug: _slug,
  studentSlug: _studentSlug,
  subjectSlug: _subjectSlug,
}: {
  slug?: string;
  studentSlug: string;
  subjectSlug: string;
}) {
  return (
    <div className="space-y-8 pt-10 mt-32">
      <PageHeader title="Homework" />
      {/* Today's Homework */}
      <div>
        <h2 className="text-[30px] font-semibold text-[#333]">
          Today&apos;s Homework
        </h2>
        <div className="mt-4 max-w-[529px]">
          <HomeworkCard homework={todaysHomework} />
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
            <HomeworkCard key={hw.id} homework={hw} />
          ))}
        </div>
      </div>
    </div>
  );
}
