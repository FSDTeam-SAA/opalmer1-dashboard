"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import PageHeader from "@/components/sheard/PageHeader";

const admins = [
  {
    id: 1,
    name: "Jordan Pierce",
    adminId: "jordan_pierce",
    role: "Super Admin",
    students: 212,
    teachers: 42,
    active: true,
  },
  {
    id: 2,
    name: "Taylor Brooks",
    adminId: "taylor_brooks",
    role: "Admin",
    students: 180,
    teachers: 35,
    active: true,
  },
  {
    id: 3,
    name: "Morgan Reed",
    adminId: "morgan_reed",
    role: "Editor",
    students: 95,
    teachers: 20,
    active: true,
  },
  {
    id: 4,
    name: "Casey Lin",
    adminId: "casey_lin",
    role: "Viewer",
    students: 60,
    teachers: 12,
    active: false,
  },
];

function ToggleSwitch({
  active,
  onChange,
}: {
  active: boolean;
  onChange: () => void;
}) {
  return (
    <button
      onClick={onChange}
      className={`relative h-[19px] w-[41px] rounded-full cursor-pointer transition-colors ${
        active ? "bg-[#871dad]" : "bg-[#c7c7c7]"
      }`}
    >
      <span
        className={`absolute top-[1px] h-[17px] w-[17px] rounded-full bg-white shadow transition-transform ${
          active ? "left-[24px]" : "left-[4px]"
        }`}
      />
    </button>
  );
}

export function AdministrationView() {
  const [query, setQuery] = useState("");
  const [rows, setRows] = useState(admins);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return rows;
    return rows.filter(
      (a) =>
        a.name.toLowerCase().includes(q) ||
        a.adminId.toLowerCase().includes(q) ||
        a.role.toLowerCase().includes(q),
    );
  }, [rows, query]);

  const toggle = (id: number) => {
    setRows((prev) =>
      prev.map((a) => (a.id === id ? { ...a, active: !a.active } : a)),
    );
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Administration" showBack={false} />

      <div className="rounded-[20px] bg-white p-4 sm:p-6 lg:p-8 shadow-[0px_0px_20px_0px_rgba(0,0,0,0.1)] mt-10">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <h2 className="text-[20px] sm:text-[24px] font-semibold text-[#333]">
            Administrator Id&apos;s
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
                placeholder="Enter administrator Id"
                className="h-[48px] w-full sm:w-[350px] rounded-[8px] border border-[#08374d] bg-[#f9f9f9] pl-10 pr-4 text-[16px] text-[#666] outline-none placeholder:text-[#666]"
              />
            </div>
            <button className="rounded-[10px] bg-[#871dad] cursor-pointer px-5 py-[14px] sm:py-[18px] text-[14px] sm:text-[16px] font-bold text-white hover:bg-[#751a99] transition-colors whitespace-nowrap">
              Add New Administrator
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
                  Administrator Name
                </th>
                <th className="pb-3 text-left text-[14px] font-light text-[#666]">
                  Administrator I&apos;d
                </th>
                <th className="pb-3 text-left text-[14px] font-light text-[#666]">
                  Role
                </th>
                <th className="pb-3 text-left text-[14px] font-light text-[#666]">
                  Total Students
                </th>
                <th className="pb-3 text-left text-[14px] font-light text-[#666]">
                  Total Teachers
                </th>
                <th className="pb-3 text-center text-[14px] font-light text-[#666] w-[120px]">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((a, idx) => (
                <tr key={a.id} className="border-b border-gray-100">
                  <td className="py-4 text-[16px] font-light text-[#666]">
                    {idx + 1}
                  </td>
                  <td className="py-4">
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-full bg-gray-300 overflow-hidden">
                        <div className="h-full w-full bg-gradient-to-br from-purple-300 to-purple-500" />
                      </div>
                      <span className="text-[16px] font-light text-[#666]">
                        {a.name}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 text-[16px] font-light text-[#666]">
                    {a.adminId}
                  </td>
                  <td className="py-4 text-[16px] font-light text-[#666]">
                    {a.role}
                  </td>
                  <td className="py-4 text-[16px] font-light text-[#666]">
                    {a.students}
                  </td>
                  <td className="py-4 text-[16px] font-light text-[#666]">
                    {a.teachers}
                  </td>
                  <td className="py-4">
                    <div className="flex items-center justify-center gap-3">
                      <ToggleSwitch
                        active={a.active}
                        onChange={() => toggle(a.id)}
                      />
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
                    No administrators match your search.
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
