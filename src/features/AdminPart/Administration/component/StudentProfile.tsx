"use client";

import Image from "next/image";
import { Copy } from "lucide-react";
import PageHeader from "@/components/sheard/PageHeader";
import SubjectCard, { Subject } from "./SubjectCard";

import { useStudentDetails } from "../hooks/useStudents";
import { Skeleton } from "@/components/ui/skeleton";

export default function StudentProfile({
  slug,
  studentSlug,
  basePath = "/admin/administration",
}: {
  slug?: string;
  studentSlug: string;
  basePath?: string;
}) {
  const { data, isLoading, isError } = useStudentDetails(studentSlug);

  if (isLoading) {
    return (
      <div className="space-y-8 pt-10 mt-16">
        <PageHeader title="Students" />
        <Skeleton className="h-[200px] w-full rounded-[20px]" />
        <div className="grid grid-cols-2 gap-6">
          <Skeleton className="h-[150px] rounded-[20px]" />
          <Skeleton className="h-[150px] rounded-[20px]" />
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="space-y-8 pt-10 mt-16">
        <PageHeader title="Students" />
        <div className="rounded-[20px] bg-white p-10 text-center shadow-[0px_0px_20px_0px_rgba(0,0,0,0.08)]">
          <p className="text-[18px] font-medium text-[#e64540]">
            Failed to load student profile
          </p>
        </div>
      </div>
    );
  }

  const { student, parent, overall, subjects } = data;
  const fallbackImage =
    "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=400&auto=format&fit=crop";

  return (
    <div className="space-y-8 pt-10 mt-16">
      <PageHeader title="Students" />
      {/* Student Info Card */}
      <div className="flex items-center gap-5 rounded-[20px] bg-white p-5 shadow-[0px_0px_20px_0px_rgba(0,0,0,0.1)]">
        {/* Student Image */}
        <div className="h-[200px] w-[200px] flex-shrink-0 overflow-hidden rounded-[6px]">
          <Image
            src={student.avatar?.url || fallbackImage}
            alt={student.username}
            width={200}
            height={200}
            className="h-full w-full object-cover"
          />
        </div>

        {/* Info */}
        <div className="flex flex-1 flex-col justify-center">
          <h3 className="text-[32px] font-semibold text-black tracking-[0.3px]">
            {student.username}
          </h3>
          <p className="mt-2 text-[20px] text-[#666]">
            Grade {student.gradeLevel} - Age {student.age}
          </p>
          <p className="mt-1 text-[20px] text-[#666]">{student.phoneNumber}</p>
        </div>

        {/* Attendance & Progress Badges */}
        <div className="flex gap-4">
          <div className="flex h-[110px] w-[240px] flex-col items-center justify-center rounded-[10px] bg-[#4aa678]">
            <p className="text-[20px] text-white">Attendance</p>
            <p className="mt-1 text-[30px] font-medium text-white">
              {overall.attendance}%
            </p>
          </div>
          <div className="flex h-[110px] w-[240px] flex-col items-center justify-center rounded-[10px] bg-[#febd43]">
            <p className="text-[20px] text-white">Progress</p>
            <p className="mt-1 text-[30px] font-medium text-white">
              {overall.progress}%
            </p>
          </div>
        </div>
      </div>

      {/* Parent Profile & Student Id */}
      <div className="grid grid-cols-2 gap-6">
        {/* Parent Profile */}
        <div>
          <h2 className="text-[30px] font-semibold text-[#333]">
            Parent Profile
          </h2>
          <div className="mt-4 flex items-center gap-5 rounded-[20px] bg-[rgba(63,153,180,0.1)] px-5 py-7">
            <div className="h-[80px] w-[80px] flex-shrink-0 overflow-hidden rounded-full">
              <Image
                src={parent?.parentId?.avatar?.url || fallbackImage}
                alt={parent?.parentId?.username || "N/A"}
                width={80}
                height={80}
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <p className="text-[28px] font-semibold text-[#333]">
                {parent?.parentId?.username || "N/A"}
              </p>
              <div className="mt-1 flex flex-col">
                <p className="text-[18px] text-[#666]">
                  <span className="font-medium">Parent ID:</span>{" "}
                  {parent?.parentId?.Id || "N/A"}
                </p>
                <p className="text-[18px] text-[#666]">
                  {parent?.parentId?.phoneNumber || "N/A"}
                </p>
                <p className="text-[16px] text-[#871dad] truncate max-w-[250px]">
                  {parent?.parentId?.email || "N/A"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Student Id */}
        <div>
          <h2 className="text-[30px] font-semibold text-[#333]">Student Id</h2>
          <div className="mt-4 flex items-center justify-between rounded-[20px] bg-[rgba(254,189,67,0.1)] px-5 py-7">
            <div>
              <p className="text-[28px] font-semibold text-[#333] tracking-[0.3px]">
                {student.Id}
              </p>
              <p className="mt-1 text-[20px] text-[#666]">{"*******"}</p>
            </div>
            <button className="cursor-pointer text-[#871dad] hover:text-[#751a99] transition-colors">
              <Copy size={32} />
            </button>
          </div>
        </div>
      </div>

      {/* Subjects Section */}
      <div>
        <h2 className="text-[30px] font-semibold text-[#333]">Subjects</h2>
        <div className="mt-4 grid grid-cols-2 gap-5">
          {subjects.map((subject, idx) => (
            <SubjectCard
              key={idx}
              subject={{
                id: idx + 1,
                name: subject.subject,
                teacherName: "N/A", // Not in individual student API
                teacherImage: fallbackImage,
                date: "N/A",
                attendance: `${subject.attendance}%`,
                progress: `${subject.progress}%`,
              }}
              slug={slug}
              studentSlug={studentSlug}
              basePath={basePath}
            />
          ))}
          {subjects.length === 0 && (
            <p className="text-gray-500 text-lg">No subjects assigned.</p>
          )}
        </div>
      </div>
    </div>
  );
}
