"use client";

import Image from "next/image";
import Link from "next/link";
import { BookOpen, TrendingUp } from "lucide-react";

export type Subject = {
  id: number;
  name: string;
  teacherName: string;
  teacherImage: string;
  date: string;
  attendance: string;
  progress: string;
};

export default function SubjectCard({
  subject,
  slug,
  studentSlug,
}: {
  subject: Subject;
  slug: string;
  studentSlug: string;
}) {
  return (
    <div className="rounded-[12px] bg-white p-5 shadow-[0px_0px_20px_0px_rgba(0,0,0,0.1)]">
      {/* Top: Subject name + stats */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-[36px] w-[36px] items-center justify-center rounded-full bg-[#871dad]">
            <BookOpen size={18} className="text-white" />
          </div>
          <span className="text-[20px] font-medium text-[#333]">
            {subject.name}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <TrendingUp size={16} className="text-[#4aa678]" />
            <span className="text-[16px] text-[#666]">
              {subject.attendance}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <TrendingUp size={16} className="text-[#febd43]" />
            <span className="text-[16px] text-[#666]">{subject.progress}</span>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="my-3 h-[1px] bg-gray-200" />

      {/* Bottom: Teacher + View */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-[36px] w-[36px] flex-shrink-0 overflow-hidden rounded-full">
            <Image
              src={subject.teacherImage}
              alt={subject.teacherName}
              width={36}
              height={36}
              className="h-full w-full object-cover"
            />
          </div>
          <div>
            <p className="text-[18px] text-[#333]">{subject.teacherName}</p>
            <p className="text-[14px] text-[#666]">{subject.date}</p>
          </div>
        </div>
        <Link
          href={`/admin/administration/${slug}/students/${studentSlug}/${subject.name.replace(/\s+/g, "-")}`}
          className="cursor-pointer rounded-[6px] bg-[#871dad] px-[15px] py-[10px] text-[20px] text-white hover:bg-[#751a99] transition-colors"
        >
          View
        </Link>
      </div>
    </div>
  );
}
