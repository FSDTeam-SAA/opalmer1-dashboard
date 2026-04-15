"use client";

import Image from "next/image";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchAttendedStudents } from "../api/teacher.api";

/* ───── Skeleton Loader ───── */
function GridSkeleton() {
  return (
    <div className="mt-4 grid grid-cols-2 gap-5">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-4 rounded-[12px] bg-white p-5 shadow-[0px_0px_20px_0px_rgba(0,0,0,0.1)]"
        >
          <Skeleton className="h-4 w-[6px] rounded-full" />
          <Skeleton className="h-[56px] w-[56px] rounded-full" />
          <div className="flex-1">
            <Skeleton className="h-5 w-[120px]" />
            <Skeleton className="mt-2 h-4 w-[100px]" />
            <Skeleton className="mt-3 h-2 w-full rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function AttendedStudentsGrid({
  slug,
  teacherId,
  quizId,
}: {
  slug: string;
  teacherId: string;
  quizId: string;
}) {
  const {
    data: students = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["attended-students", slug, teacherId, quizId],
    queryFn: () => fetchAttendedStudents(quizId),
  });

  return (
    <div className="space-y-6 pt-10 mt-16">
      <h2 className="text-[30px] font-semibold text-[#333]">
        Attended Students
      </h2>

      {isLoading ? (
        <GridSkeleton />
      ) : isError ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-[18px] font-medium text-[#e64540]">
            Failed to load students
          </p>
          <p className="mt-2 text-[14px] text-[#666]">
            Please try again later.
          </p>
        </div>
      ) : students.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-[18px] font-medium text-[#666]">
            No students attended this quiz
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-5">
          {students.map((student) => (
            <Link
              key={student.id}
              href={`/admin/administration/${slug}/teachers/${teacherId}/quizzes/${quizId}/students/${student.id}`}
              className="relative flex items-center gap-4 rounded-[12px] bg-white p-5 shadow-[0px_0px_20px_0px_rgba(0,0,0,0.1)] transition-colors hover:bg-gray-50"
            >
              {/* Colored left border */}
              <div
                className="absolute left-0 top-0 h-full w-[6px] rounded-bl-[12px] rounded-tl-[12px]"
                style={{ backgroundColor: student.color }}
              />

              {/* Avatar */}
              <div className="ml-2 h-[56px] w-[56px] flex-shrink-0 overflow-hidden rounded-full">
                <Image
                  src={student.image}
                  alt={student.name}
                  width={56}
                  height={56}
                  className="h-full w-full object-cover"
                />
              </div>

              {/* Info + Progress */}
              <div className="flex-1">
                <p className="text-[18px] font-medium text-[#333]">
                  {student.name}
                </p>
                <p className="text-[12px] text-[#666]">
                  {student.grade} - Age {student.age}
                </p>

                {/* Progress bar */}
                <div className="mt-3 flex items-center gap-2">
                  <span className="text-[12px] font-medium text-[#e64540]">
                    {student.startProgress}%
                  </span>
                  <div className="relative h-[6px] flex-1 rounded-full bg-gray-200">
                    <div
                      className="absolute left-0 top-0 h-full rounded-full bg-[#871dad]"
                      style={{ width: `${student.endProgress}%` }}
                    />
                  </div>
                  <span className="text-[12px] font-medium text-[#4aa678]">
                    {student.endProgress}%
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
