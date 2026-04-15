"use client";

import Image from "next/image";

export type Teacher = {
  id: number;
  name: string;
  grade: string;
  state: string;
  subjects: string;
  status: string;
  image: string;
};

export default function TeacherCard({ teacher }: { teacher: Teacher }) {
  return (
    <div className="relative rounded-[10px] bg-white p-5 shadow-[0px_0px_20px_0px_rgba(0,0,0,0.1)]">
      {/* Left accent */}
      <div className="absolute left-0 top-0 h-full w-[10px] rounded-bl-[10px] rounded-tl-[10px] bg-[#4aa678]" />

      {/* Top: Avatar + Name + Badge */}
      <div className="flex items-center justify-between pl-3">
        <div className="flex items-center gap-4">
          <div className="h-[56px] w-[56px] flex-shrink-0 overflow-hidden rounded-full">
            <Image
              src={teacher.image}
              alt={teacher.name}
              width={56}
              height={56}
              className="h-full w-full object-cover"
            />
          </div>
          <div>
            <p className="text-[18px] font-medium text-[#333]">
              {teacher.name}
            </p>
            <p className="text-[12px] text-[#666]">{teacher.grade}</p>
          </div>
        </div>
        <span className="rounded-[4px] bg-[#4aa678] px-[10px] py-[8px] text-[12px] text-white">
          {teacher.status}
        </span>
      </div>

      {/* Bottom: Stats */}
      <div className="mt-5 flex items-center gap-8 pl-3">
        <div>
          <p className="text-[12px] text-[#666]">State</p>
          <p className="text-[16px] font-medium text-[#333]">{teacher.state}</p>
        </div>
        <div className="h-[32px] w-[1px] bg-[#e5e5e5]" />
        <div>
          <p className="text-[12px] text-[#666]">Subjects</p>
          <p className="text-[16px] font-medium text-[#333]">
            {teacher.subjects}
          </p>
        </div>
      </div>
    </div>
  );
}
