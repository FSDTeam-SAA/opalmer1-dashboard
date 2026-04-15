"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search } from "lucide-react";
import PageHeader from "@/components/sheard/PageHeader";

/* ───── Student Table Data ───── */
const studentsTableData = Array.from({ length: 14 }, (_, i) => ({
  id: i + 1,
  name: "Eren Yaeger",
  studentId: "eren_yaeger",
  grade: "06",
  age: "120Years",
  attendance: "92%",
  image: "/images/4f8da1b70693c4fcf9e01b9293706aed5cd4e34d.jpg",
}));

export default function StudentsTable({ slug }: { slug: string }) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredStudents = studentsTableData.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.studentId.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="mt-32 pt-10">
      <PageHeader title="Students" />
      <div className="rounded-[20px] bg-white p-8 shadow-[0px_0px_20px_0px_rgba(0,0,0,0.1)]">
        {/* Header */}
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

        {/* Table */}
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
                <tr key={student.id} className="border-b border-gray-100">
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
                        href={`/admin/administration/${slug}/students/${student.name.replace(/\s+/g, "-")}`}
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
      </div>
    </div>
  );
}
