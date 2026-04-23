"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { BookOpen, Calendar, TrendingUp, FileQuestion } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import PageHeader from "@/components/sheard/PageHeader";
import {
  useMyTeachers,
  useToggleTeacherState,
  useUpdateTeacher,
} from "../hooks/useTeachers";
import { useClassesByTeacher } from "../hooks/useClasses";
import type { TeacherRow } from "../types/teachers.types";
import {
  UserProfileCard,
  ProfileCardSkeleton,
  type ProfileUser,
} from "./shared/UserProfileCard";
import EditUserModal from "./shared/EditUserModal";

/* ──────────────────────────────────────────────
   Constants
─────────────────────────────────────────────── */
const subjectChipColors = [
  "bg-[#3f99b4]",
  "bg-[#e64540]",
  "bg-[#4aa678]",
  "bg-[#febd43]",
  "bg-[#871dad]",
];

function describeError(err: unknown): string {
  if (err instanceof Error) return err.message;
  return "Unable to load this information.";
}

/* ──────────────────────────────────────────────
   Classes Grid
─────────────────────────────────────────────── */
function ClassesGrid({ teacherId }: { teacherId: string }) {
  const { data, isLoading, isError, error, refetch } =
    useClassesByTeacher(teacherId);

  if (isLoading) {
    return (
      <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-[130px] w-full rounded-[16px]" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mt-5 rounded-[14px] border border-[#fbd0d0] bg-[#fff5f5] p-6 text-center">
        <p className="text-[14px] text-[#e64540]">{describeError(error)}</p>
        <button
          type="button"
          onClick={() => refetch()}
          className="mt-2 text-[14px] font-medium text-[#871dad] underline hover:text-[#751a99]"
        >
          Try again
        </button>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="mt-5 rounded-[14px] border border-dashed border-[#ddd] bg-[#fafafa] p-10 text-center">
        <BookOpen size={32} className="mx-auto mb-3 text-[#ccc]" />
        <p className="text-[15px] text-[#888]">
          No classes assigned to this teacher yet.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {data.map((cls, idx) => {
        const color = subjectChipColors[idx % subjectChipColors.length];
        return (
          <div
            key={cls._id}
            className="group rounded-[16px] bg-white p-5 shadow-[0px_2px_16px_rgba(0,0,0,0.07)] border border-[#f0f0f0] hover:shadow-[0px_4px_24px_rgba(135,29,173,0.12)] transition-shadow"
          >
            <div className="flex items-center gap-3">
              <div
                className={`flex h-[42px] w-[42px] flex-shrink-0 items-center justify-center rounded-[12px] text-white ${color}`}
              >
                <BookOpen size={18} />
              </div>
              <div>
                <p className="text-[15px] font-semibold text-[#333]">
                  {cls.subject}
                </p>
                <p className="text-[12px] text-[#888]">
                  Grade {String(cls.grade)}
                  {cls.section ? ` · Section ${cls.section}` : ""}
                </p>
              </div>
            </div>
            {cls.schedule && (
              <p className="mt-3 flex items-center gap-1.5 text-[12px] text-[#999]">
                <Calendar size={12} />
                {cls.schedule}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ──────────────────────────────────────────────
   Additional Info Sections (Placeholder)
─────────────────────────────────────────────── */
function TeacherAdditionalInfoSections() {
  return (
    <div className="space-y-6 mt-10">
      <div className="flex items-center justify-between">
        <h2 className="text-[22px] sm:text-[26px] font-bold text-[#222]">
          Teaching & Assessment
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Grades Overview */}
        <div className="rounded-[16px] bg-white p-5 shadow-[0px_2px_16px_rgba(0,0,0,0.07)] border border-[#f0f0f0] hover:shadow-[0px_4px_24px_rgba(135,29,173,0.12)] transition-shadow">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-[42px] w-[42px] items-center justify-center rounded-[12px] bg-[#871dad]/10 text-[#871dad]">
              <TrendingUp size={18} />
            </div>
            <h3 className="font-semibold text-[#333]">Grades Overview</h3>
          </div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[13px] text-[#666]">
              Mid-term Grading Progress
            </span>
            <span className="text-[13px] font-semibold text-[#871dad]">
              75%
            </span>
          </div>
          <div className="h-2 w-full bg-[#f0f0f0] rounded-full mb-4">
            <div
              className="h-full bg-[#871dad] rounded-full"
              style={{ width: "75%" }}
            ></div>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center border-t border-[#f0f0f0] pt-4">
            <div>
              <p className="text-[18px] font-bold text-[#333]">120</p>
              <p className="text-[11px] text-[#888]">Graded</p>
            </div>
            <div>
              <p className="text-[18px] font-bold text-[#e64540]">45</p>
              <p className="text-[11px] text-[#888]">Pending</p>
            </div>
            <div>
              <p className="text-[18px] font-bold text-[#4aa678]">B+</p>
              <p className="text-[11px] text-[#888]">Class Avg</p>
            </div>
          </div>
        </div>

        {/* Quizzes */}
        <div className="rounded-[16px] bg-white p-5 shadow-[0px_2px_16px_rgba(0,0,0,0.07)] border border-[#f0f0f0] hover:shadow-[0px_4px_24px_rgba(135,29,173,0.12)] transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-[42px] w-[42px] items-center justify-center rounded-[12px] bg-[#3f99b4]/10 text-[#3f99b4]">
                <FileQuestion size={18} />
              </div>
              <h3 className="font-semibold text-[#333]">Recent Quizzes</h3>
            </div>
            <button className="text-[12px] font-semibold text-[#3f99b4] hover:underline">
              View All →
            </button>
          </div>

          <ul className="space-y-3">
            <li className="flex items-center justify-between p-3 rounded-[10px] bg-[#fafafa] border border-[#f0f0f0]">
              <div>
                <p className="text-[13px] font-medium text-[#333]">
                  Algebra Basics (Quiz 3)
                </p>
                <p className="text-[11px] text-[#888] mt-0.5">
                  Grade 9 • Section A
                </p>
              </div>
              <div className="text-right">
                <p className="text-[13px] font-semibold text-[#4aa678]">
                  Completed
                </p>
                <p className="text-[11px] text-[#888]">32/32 Submissions</p>
              </div>
            </li>
            <li className="flex items-center justify-between p-3 rounded-[10px] bg-[#fafafa] border border-[#f0f0f0]">
              <div>
                <p className="text-[13px] font-medium text-[#333]">
                  Geometry Fundamentals
                </p>
                <p className="text-[11px] text-[#888] mt-0.5">
                  Grade 10 • Section B
                </p>
              </div>
              <div className="text-right">
                <p className="text-[13px] font-semibold text-[#e64540]">
                  Active
                </p>
                <p className="text-[11px] text-[#888]">15/30 Submissions</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────
   Main component
─────────────────────────────────────────────── */
type TeacherProfileViewProps = {
  teacherId: string;
};

export default function TeacherProfileView({
  teacherId,
}: TeacherProfileViewProps) {
  const { data: teachers, isLoading, isError } = useMyTeachers();
  const toggleState = useToggleTeacherState();
  const updateTeacher = useUpdateTeacher();
  const [editing, setEditing] = useState(false);

  const teacher: TeacherRow | undefined = useMemo(
    () => teachers?.find((t) => t._id === teacherId),
    [teachers, teacherId],
  );

  /* ── Loading state ── */
  if (isLoading) {
    return (
      <div className="space-y-8">
        <PageHeader title="Teacher Profile" />
        <ProfileCardSkeleton />
      </div>
    );
  }

  /* ── Error state ── */
  if (isError || !teachers) {
    return (
      <div className="space-y-8">
        <PageHeader title="Teacher Profile" />
        <div className="rounded-[20px] bg-white p-10 text-center shadow-[0px_0px_20px_0px_rgba(0,0,0,0.08)]">
          <p className="text-[18px] font-medium text-[#e64540]">
            Failed to load teachers list
          </p>
          <p className="mt-2 text-[14px] text-[#888]">
            Please try again from the teachers page.
          </p>
        </div>
      </div>
    );
  }

  /* ── Not found state ── */
  if (!teacher) {
    return (
      <div className="space-y-8">
        <PageHeader title="Teacher Profile" />
        <div className="rounded-[20px] bg-white p-10 text-center shadow-[0px_0px_20px_0px_rgba(0,0,0,0.08)]">
          <p className="text-[18px] font-medium text-[#333]">
            Teacher not found
          </p>
          <p className="mt-2 text-[14px] text-[#888]">
            This teacher may have been removed or doesn&apos;t belong to your
            school.
          </p>
          <Link
            href="/administrator/teachers"
            className="mt-4 inline-block rounded-[8px] bg-[#871dad] px-5 py-2 text-[14px] font-medium text-white hover:bg-[#751a99] transition-colors"
          >
            Back to teachers
          </Link>
        </div>
      </div>
    );
  }

  /* Normalise to ProfileUser shape */
  const profileUser: ProfileUser = {
    _id: teacher._id,
    name: teacher.name,
    userId: teacher.teacherId,
    email: teacher.email,
    phoneNumber: teacher.phoneNumber,
    badge: teacher.subject,
    image: teacher.image,
    active: teacher.active,
  };

  return (
    <div className="space-y-10">
      <PageHeader title="Teacher Profile" />

      {/* ── Profile Card ── */}
      <UserProfileCard
        user={profileUser}
        type="teacher"
        isTogglePending={toggleState.isPending}
        onToggle={() =>
          toggleState.mutate({
            id: teacher._id,
            state: teacher.active ? "inactive" : "active",
          })
        }
        onEdit={() => setEditing(true)}
      />

      {/* ── Classes Section ── */}
      <div>
        <div className="flex items-center justify-between">
          <h2 className="text-[22px] sm:text-[26px] font-bold text-[#222]">
            Assigned Classes
          </h2>
        </div>
        <ClassesGrid teacherId={teacher._id} />
      </div>

      {/* ── Additional Features & Analytics ── */}
      <TeacherAdditionalInfoSections />

      {/* ── Edit Modal ── */}
      {editing && (
        <EditUserModal
          title="Edit Teacher"
          user={{
            _id: teacher._id,
            name: teacher.name,
            Id: teacher.teacherId,
            phoneNumber: teacher.phoneNumber === "—" ? "" : teacher.phoneNumber,
            email: teacher.email === "—" ? "" : teacher.email,
            state: teacher.active ? "active" : "inactive",
          }}
          isPending={updateTeacher.isPending}
          onSubmit={(payload) =>
            updateTeacher.mutateAsync({ id: teacher._id, payload })
          }
          onClose={() => setEditing(false)}
        />
      )}
    </div>
  );
}
