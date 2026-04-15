"use client";

import { CalendarDays } from "lucide-react";
import PageHeader from "@/components/sheard/PageHeader";

/* ───── Attendance Data ───── */
const attendanceData = Array.from({ length: 16 }, (_, i) => ({
  id: i + 1,
  date: "06-03-25",
  studentName: "Mia Johnson",
  status: "Present" as const,
}));

export default function AttendancePage({
  slug,
  studentSlug,
  subjectSlug,
}: {
  slug: string;
  studentSlug: string;
  subjectSlug: string;
}) {
  return (
    <div className="pt-10 mt-32">
      <PageHeader title="Attendance" />
      <div className="overflow-hidden rounded-[20px] bg-white shadow-[0px_0px_20px_0px_rgba(0,0,0,0.1)]">
        {/* Table Header */}
        <div className="flex items-center bg-[#febd43] px-5 py-3">
          <div className="flex w-[200px] items-center gap-2">
            <span className="text-[14px] text-white">Date</span>
            <CalendarDays size={16} className="text-white" />
          </div>
          <div className="flex-1">
            <span className="text-[14px] text-white">Students Name</span>
          </div>
          <div className="w-[100px]">
            <span className="text-[14px] text-white">Status</span>
          </div>
        </div>

        {/* Table Rows */}
        {attendanceData.map((record) => (
          <div
            key={record.id}
            className="flex items-center border-b border-gray-100 px-5 py-4"
          >
            <div className="w-[200px]">
              <span className="text-[16px] text-[#333]">{record.date}</span>
            </div>
            <div className="flex-1">
              <span className="text-[18px] text-[#333]">
                {record.studentName}
              </span>
            </div>
            <div className="w-[100px]">
              <span className="inline-block rounded-[4px] bg-[#e6f5ee] px-[15px] py-[10px] text-[14px] text-[#4aa678]">
                {record.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
