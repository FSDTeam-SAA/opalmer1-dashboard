"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { BookOpen, Calendar, Mail, Phone } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import PageHeader from "@/components/sheard/PageHeader";
import {
  useMyTeachers,
  useToggleTeacherState,
  useUpdateTeacher,
} from "../hooks/useTeachers";
import { useClassesByTeacher } from "../hooks/useClasses";
import type { TeacherRow } from "../types/teachers.types";
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

function ClassesGrid({ teacherId }: { teacherId: string }) {
  const { data, isLoading, isError, error, refetch } =
    useClassesByTeacher(teacherId);

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
          No classes assigned to this teacher yet.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {data.map((cls, idx) => {
        const color = subjectChipColors[idx % subjectChipColors.length];
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
            {cls.schedule && (
              <p className="mt-3 flex items-center gap-2 text-[13px] text-[#666]">
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

  // The backend exposes no GET /users/:id endpoint, so we look the teacher up
  // from the cached /users/my-teachers list. Both the list view and this
  // route share that same query key, so navigating in usually hits a warm
  // cache and skips the network entirely.
  const teacher: TeacherRow | undefined = useMemo(
    () => teachers?.find((t) => t._id === teacherId),
    [teachers, teacherId],
  );

  if (isLoading) {
    return (
      <div className="space-y-8">
        <PageHeader title="Teacher Profile" />
        <ProfileCardSkeleton />
      </div>
    );
  }

  if (isError || !teachers) {
    return (
      <div className="space-y-8">
        <PageHeader title="Teacher Profile" />
        <div className="rounded-[20px] bg-white p-10 text-center shadow-[0px_0px_20px_0px_rgba(0,0,0,0.1)]">
          <p className="text-[18px] font-medium text-[#e64540]">
            Failed to load teachers list
          </p>
          <p className="mt-2 text-[14px] text-[#666]">
            Please try again from the teachers page.
          </p>
        </div>
      </div>
    );
  }

  if (!teacher) {
    return (
      <div className="space-y-8">
        <PageHeader title="Teacher Profile" />
        <div className="rounded-[20px] bg-white p-10 text-center shadow-[0px_0px_20px_0px_rgba(0,0,0,0.1)]">
          <p className="text-[18px] font-medium text-[#333]">
            Teacher not found
          </p>
          <p className="mt-2 text-[14px] text-[#666]">
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

  return (
    <div className="space-y-8">
      <PageHeader title="Teacher Profile" />

      {/* ── Profile Card ── */}
      <div className="flex flex-col items-center">
        <div className="relative z-10 h-[180px] w-[180px] overflow-hidden rounded-[12px] shadow-lg">
          <Image
            src={teacher.image || FALLBACK_IMAGE}
            alt={teacher.name}
            width={180}
            height={180}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="-mt-10 w-full max-w-[560px] rounded-[20px] bg-white pt-14 pb-6 px-8 shadow-[0px_0px_20px_0px_rgba(0,0,0,0.1)]">
          <div className="flex flex-col items-center">
            <h3 className="text-[24px] font-semibold text-black tracking-[0.3px]">
              {teacher.name}
            </h3>
            <p className="mt-1 text-[14px] text-[#999]">
              Teacher Id: {teacher.teacherId}
            </p>

            <div className="mt-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[14px] text-[#666]">
              {teacher.email && teacher.email !== "—" && (
                <span className="inline-flex items-center gap-1.5">
                  <Mail size={14} />
                  {teacher.email}
                </span>
              )}
              {teacher.phoneNumber && teacher.phoneNumber !== "—" && (
                <span className="inline-flex items-center gap-1.5">
                  <Phone size={14} />
                  {teacher.phoneNumber}
                </span>
              )}
            </div>

            <div className="mt-5 flex items-center gap-4">
              <span
                className={`inline-flex items-center gap-1.5 text-[14px] font-medium ${
                  teacher.active ? "text-[#5fb892]" : "text-[#ef3c50]"
                }`}
              >
                <span
                  className={`h-2 w-2 rounded-full ${
                    teacher.active ? "bg-[#5fb892]" : "bg-[#ef3c50]"
                  }`}
                />
                {teacher.active ? "Active" : "Inactive"}
              </span>
              <ToggleSwitch
                active={teacher.active}
                disabled={toggleState.isPending}
                onChange={() =>
                  toggleState.mutate({
                    id: teacher._id,
                    state: teacher.active ? "inactive" : "active",
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

            {teacher.subject && teacher.subject !== "—" && (
              <div className="mt-4 flex items-center gap-2">
                <span className="rounded-[6px] bg-[#871dad] px-[14px] py-[6px] text-[13px] font-medium text-white">
                  {teacher.subject}
                </span>
              </div>
            )}
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
        <ClassesGrid teacherId={teacher._id} />
      </div>

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
