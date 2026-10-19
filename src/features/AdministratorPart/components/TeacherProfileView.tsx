"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchTeacherProfile } from "@/features/AdminPart/Administration/api/teacher.api";
import { useMemo, useState } from "react";
import Link from "next/link";
import { BookOpen, Calendar } from "lucide-react";
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
function TeacherAdditionalInfoSections({ teacherId }: { teacherId: string }) {
  const profile = useQuery({
    queryKey: ["teacher-overview", teacherId],
    queryFn: () => fetchTeacherProfile(teacherId),
  });
  if (profile.isLoading) return <p className="mt-8">Loading assessments...</p>;
  if (profile.isError)
    return (
      <p role="alert" className="mt-8 text-red-600">
        Unable to load assessment records.{" "}
        <button onClick={() => void profile.refetch()} className="underline">
          Retry
        </button>
      </p>
    );
  return (
    <div className="mt-8 space-y-6">
      <h2 className="text-2xl font-semibold">Teaching &amp; Assessment</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {profile.data?.grades.map((grade) => (
          <article key={grade.id} className="rounded-xl bg-white p-5 shadow-sm">
            <h3 className="font-semibold">{grade.name}</h3>
            <p>{grade.students} students</p>
            <p>Attendance: {grade.attendance}</p>
            <p>Released assessment average: {grade.performance}</p>
          </article>
        ))}
      </div>
      <h3 className="text-xl font-semibold">
        Assessments ({profile.data?.quizzes.length ?? 0})
      </h3>
      {profile.data?.quizzes.map((quiz) => (
        <article key={quiz.id} className="rounded-xl bg-white p-5 shadow-sm">
          <p className="font-semibold">{quiz.title}</p>
          <p>
            {quiz.questions} questions ? {quiz.duration}
          </p>
        </article>
      ))}
      {!profile.data?.quizzes.length && <p>No assessments yet.</p>}
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
      <TeacherAdditionalInfoSections teacherId={teacherId} />

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
