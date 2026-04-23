"use client";

import { CalendarDays } from "lucide-react";
import PageHeader from "@/components/sheard/PageHeader";

import { useClassAttendance } from "../hooks/useAttendance";
import { useStudentDetails } from "../hooks/useStudents";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";

export default function AttendancePage({
  slug: _slug,
  studentSlug,
  subjectSlug,
}: {
  slug?: string;
  studentSlug: string;
  subjectSlug: string;
}) {
  const subjectName = subjectSlug.replace(/-/g, " ");

  // 1. Get student details to find the classId for this subject
  const {
    data: studentData,
    isLoading: isLoadingStudent,
    isError: isErrorStudent,
  } = useStudentDetails(studentSlug);

  const subjectInfo = studentData?.subjects.find(
    (s) => s.subject.toLowerCase() === subjectName.toLowerCase(),
  );

  const classId = subjectInfo?.classId || "";

  // 2. Fetch attendance data
  const {
    data: attendanceRecords = [],
    isLoading: isLoadingAttendance,
    isError: isErrorAttendance,
  } = useClassAttendance({ studentId: studentSlug, classId });

  if (isLoadingStudent || isLoadingAttendance) {
    return (
      <div className="pt-10 mt-32">
        <PageHeader title="Attendance" />
        <div className="space-y-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-[60px] w-full rounded-[10px]" />
          ))}
        </div>
      </div>
    );
  }

  if (isErrorStudent || isErrorAttendance) {
    return (
      <div className="pt-10 mt-32">
        <PageHeader title="Attendance" />
        <div className="rounded-[20px] bg-white p-10 text-center shadow-[0px_0px_20px_0px_rgba(0,0,0,0.08)]">
          <p className="text-[18px] font-medium text-[#e64540]">
            Failed to load attendance records
          </p>
        </div>
      </div>
    );
  }

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
            <span className="text-[14px] text-white">Student Name</span>
          </div>
          <div className="w-[120px]">
            <span className="text-[14px] text-white">Status</span>
          </div>
        </div>

        {/* Table Rows */}
        {attendanceRecords.map((record) => {
          const dateStr = record.date
            ? format(new Date(record.date), "MM-dd-yy")
            : "N/A";
          const isPresent = record.status.toLowerCase() === "present";

          return (
            <div
              key={record._id}
              className="flex items-center border-b border-gray-100 px-5 py-4"
            >
              <div className="w-[200px]">
                <span className="text-[16px] text-[#333]">{dateStr}</span>
              </div>
              <div className="flex-1">
                <span className="text-[18px] text-[#333]">
                  {studentData?.student.username}
                </span>
              </div>
              <div className="w-[120px]">
                <span
                  className={`inline-block rounded-[4px] px-[15px] py-[10px] text-[14px] capitalize ${
                    isPresent
                      ? "bg-[#e6f5ee] text-[#4aa678]"
                      : "bg-[#feeceb] text-[#e64540]"
                  }`}
                >
                  {record.status}
                </span>
              </div>
            </div>
          );
        })}
        {attendanceRecords.length === 0 && (
          <div className="p-10 text-center text-gray-500">
            No attendance records found for this class.
          </div>
        )}
      </div>
    </div>
  );
}
