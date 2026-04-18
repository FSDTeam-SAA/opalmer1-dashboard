"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search } from "lucide-react";
import PageHeader from "@/components/sheard/PageHeader";
import { Skeleton } from "@/components/ui/skeleton";
import { useStudents } from "../hooks/useStudents";

export default function StudentsTable({ slug }: { slug: string }) {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: students = [], isLoading, isError } = useStudents();

  const filteredStudents = useMemo(() => {
    const q = searchQuery.toLowerCase();
    if (!q) return students;
    return students.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.studentId.toLowerCase().includes(q),
    );
  }, [searchQuery, students]);

  return (
    <div className="mt-32 pt-10">
      <PageHeader title="Students" />
      <div className="rounded-[20px] bg-white p-8 shadow-[0px_0px_20px_0px_rgba(0,0,0,0.1)]">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-[24px] font-semibold text-[#333]">
            Students Id&apos;s ({filteredStudents.length})
          </h2>
          <div className="relative">
            <Search
              size={20}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#666]"
            />
            <input
              type="text"
              placeholder="Enter student Id"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-[48px] w-[350px] rounded-[8px] border border-[#08374d] bg-[#f9f9f9] pl-10 pr-4 text-[16px] text-[#333] outline-none placeholder:text-[#666]"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-0">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-4 border-b border-gray-100 py-4"
              >
                <Skeleton className="h-5 w-[40px]" />
                <Skeleton className="h-6 w-6 rounded-full" />
                <Skeleton className="h-5 w-[120px]" />
                <Skeleton className="h-5 w-[100px]" />
                <Skeleton className="h-5 w-[40px]" />
                <Skeleton className="h-5 w-[80px]" />
                <Skeleton className="h-5 w-[40px]" />
                <Skeleton className="h-8 w-[60px] rounded-[4px]" />
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <p className="text-[18px] font-medium text-[#e64540]">
              Failed to load students
            </p>
            <p className="mt-2 text-[14px] text-[#666]">
              Please try again later.
            </p>
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <p className="text-[18px] font-medium text-[#666]">
              No students found
            </p>
            {searchQuery && (
              <p className="mt-2 text-[14px] text-[#999]">
                Try adjusting your search query.
              </p>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-[#871dad]">
                  <th className="w-[60px] pb-3 text-left text-[14px] font-light text-[#666]">
                    No
                  </th>
                  <th className="pb-3 text-left text-[14px] font-light text-[#666]">
                    Student Name
                  </th>
                  <th className="pb-3 text-left text-[14px] font-light text-[#666]">
                    Student I&apos;d
                  </th>
                  <th className="pb-3 text-left text-[14px] font-light text-[#666]">
                    Grade
                  </th>
                  <th className="pb-3 text-left text-[14px] font-light text-[#666]">
                    Age
                  </th>
                  <th className="pb-3 text-left text-[14px] font-light text-[#666]">
                    Attendance
                  </th>
                  <th className="w-[100px] pb-3 text-center text-[14px] font-light text-[#666]">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student) => (
                  <tr key={student._id} className="border-b border-gray-100">
                    <td className="py-4 text-[16px] font-light text-[#666]">
                      {student.id}
                    </td>
                    <td className="py-4">
                      <div className="flex items-center gap-2">
                        <div className="h-6 w-6 flex-shrink-0 overflow-hidden rounded-full">
                          <Image
                            src={student.image}
                            alt={student.name}
                            width={24}
                            height={24}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <span className="text-[16px] font-light text-[#666]">
                          {student.name}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 text-[16px] font-light text-[#666]">
                      {student.studentId}
                    </td>
                    <td className="py-4 text-[16px] font-light text-[#666]">
                      {student.grade}
                    </td>
                    <td className="py-4 text-[16px] font-light text-[#666]">
                      {student.age}
                    </td>
                    <td className="py-4 text-[16px] font-light text-[#666]">
                      {student.attendance}
                    </td>
                    <td className="py-4">
                      <div className="flex items-center justify-center">
                        <Link
                          href={`/admin/administration/${slug}/students/${student._id}`}
                          className="cursor-pointer rounded-[4px] bg-[#871dad] px-[6px] py-[8px] text-[16px] font-medium text-white hover:bg-[#751a99] transition-colors"
                        >
                          View
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
