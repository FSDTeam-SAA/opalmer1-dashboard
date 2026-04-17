"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import PageHeader from "@/components/sheard/PageHeader";

const students = [
  {
    id: 1,
    name: "Amelia Johnson",
    studentId: "STU-001",
    grade: "Grade 10",
    class: "10-A",
    email: "amelia.j@school.io",
    active: true,
  },
  {
    id: 2,
    name: "Noah Williams",
    studentId: "STU-002",
    grade: "Grade 9",
    class: "9-B",
    email: "noah.w@school.io",
    active: true,
  },
  {
    id: 3,
    name: "Olivia Brown",
    studentId: "STU-003",
    grade: "Grade 11",
    class: "11-C",
    email: "olivia.b@school.io",
    active: false,
  },
  {
    id: 4,
    name: "Liam Davis",
    studentId: "STU-004",
    grade: "Grade 8",
    class: "8-A",
    email: "liam.d@school.io",
    active: true,
  },
  {
    id: 5,
    name: "Emma Wilson",
    studentId: "STU-005",
    grade: "Grade 12",
    class: "12-A",
    email: "emma.w@school.io",
    active: true,
  },
  {
    id: 6,
    name: "James Miller",
    studentId: "STU-006",
    grade: "Grade 9",
    class: "9-A",
    email: "james.m@school.io",
    active: false,
  },
];

export function StudentsView() {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return students;
    return students.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.studentId.toLowerCase().includes(q) ||
        s.class.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q),
    );
  }, [query]);

  return (
    <div className="space-y-6">
      <PageHeader title="Students" showBack={false} />

      <div className="rounded-[20px] bg-white p-4 sm:p-6 lg:p-8 shadow-[0px_0px_20px_0px_rgba(0,0,0,0.1)] mt-10">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <h2 className="text-[20px] sm:text-[24px] font-semibold text-[#333]">
            All Students
          </h2>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
            <div className="relative">
              <Search
                size={20}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#666]"
              />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                type="text"
                placeholder="Search students..."
                className="h-[48px] w-full sm:w-[350px] rounded-[8px] border border-[#08374d] bg-[#f9f9f9] pl-10 pr-4 text-[16px] text-[#666] outline-none placeholder:text-[#666]"
              />
            </div>
            <button className="rounded-[10px] bg-[#871dad] cursor-pointer px-5 py-[14px] sm:py-[18px] text-[14px] sm:text-[16px] font-bold text-white hover:bg-[#751a99] transition-colors whitespace-nowrap">
              Add New Student
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[780px]">
            <thead>
              <tr className="border-b-2 border-[#871dad]">
                <th className="pb-3 text-left text-[14px] font-light text-[#666] w-[60px]">
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
                  Class
                </th>
                <th className="pb-3 text-left text-[14px] font-light text-[#666]">
                  Status
                </th>
                <th className="pb-3 text-center text-[14px] font-light text-[#666] w-[120px]">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s, idx) => (
                <tr key={s.id} className="border-b border-gray-100">
                  <td className="py-4 text-[16px] font-light text-[#666]">
                    {idx + 1}
                  </td>
                  <td className="py-4">
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-full bg-gray-300 overflow-hidden">
                        <div className="h-full w-full bg-gradient-to-br from-purple-300 to-purple-500" />
                      </div>
                      <span className="text-[16px] font-light text-[#666]">
                        {s.name}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 text-[16px] font-light text-[#666]">
                    {s.studentId}
                  </td>
                  <td className="py-4 text-[16px] font-light text-[#666]">
                    {s.grade}
                  </td>
                  <td className="py-4 text-[16px] font-light text-[#666]">
                    {s.class}
                  </td>
                  <td className="py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 text-[14px] font-medium ${
                        s.active ? "text-[#5fb892]" : "text-[#ef3c50]"
                      }`}
                    >
                      <span
                        className={`h-2 w-2 rounded-full ${
                          s.active ? "bg-[#5fb892]" : "bg-[#ef3c50]"
                        }`}
                      />
                      {s.active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="py-4">
                    <div className="flex items-center justify-center">
                      <button className="rounded-[4px] bg-[#871dad] px-[6px] py-[8px] text-[16px] font-medium text-white hover:bg-[#751a99] transition-colors cursor-pointer">
                        View
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="py-10 text-center text-[14px] text-[#666]"
                  >
                    No students match your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
