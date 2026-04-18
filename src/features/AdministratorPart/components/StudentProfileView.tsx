"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { BookOpen, Calendar, Mail, Phone, User } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import PageHeader from "@/components/sheard/PageHeader";
import {
  useMyStudents,
  useToggleStudentState,
  useUpdateStudent,
} from "../hooks/useStudents";
import { useClassesByStudent } from "../hooks/useClasses";
import type { StudentRow } from "../types/students.types";
import { ToggleSwitch } from "./shared/ToggleSwitch";
import EditUserModal from "./shared/EditUserModal";

const FALLBACK_IMAGE = "/images/4f8da1b70693c4fcf9e01b9293706aed5cd4e34d.jpg";

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

function ProfileCardSkeleton() {
  return (
    <div className="flex flex-col items-center">
      <Skeleton className="h-[180px] w-[180px] rounded-[12px] z-10" />
      <div className="-mt-10 w-full max-w-[500px] rounded-[20px] bg-white pt-14 pb-6 px-8 shadow-[0px_0px_20px_0px_rgba(0,0,0,0.1)]">
        <div className="flex flex-col items-center gap-3">
          <Skeleton className="h-7 w-[200px]" />
          <Skeleton className="h-5 w-[220px]" />
          <Skeleton className="h-5 w-[140px]" />
          <div className="mt-2 flex items-center gap-4">
            <Skeleton className="h-[20px] w-[42px] rounded-full" />
            <Skeleton className="h-[34px] w-[80px] rounded-[6px]" />
          </div>
        </div>
      </div>
    </div>
  );
}

function ClassesGrid({ studentId }: { studentId: string }) {
  const { data, isLoading, isError, error, refetch } =
    useClassesByStudent(studentId);

  if (isLoading) {
    return (
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-[120px] w-full rounded-[16px]" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mt-4 rounded-[12px] border border-[#fbd0d0] bg-[#fff5f5] p-5 text-center">
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
      <div className="mt-4 rounded-[12px] border border-dashed border-[#c7c7c7] bg-[#f9f9f9] p-8 text-center">
        <p className="text-[15px] text-[#666]">
          No classes scheduled for this student&apos;s grade yet.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {data.map((cls, idx) => {
        const color = subjectChipColors[idx % subjectChipColors.length];
        const teacherName =
          typeof cls.teacherId === "object" && cls.teacherId !== null
            ? cls.teacherId.username
            : undefined;
        return (
          <div
            key={cls._id}
            className="rounded-[16px] bg-white p-5 shadow-[0px_0px_20px_0px_rgba(0,0,0,0.08)]"
          >
            <div className="flex items-center gap-3">
              <div
                className={`flex h-[40px] w-[40px] items-center justify-center rounded-full text-white ${color}`}
              >
                <BookOpen size={18} />
              </div>
              <div>
                <p className="text-[16px] font-semibold text-[#333]">
                  {cls.subject}
                </p>
                <p className="text-[13px] text-[#666]">
                  Grade {String(cls.grade)}
                  {cls.section ? ` · Section ${cls.section}` : ""}
                </p>
              </div>
            </div>
            {teacherName && (
              <p className="mt-3 flex items-center gap-2 text-[13px] text-[#666]">
                <User size={14} />
                {teacherName}
              </p>
            )}
            {cls.schedule && (
              <p className="mt-1 flex items-center gap-2 text-[13px] text-[#666]">
                <Calendar size={14} />
                {cls.schedule}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}

type StudentProfileViewProps = {
  studentId: string;
};

export default function StudentProfileView({
  studentId,
}: StudentProfileViewProps) {
  const { data: students, isLoading, isError } = useMyStudents();
  const toggleState = useToggleStudentState();
  const updateStudent = useUpdateStudent();
  const [editing, setEditing] = useState(false);

  // Backend exposes no GET /users/:id, so we look the student up from the
  // cached /users/my-students list. Same warm-cache trick as the teacher
  // profile — see TeacherProfileView for context.
  const student: StudentRow | undefined = useMemo(
    () => students?.find((s) => s._id === studentId),
    [students, studentId],
  );

  if (isLoading) {
    return (
      <div className="space-y-8">
        <PageHeader title="Student Profile" />
        <ProfileCardSkeleton />
      </div>
    );
  }

  if (isError || !students) {
    return (
      <div className="space-y-8">
        <PageHeader title="Student Profile" />
        <div className="rounded-[20px] bg-white p-10 text-center shadow-[0px_0px_20px_0px_rgba(0,0,0,0.1)]">
          <p className="text-[18px] font-medium text-[#e64540]">
            Failed to load students list
          </p>
          <p className="mt-2 text-[14px] text-[#666]">
            Please try again from the students page.
          </p>
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="space-y-8">
        <PageHeader title="Student Profile" />
        <div className="rounded-[20px] bg-white p-10 text-center shadow-[0px_0px_20px_0px_rgba(0,0,0,0.1)]">
          <p className="text-[18px] font-medium text-[#333]">
            Student not found
          </p>
          <p className="mt-2 text-[14px] text-[#666]">
            This student may have been removed or doesn&apos;t belong to your
            school.
          </p>
          <Link
            href="/administrator/students"
            className="mt-4 inline-block rounded-[8px] bg-[#871dad] px-5 py-2 text-[14px] font-medium text-white hover:bg-[#751a99] transition-colors"
          >
            Back to students
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader title="Student Profile" />

      {/* ── Profile Card ── */}
      <div className="flex flex-col items-center">
        <div className="relative z-10 h-[180px] w-[180px] overflow-hidden rounded-[12px] shadow-lg">
          <Image
            src={student.image || FALLBACK_IMAGE}
            alt={student.name}
            width={180}
            height={180}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="-mt-10 w-full max-w-[560px] rounded-[20px] bg-white pt-14 pb-6 px-8 shadow-[0px_0px_20px_0px_rgba(0,0,0,0.1)]">
          <div className="flex flex-col items-center">
            <h3 className="text-[24px] font-semibold text-black tracking-[0.3px]">
              {student.name}
            </h3>
            <p className="mt-1 text-[14px] text-[#999]">
              Student Id: {student.studentId}
            </p>

            <div className="mt-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[14px] text-[#666]">
              {student.email && student.email !== "—" && (
                <span className="inline-flex items-center gap-1.5">
                  <Mail size={14} />
                  {student.email}
                </span>
              )}
              {student.phoneNumber && student.phoneNumber !== "—" && (
                <span className="inline-flex items-center gap-1.5">
                  <Phone size={14} />
                  {student.phoneNumber}
                </span>
              )}
              {student.grade && student.grade !== "—" && (
                <span className="inline-flex items-center gap-1.5">
                  <BookOpen size={14} />
                  Grade {student.grade}
                </span>
              )}
            </div>

            <div className="mt-5 flex items-center gap-4">
              <span
                className={`inline-flex items-center gap-1.5 text-[14px] font-medium ${
                  student.active ? "text-[#5fb892]" : "text-[#ef3c50]"
                }`}
              >
                <span
                  className={`h-2 w-2 rounded-full ${
                    student.active ? "bg-[#5fb892]" : "bg-[#ef3c50]"
                  }`}
                />
                {student.active ? "Active" : "Inactive"}
              </span>
              <ToggleSwitch
                active={student.active}
                disabled={toggleState.isPending}
                onChange={() =>
                  toggleState.mutate({
                    id: student._id,
                    state: student.active ? "inactive" : "active",
                  })
                }
              />
              <button
                type="button"
                onClick={() => setEditing(true)}
                className="rounded-[6px] bg-[#871dad] cursor-pointer px-[15px] py-[8px] text-[15px] font-medium text-white hover:bg-[#751a99] transition-colors"
              >
                Edit
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Classes Section ── */}
      <div>
        <div className="flex items-center justify-between">
          <h2 className="text-[24px] sm:text-[28px] font-semibold text-[#333]">
            Classes
          </h2>
        </div>
        <ClassesGrid studentId={student._id} />
      </div>

      {editing && (
        <EditUserModal
          title="Edit Student"
          user={{
            _id: student._id,
            name: student.name,
            Id: student.studentId,
            phoneNumber: student.phoneNumber === "—" ? "" : student.phoneNumber,
            email: student.email === "—" ? "" : student.email,
            gradeLevel:
              student.grade && student.grade !== "—"
                ? Number(student.grade) || undefined
                : undefined,
            state: student.active ? "active" : "inactive",
          }}
          isPending={updateStudent.isPending}
          onSubmit={(payload) =>
            updateStudent.mutateAsync({ id: student._id, payload })
          }
          onClose={() => setEditing(false)}
        />
      )}
    </div>
  );
}
