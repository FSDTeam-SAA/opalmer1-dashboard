"use client";

import Image from "next/image";
import { Copy, Clock3 } from "lucide-react";

import { useStudentDetails } from "../hooks/useStudents";
import PageHeader from "@/components/sheard/PageHeader";
import { Skeleton } from "@/components/ui/skeleton";

type SubjectItem = {
  classId: string;
  subject: string;
  teacher?:
    | string
    | { username?: string; avatar?: { url?: string }; [key: string]: unknown };
  date?: string;
  attendance: number;
  progress: number;
};

function StatCard({
  title,
  value,
  bg,
}: {
  title: string;
  value: string;
  bg: string;
}) {
  return (
    <div
      className={`rounded-xl px-5 py-4 text-white shadow-sm min-w-[140px] ${bg}`}
    >
      <p className="text-sm font-medium opacity-95">{title}</p>
      <h3 className="mt-1 text-3xl font-bold leading-none">{value}</h3>
    </div>
  );
}

function SubjectCard({ item }: { item: SubjectItem }) {
  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm border border-gray-100">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#9C27D8] text-[#9C27D8]">
            <Clock3 size={16} />
          </div>

          <div>
            <h3 className="text-[18px] font-semibold text-gray-800">
              {item.subject}
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-4 pt-1 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <span className="text-green-500">🗒</span>
            <span>{item.attendance}%</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-orange-400">📈</span>
            <span>{item.progress}%</span>
          </div>
        </div>
      </div>

      <div className="my-3 border-t border-gray-200" />

      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Image
            src={
              typeof item.teacher === "object" && item.teacher?.avatar?.url
                ? item.teacher.avatar.url
                : "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop"
            }
            alt="teacher"
            width={34}
            height={34}
            className="h-[34px] w-[34px] rounded-full object-cover"
          />
          <div>
            <p className="text-sm font-medium text-gray-700">
              {item.teacher
                ? typeof item.teacher === "string"
                  ? item.teacher
                  : item.teacher.username || "N/A"
                : "N/A"}
            </p>
            <p className="text-xs text-gray-400">{item.date || "N/A"}</p>
          </div>
        </div>

        <button className="rounded-md bg-[#9C27D8] px-4 py-2 text-sm font-medium text-white transition hover:opacity-90">
          View
        </button>
      </div>
    </div>
  );
}

export default function StudentProfileView({
  studentId,
}: {
  studentId: string;
}) {
  const { data, isLoading, isError } = useStudentDetails(studentId);

  if (isLoading) {
    return (
      <div className="space-y-8 pt-10 mt-16">
        <PageHeader title="Student Profile" />
        <Skeleton className="h-[200px] w-full rounded-[20px]" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="space-y-8 pt-10 mt-16">
        <PageHeader title="Student Profile" />
        <div className="rounded-[20px] bg-white p-10 text-center shadow-[0px_0px_20px_0px_rgba(0,0,0,0.08)]">
          <p className="text-[18px] font-medium text-[#e64540]">
            Failed to load student details
          </p>
        </div>
      </div>
    );
  }

  const { student, overall, parent, subjects } = data;

  const name = student.username || "Unknown";
  const grade = student.gradeLevel
    ? `Grade ${student.gradeLevel}`
    : "Grade N/A";
  const age = student.age ? `Age ${student.age}` : "Age N/A";
  const phone = student.phoneNumber || "N/A";
  const fallbackImage =
    "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=400&auto=format&fit=crop";

  return (
    <div className="mt-20">
      {/* top purple area */}
      <div className="" />

      <div className="">
        {/* top card */}
        <div className="rounded-2xl bg-[#f3f3f3] p-4 shadow-md">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              <Image
                src={student.avatar?.url || fallbackImage}
                alt="student"
                width={92}
                height={92}
                className="h-[92px] w-[92px] rounded-md object-cover"
              />

              <div>
                <h1 className="text-[34px] font-bold leading-none text-gray-900">
                  {name}
                </h1>
                <p className="mt-2 text-[18px] text-gray-500">
                  {grade} - {age}
                </p>
                <p className="mt-1 text-[18px] text-gray-500">{phone}</p>

                <div className="mt-3 flex items-center gap-3">
                  <button className="relative h-6 w-11 rounded-full bg-[#9C27D8] transition">
                    <span className="absolute left-[22px] top-1 h-4 w-4 rounded-full bg-white shadow" />
                  </button>

                  <button className="rounded-md bg-[#9C27D8] px-5 py-2 text-sm font-medium text-white">
                    Edit
                  </button>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <StatCard
                title="Attendance"
                value={`${overall?.attendance ?? 0}%`}
                bg="bg-[#4EAE7C]"
              />
              <StatCard
                title="Progress"
                value={`${overall?.progress ?? 0}%`}
                bg="bg-[#F4B73F]"
              />
            </div>
          </div>
        </div>

        {/* profile section */}
        <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div>
            <h2 className="mb-3 text-[20px] font-semibold text-gray-800">
              Parent Profile
            </h2>

            <div className="rounded-2xl bg-[#dfe9ef] p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <Image
                  src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=300&auto=format&fit=crop"
                  alt="parent"
                  width={52}
                  height={52}
                  className="h-[52px] w-[52px] rounded-full object-cover"
                />
                <p className="text-[18px] font-semibold text-gray-800">
                  {parent ? parent.name || "Parent Name" : "N/A"}
                </p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="mb-3 text-[20px] font-semibold text-gray-800">
              Student Id
            </h2>

            <div className="flex items-center justify-between rounded-2xl bg-[#eee9dc] p-4 shadow-sm">
              <div>
                <p className="text-[18px] font-semibold text-gray-800">
                  {student.username
                    ? student.username.toLowerCase().replace(/\s+/g, "_")
                    : "N/A"}
                </p>
                <p className="text-sm text-gray-500">{student.Id}</p>
              </div>

              <button className="text-[#9C27D8]">
                <Copy size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* subjects */}
        <div className="mt-6">
          <h2 className="mb-4 text-[22px] font-semibold text-gray-800">
            Subjects
          </h2>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {subjects &&
              subjects.map((item, idx) => (
                <SubjectCard
                  key={item.classId || idx}
                  item={item as unknown as SubjectItem}
                />
              ))}
            {(!subjects || subjects.length === 0) && (
              <p className="text-gray-500 mt-4">No subjects found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
