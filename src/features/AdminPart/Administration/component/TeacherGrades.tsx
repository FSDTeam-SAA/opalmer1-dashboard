"use client";

import { Calendar, Users, BarChart3, User } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchTeacherGrades } from "../api/teacher.api";
import type {
  GradeCard as GradeCardType,
  SubjectStat,
} from "@/types/teacher.types";

/* ───── Color Maps ───── */
const gradeColorMap: Record<
  GradeCardType["color"],
  { bg: string; icon: string }
> = {
  red: { bg: "bg-[#e64540]", icon: "bg-[#c73b37]" },
  yellow: { bg: "bg-[#febd43]", icon: "bg-[#e5a93b]" },
  green: { bg: "bg-[#4aa678]", icon: "bg-[#3d8d66]" },
  teal: { bg: "bg-[#3f99b4]", icon: "bg-[#35829a]" },
  blue: { bg: "bg-[#6366f1]", icon: "bg-[#5558d9]" },
  amber: { bg: "bg-[#f59e0b]", icon: "bg-[#d98e0a]" },
};

/* ───── Skeleton Loader ───── */
function GradesSkeleton() {
  return (
    <div className="mt-32 pt-10">
      <div className="grid grid-cols-2 gap-8">
        {/* Left column skeleton */}
        <div>
          <Skeleton className="h-8 w-[100px] mb-5" />
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-[140px] w-full rounded-[16px]" />
            ))}
          </div>
        </div>

        {/* Right column skeleton */}
        <div>
          <Skeleton className="h-8 w-[100px] mb-5" />
          <div className="rounded-[20px] bg-white p-8 shadow-[0px_0px_20px_0px_rgba(0,0,0,0.1)]">
            <div className="space-y-0">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className={`py-6 ${i < 2 ? "border-b border-gray-100" : ""}`}
                >
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-[18px] w-[18px] rounded-full" />
                    <Skeleton className="h-5 w-[80px]" />
                    <div className="ml-auto flex gap-4">
                      <Skeleton className="h-4 w-[55px]" />
                      <Skeleton className="h-4 w-[55px]" />
                    </div>
                  </div>
                  <Skeleton className="mt-4 h-[6px] w-full rounded-full" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ───── Grade Card (full-width, stacked) ───── */
function GradeCardRow({ grade }: { grade: GradeCardType }) {
  const colors = gradeColorMap[grade.color] ?? gradeColorMap.green;

  return (
    <div className={`rounded-[16px] ${colors.bg} px-6 py-5 text-white`}>
      {/* Title row */}
      <div className="flex items-center gap-3">
        <div
          className={`flex h-[38px] w-[38px] items-center justify-center rounded-full ${colors.icon}`}
        >
          <Users size={18} />
        </div>
        <p className="text-[18px] font-bold">{grade.name}</p>
      </div>

      {/* Meta row */}
      <div className="mt-2 flex items-center gap-5 text-[13px] opacity-90">
        <span className="flex items-center gap-1">
          <Calendar size={13} />
          {grade.date}
        </span>
        <span className="flex items-center gap-1">
          <Users size={13} />
          {grade.students} Students
        </span>
      </div>

      {/* Stats row */}
      <div className="mt-3 flex items-center gap-10">
        <div>
          <p className="text-[12px] opacity-80">Attendance</p>
          <p className="text-[22px] font-bold">{grade.attendance}</p>
        </div>
        <div>
          <p className="text-[12px] opacity-80">Performance</p>
          <p className="text-[22px] font-bold">{grade.performance}</p>
        </div>
      </div>
    </div>
  );
}

/* ───── Subject Row ───── */
function SubjectRow({
  subject,
  isLast,
}: {
  subject: SubjectStat;
  isLast: boolean;
}) {
  return (
    <div className={`py-5 ${!isLast ? "border-b border-gray-200" : ""}`}>
      {/* Header: dot + name + stats */}
      <div className="flex items-center">
        <div className="flex items-center gap-3">
          <div
            className="h-[18px] w-[18px] rounded-full border-[3px]"
            style={{
              borderColor: subject.color,
              backgroundColor: "transparent",
            }}
          />
          <p className="text-[16px] font-bold text-[#333]">{subject.name}</p>
        </div>

        {/* Attendance + Progress stats */}
        <div className="ml-auto flex items-center gap-5">
          <span className="flex items-center gap-1 text-[12px] text-[#666]">
            <BarChart3 size={13} className="text-[#871dad]" />
            {subject.attendance}
          </span>
          <span className="flex items-center gap-1 text-[12px] text-[#666]">
            <User size={13} className="text-[#871dad]" />
            {subject.progress}
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mt-3 flex items-center gap-3">
        <span className="min-w-[28px] text-[12px] font-semibold text-[#e64540]">
          0%
        </span>
        <div className="relative h-[6px] flex-1 rounded-full bg-gray-200">
          <div
            className="absolute left-0 top-0 h-full rounded-full bg-[#871dad] transition-all"
            style={{ width: `${subject.progressPercent}%` }}
          />
        </div>
        <span className="min-w-[36px] text-right text-[12px] font-semibold text-[#4aa678]">
          {subject.progressPercent}%
        </span>
      </div>
    </div>
  );
}

/* ───── Main Component ───── */
export default function TeacherGrades({
  slug,
  teacherId,
}: {
  slug: string;
  teacherId: string;
}) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["teacher-grades", slug, teacherId],
    queryFn: () => fetchTeacherGrades(teacherId),
  });

  if (isLoading) return <GradesSkeleton />;

  if (isError || !data) {
    return (
      <div className="mt-32 flex flex-col items-center justify-center pt-10 text-center">
        <p className="text-[18px] font-medium text-[#e64540]">
          Failed to load grades
        </p>
        <p className="mt-2 text-[14px] text-[#666]">Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="mt-32 pt-10">
      <div className="grid grid-cols-2 gap-8">
        {/* ── Left Column: Grades ── */}
        <div>
          <h2 className="mb-5 text-[24px] font-bold text-[#333]">Grades</h2>
          {data.grades.length === 0 ? (
            <div className="flex items-center justify-center py-16">
              <p className="text-[16px] text-[#666]">No grades available</p>
            </div>
          ) : (
            <div className="space-y-4">
              {data.grades.map((grade) => (
                <GradeCardRow key={grade.id} grade={grade} />
              ))}
            </div>
          )}
        </div>

        {/* ── Right Column: Subjects ── */}
        <div>
          <h2 className="mb-5 text-[24px] font-bold text-[#333]">Subjects</h2>
          {data.subjects.length === 0 ? (
            <div className="flex items-center justify-center py-16">
              <p className="text-[16px] text-[#666]">No subjects available</p>
            </div>
          ) : (
            <div className="rounded-[20px] bg-white px-8 py-2 shadow-[0px_0px_20px_0px_rgba(0,0,0,0.1)]">
              {data.subjects.map((subject, i) => (
                <SubjectRow
                  key={subject.id}
                  subject={subject}
                  isLast={i === data.subjects.length - 1}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
