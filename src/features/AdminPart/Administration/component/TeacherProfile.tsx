"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Trash2, Calendar, Users } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import ToggleSwitch from "./ToggleSwitch";
import { fetchTeacherProfile } from "../api/teacher.api";
import type { GradeCard as GradeCardType } from "@/types/teacher.types";

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

const subjectChipColors: Record<string, string> = {
  Math: "bg-[#3f99b4]",
  Physics: "bg-[#e64540]",
  English: "bg-[#4aa678]",
  Science: "bg-[#febd43]",
};

/* ───── Skeleton Loader ───── */
function ProfileSkeleton() {
  return (
    <div className="space-y-8 pt-10 mt-16">
      {/* Centered profile card skeleton */}
      <div className="flex flex-col items-center">
        <Skeleton className="h-[180px] w-[180px] rounded-[12px] z-10" />
        <div className="-mt-10 w-full max-w-[500px] rounded-[20px] bg-white pt-14 pb-6 px-8 shadow-[0px_0px_20px_0px_rgba(0,0,0,0.1)]">
          <div className="flex flex-col items-center gap-3">
            <Skeleton className="h-7 w-[200px]" />
            <Skeleton className="h-5 w-[220px]" />
            <Skeleton className="h-5 w-[140px]" />
            <div className="mt-2 flex items-center gap-4">
              <Skeleton className="h-[20px] w-[42px] rounded-full" />
              <Skeleton className="h-[34px] w-[34px] rounded-full" />
              <Skeleton className="h-[38px] w-[60px] rounded-[6px]" />
            </div>
            <div className="mt-2 flex items-center gap-3">
              <Skeleton className="h-8 w-[70px] rounded-[6px]" />
              <Skeleton className="h-8 w-[80px] rounded-[6px]" />
              <Skeleton className="h-8 w-[80px] rounded-[6px]" />
            </div>
          </div>
        </div>
      </div>

      {/* Grades skeleton */}
      <div>
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-[120px]" />
          <Skeleton className="h-5 w-[70px]" />
        </div>
        <div className="mt-4 flex gap-5">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-[150px] w-[280px] rounded-[16px]" />
          ))}
        </div>
      </div>

      {/* Quizzes skeleton */}
      <div>
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-[120px]" />
          <Skeleton className="h-5 w-[70px]" />
        </div>
        <div className="mt-4 grid grid-cols-2 gap-5">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-4 rounded-[12px] bg-white p-4 shadow-[0px_0px_20px_0px_rgba(0,0,0,0.1)]"
            >
              <Skeleton className="h-[80px] w-[80px] rounded-[8px]" />
              <div>
                <Skeleton className="h-5 w-[160px]" />
                <Skeleton className="mt-2 h-4 w-[120px]" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ───── Grade Card ───── */
function GradeCard({ grade }: { grade: GradeCardType }) {
  const colors = gradeColorMap[grade.color] ?? gradeColorMap.green;

  return (
    <div
      className={`flex-shrink-0 w-[280px] rounded-[16px] ${colors.bg} p-5 text-white`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`flex h-[40px] w-[40px] items-center justify-center rounded-full ${colors.icon}`}
        >
          <Users size={20} />
        </div>
        <p className="text-[18px] font-semibold">{grade.name}</p>
      </div>

      <div className="mt-3 flex items-center gap-4 text-[12px] opacity-90">
        <span className="flex items-center gap-1">
          <Calendar size={12} />
          {grade.date}
        </span>
        <span className="flex items-center gap-1">
          <Users size={12} />
          {grade.students} Students
        </span>
      </div>

      <div className="mt-4 flex items-center gap-6">
        <div>
          <p className="text-[12px] opacity-80">Attendance</p>
          <p className="text-[20px] font-semibold">{grade.attendance}</p>
        </div>
        <div>
          <p className="text-[12px] opacity-80">Performance</p>
          <p className="text-[20px] font-semibold">{grade.performance}</p>
        </div>
      </div>
    </div>
  );
}

/* ───── Main Component ───── */
export default function TeacherProfile({
  slug,
  teacherId,
  basePath = "/admin/administration",
}: {
  slug?: string;
  teacherId: string;
  basePath?: string;
}) {
  const prefix = slug ? `${basePath}/${slug}` : `${basePath}`;
  const {
    data: teacher,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["teacher-profile", slug, teacherId],
    queryFn: () => fetchTeacherProfile(teacherId),
  });

  const [active, setActive] = useState(true);

  if (isLoading) return <ProfileSkeleton />;

  if (isError || !teacher) {
    return (
      <div className="mt-32 flex flex-col items-center justify-center pt-10 text-center">
        <p className="text-[18px] font-medium text-[#e64540]">
          Failed to load teacher profile
        </p>
        <p className="mt-2 text-[14px] text-[#666]">Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pt-10 mt-16">
      {/* ── Centered Profile Card ── */}
      <div className="flex flex-col items-center">
        {/* Floating photo */}
        <div className="relative z-10 h-[180px] w-[180px] overflow-hidden rounded-[12px] shadow-lg">
          <Image
            src={teacher.image}
            alt={teacher.name}
            width={180}
            height={180}
            className="h-full w-full object-cover"
          />
        </div>

        {/* Card body — overlaps behind the photo */}
        <div className="-mt-10 w-full max-w-[500px] rounded-[20px] bg-white pt-14 pb-6 px-8 shadow-[0px_0px_20px_0px_rgba(0,0,0,0.1)]">
          <div className="flex flex-col items-center">
            {/* Name, email, username */}
            <h3 className="text-[24px] font-semibold text-black tracking-[0.3px]">
              {teacher.name}
            </h3>
            <p className="mt-1 text-[16px] text-[#666]">{teacher.email}</p>
            <p className="mt-1 text-[14px] text-[#999]">{teacher.username}</p>

            {/* Controls row */}
            <div className="mt-4 flex items-center gap-5">
              <ToggleSwitch
                active={active}
                onChange={() => setActive(!active)}
              />

              {/* <button className="flex h-[34px] w-[34px] cursor-pointer items-center justify-center rounded-full bg-[#fde8e8] text-[#e64540] hover:bg-[#fbd0d0] transition-colors">
                <Trash2 size={18} />
              </button> */}

              <button className="rounded-[6px] bg-[#871dad] cursor-pointer px-[15px] py-[8px] text-[16px] font-medium text-white hover:bg-[#751a99] transition-colors">
                Edit
              </button>
            </div>

            {/* Subject chips */}
            <div className="mt-4 flex items-center gap-3">
              {teacher.subjects.map((subject) => (
                <span
                  key={subject}
                  className={`rounded-[6px] px-[14px] py-[6px] text-[13px] font-medium text-white ${
                    subjectChipColors[subject] ?? "bg-[#871dad]"
                  }`}
                >
                  {subject}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Grades Section ── */}
      <div>
        <div className="flex items-center justify-between">
          <h2 className="text-[30px] font-semibold text-[#333]">Grades</h2>
          <Link
            href={`${prefix}/teachers/${teacherId}/grades`}
            className="cursor-pointer text-[20px] text-[#871dad] underline hover:text-[#751a99] transition-colors"
          >
            View All
          </Link>
        </div>
        <div className="mt-4 flex gap-5 overflow-x-auto pb-2">
          {teacher.grades.map((grade) => (
            <GradeCard key={grade.id} grade={grade} />
          ))}
        </div>
      </div>

      {/* ── Quizzes Section ── */}
      <div>
        <div className="flex items-center justify-between">
          <h2 className="text-[30px] font-semibold text-[#333]">Quizzes</h2>
          <Link
            href={`${prefix}/teachers/${teacherId}/quizzes`}
            className="cursor-pointer text-[20px] text-[#871dad] underline hover:text-[#751a99] transition-colors"
          >
            View All
          </Link>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-5">
          {teacher.quizzes.map((quiz) => (
            <Link
              key={quiz.id}
              href={`${prefix}/teachers/${teacherId}/quizzes/${quiz.id}`}
              className="flex items-center gap-4 rounded-[12px] bg-white p-4 shadow-[0px_0px_20px_0px_rgba(0,0,0,0.1)] transition-colors hover:bg-gray-50"
            >
              <div className="h-[80px] w-[80px] flex-shrink-0 overflow-hidden rounded-[8px]">
                <Image
                  src={quiz.image}
                  alt={quiz.title}
                  width={80}
                  height={80}
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <p className="text-[18px] font-medium text-[#333]">
                  {quiz.title}
                </p>
                <p className="mt-1 text-[14px] text-[#666]">
                  {quiz.questions} Questions · {quiz.duration}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
