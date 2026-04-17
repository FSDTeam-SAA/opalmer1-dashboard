"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import PageHeader from "@/components/sheard/PageHeader";

const teachers = [
  {
    id: 1,
    name: "Sarah Daniels",
    teacherId: "TCH-001",
    subject: "Mathematics",
    classes: 4,
    email: "sarah.d@school.io",
    active: true,
  },
  {
    id: 2,
    name: "Michael Carter",
    teacherId: "TCH-002",
    subject: "Physics",
    classes: 3,
    email: "michael.c@school.io",
    active: true,
  },
  {
    id: 3,
    name: "Priya Raman",
    teacherId: "TCH-003",
    subject: "Biology",
    classes: 5,
    email: "priya.r@school.io",
    active: false,
  },
  {
    id: 4,
    name: "David Kim",
    teacherId: "TCH-004",
    subject: "History",
    classes: 2,
    email: "david.k@school.io",
    active: true,
  },
  {
    id: 5,
    name: "Lucy Thompson",
    teacherId: "TCH-005",
    subject: "English",
    classes: 4,
    email: "lucy.t@school.io",
    active: true,
  },
  {
    id: 6,
    name: "Hassan Ali",
    teacherId: "TCH-006",
    subject: "Computer Science",
    classes: 3,
    email: "hassan.a@school.io",
    active: true,
  },
];

export function TeachersView() {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return teachers;
    return teachers.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.teacherId.toLowerCase().includes(q) ||
        t.subject.toLowerCase().includes(q) ||
        t.email.toLowerCase().includes(q),
    );
  }, [query]);

  return (
    <div className="space-y-6">
      <PageHeader title="Teachers" showBack={false} />

      <div className="rounded-[20px] bg-white p-4 sm:p-6 lg:p-8 shadow-[0px_0px_20px_0px_rgba(0,0,0,0.1)] mt-10">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <h2 className="text-[20px] sm:text-[24px] font-semibold text-[#333]">
            All Teachers
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
                placeholder="Search teachers..."
                className="h-[48px] w-full sm:w-[350px] rounded-[8px] border border-[#08374d] bg-[#f9f9f9] pl-10 pr-4 text-[16px] text-[#666] outline-none placeholder:text-[#666]"
              />
            </div>
            <button className="rounded-[10px] bg-[#871dad] cursor-pointer px-5 py-[14px] sm:py-[18px] text-[14px] sm:text-[16px] font-bold text-white hover:bg-[#751a99] transition-colors whitespace-nowrap">
              Add New Teacher
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
                  Teacher Name
                </th>
                <th className="pb-3 text-left text-[14px] font-light text-[#666]">
                  Teacher I&apos;d
                </th>
                <th className="pb-3 text-left text-[14px] font-light text-[#666]">
                  Subject
                </th>
                <th className="pb-3 text-left text-[14px] font-light text-[#666]">
                  Classes
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
              {filtered.map((t, idx) => (
                <tr key={t.id} className="border-b border-gray-100">
                  <td className="py-4 text-[16px] font-light text-[#666]">
                    {idx + 1}
                  </td>
                  <td className="py-4">
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-full bg-gray-300 overflow-hidden">
                        <div className="h-full w-full bg-gradient-to-br from-purple-300 to-purple-500" />
                      </div>
                      <span className="text-[16px] font-light text-[#666]">
                        {t.name}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 text-[16px] font-light text-[#666]">
                    {t.teacherId}
                  </td>
                  <td className="py-4 text-[16px] font-light text-[#666]">
                    {t.subject}
                  </td>
                  <td className="py-4 text-[16px] font-light text-[#666]">
                    {t.classes}
                  </td>
                  <td className="py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 text-[14px] font-medium ${
                        t.active ? "text-[#5fb892]" : "text-[#ef3c50]"
                      }`}
                    >
                      <span
                        className={`h-2 w-2 rounded-full ${
                          t.active ? "bg-[#5fb892]" : "bg-[#ef3c50]"
                        }`}
                      />
                      {t.active ? "Active" : "Inactive"}
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
                    No teachers match your search.
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
