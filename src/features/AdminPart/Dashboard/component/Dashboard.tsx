"use client";

import { useState } from "react";
import {
  GraduationCap,
  Briefcase,
  Users,
  ArrowUp,
  ArrowDown,
  Search,
  ChevronDown,
} from "lucide-react";
import PageHeader from "@/components/sheard/PageHeader";

/* ───── Stat Cards ───── */
const stats = [
  {
    label: "Students",
    value: "1,02,456",
    icon: GraduationCap,
    color: "#3f99b4",
    bgColor: "rgba(63,153,180,0.1)",
    change: "+6.5%",
    changeType: "up" as const,
  },
  {
    label: "Teachers",
    value: "$3,456",
    icon: Briefcase,
    color: "#4aa678",
    bgColor: "rgba(74,166,120,0.1)",
    change: "-0.10%",
    changeType: "down" as const,
  },
  {
    label: "Parents",
    value: "10%",
    icon: Users,
    color: "#febd43",
    bgColor: "rgba(254,189,67,0.1)",
    change: "-0.10%",
    changeType: "down" as const,
  },
];

/* ───── Admin Table Data ───── */
const administrators = [
  {
    id: 1,
    name: "Eren Yaeger",
    adminId: "eren_yaeger",
    students: 155,
    teachers: 25,
    active: false,
  },
  {
    id: 2,
    name: "Eren Yaeger",
    adminId: "eren_yaeger",
    students: 155,
    teachers: 25,
    active: false,
  },
  {
    id: 3,
    name: "Eren Yaeger",
    adminId: "eren_yaeger",
    students: 155,
    teachers: 25,
    active: true,
  },
  {
    id: 4,
    name: "Eren Yaeger",
    adminId: "eren_yaeger",
    students: 155,
    teachers: 25,
    active: true,
  },
  {
    id: 5,
    name: "Eren Yaeger",
    adminId: "eren_yaeger",
    students: 155,
    teachers: 25,
    active: true,
  },
];

/* ───── Toggle Switch ───── */
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

/* ───── Stat Card ───── */
function StatCard({ stat }: { stat: (typeof stats)[0] }) {
  const Icon = stat.icon;
  return (
    <div className="flex-1 rounded-[12px] mt-10 bg-white p-5 shadow-[0px_0px_20px_0px_rgba(0,0,0,0.1)]">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <div
            className="h-[44px] w-[4px] rounded-[10px]"
            style={{ backgroundColor: stat.color }}
          />
          <div>
            <p className="text-[14px] text-[#666]">{stat.label}</p>
            <p className="mt-1 text-[20px] font-medium text-[#333]">
              {stat.value}
            </p>
          </div>
        </div>
        <div
          className="flex h-8 w-8 items-center justify-center rounded-[4px]"
          style={{ backgroundColor: stat.bgColor }}
        >
          <Icon size={24} style={{ color: stat.color }} />
        </div>
      </div>
      <div className="mt-3 flex items-center gap-1">
        {stat.changeType === "up" ? (
          <ArrowUp size={16} className="text-[#5fb892]" />
        ) : (
          <ArrowDown size={16} className="text-[#ef3c50]" />
        )}
        <p className="text-[12px] text-[#666]">
          <span
            className={
              stat.changeType === "up" ? "text-[#5fb892]" : "text-[#ef3c50]"
            }
          >
            {stat.change}
          </span>{" "}
          Since last week
        </p>
      </div>
    </div>
  );
}

/* ───── Growth Chart (SVG placeholder) ───── */
function GrowthChart() {
  const points = [
    [0, 75],
    [80, 65],
    [160, 55],
    [240, 50],
    [320, 40],
    [400, 45],
    [480, 30],
    [560, 25],
    [600, 15],
  ];

  const pathD = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p[0]} ${p[1]}`)
    .join(" ");

  return (
    <div className="flex-1 rounded-[20px] bg-white p-8 shadow-[0px_0px_20px_0px_rgba(0,0,0,0.1)]">
      <div className="flex items-center justify-between pb-4">
        <h2 className="text-[24px] font-semibold text-[#131313]">Growth</h2>
        <button className="flex items-center gap-1 text-[16px] text-[#454545]">
          Yearly
          <ChevronDown size={18} />
        </button>
      </div>
      <div className="relative">
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 flex h-[200px] flex-col justify-between text-[12px] font-medium text-[#7d7d7d]">
          <span>100k</span>
          <span>50k</span>
          <span>20k</span>
          <span>10k</span>
          <span>0</span>
        </div>
        {/* Chart area */}
        <div className="ml-12">
          <svg
            viewBox="0 0 600 100"
            className="h-[200px] w-full"
            preserveAspectRatio="none"
          >
            {/* Grid lines */}
            {[0, 25, 50, 75, 100].map((y) => (
              <line
                key={y}
                x1="0"
                y1={y}
                x2="600"
                y2={y}
                stroke="#e5e5e5"
                strokeWidth="0.5"
                strokeDasharray="4 4"
              />
            ))}
            {/* Area fill */}
            <path
              d={`${pathD} L 600 100 L 0 100 Z`}
              fill="url(#growthGradient)"
              opacity="0.3"
            />
            {/* Line */}
            <path
              d={pathD}
              fill="none"
              stroke="#871dad"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Dots */}
            {points.map((p, i) => (
              <circle
                key={i}
                cx={p[0]}
                cy={p[1]}
                r="3"
                fill="#871dad"
                stroke="white"
                strokeWidth="1.5"
              />
            ))}
            <defs>
              <linearGradient id="growthGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#871dad" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#871dad" stopOpacity="0.05" />
              </linearGradient>
            </defs>
          </svg>
          {/* X-axis labels */}
          <div className="mt-2 flex justify-between text-[12px] font-medium text-[#7d7d7d]">
            {[
              "2016",
              "2017",
              "2018",
              "2019",
              "2020",
              "2021",
              "2022",
              "2023",
            ].map((year) => (
              <span key={year}>{year}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ───── Students Donut Chart ───── */
function StudentsDonut() {
  const male = 70;
  const female = 30;
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const maleArc = (male / 100) * circumference;
  const femaleArc = (female / 100) * circumference;

  return (
    <div className="w-[274px] rounded-[20px] bg-white p-6 shadow-[0px_0px_20px_0px_rgba(0,0,0,0.1)]">
      <h2 className="text-center text-[20px] font-medium text-[#333]">
        Students
      </h2>
      <div className="flex items-center justify-center py-6">
        <svg width="160" height="160" viewBox="0 0 160 160">
          <circle
            cx="80"
            cy="80"
            r={radius}
            fill="none"
            stroke="#c084fc"
            strokeWidth="20"
          />
          <circle
            cx="80"
            cy="80"
            r={radius}
            fill="none"
            stroke="#871dad"
            strokeWidth="20"
            strokeDasharray={`${maleArc} ${circumference}`}
            strokeDashoffset="0"
            transform="rotate(-90 80 80)"
          />
        </svg>
      </div>
      {/* Legend */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="h-4 w-4 rounded-full bg-[#871dad]" />
            <span className="text-[12px] text-[#666]">Male</span>
          </div>
          <span className="text-[14px] font-medium text-[#333]">70%</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="h-4 w-4 rounded-full bg-[#c084fc]" />
            <span className="text-[12px] text-[#666]">Female</span>
          </div>
          <span className="text-[14px] font-medium text-[#333]">30%</span>
        </div>
      </div>
    </div>
  );
}

/* ───── Main Dashboard ───── */
export default function Dashboard() {
  const [admins, setAdmins] = useState(administrators);

  const toggleAdmin = (id: number) => {
    setAdmins((prev) =>
      prev.map((a) => (a.id === id ? { ...a, active: !a.active } : a)),
    );
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Main Dashboard" showBack={false} />
      {/* Stat Cards */}
      <div className="flex gap-5">
        {stats.map((stat) => (
          <StatCard key={stat.label} stat={stat} />
        ))}
      </div>

      {/* Charts Row */}
      <div className="flex gap-5">
        <GrowthChart />
        <StudentsDonut />
      </div>

      {/* Administrator Table */}
      <div className="rounded-[20px] bg-white p-8 shadow-[0px_0px_20px_0px_rgba(0,0,0,0.1)]">
        {/* Table Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[24px] font-semibold text-[#333]">
            Administrator Id&apos;s
          </h2>
          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="relative">
              <Search
                size={20}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#666]"
              />
              <input
                type="text"
                placeholder="Enter administrator Id"
                className="h-[48px] w-[350px] rounded-[8px] border border-[#08374d] bg-[#f9f9f9] pl-10 pr-4 text-[16px] text-[#666] outline-none placeholder:text-[#666]"
              />
            </div>
            {/* Add Button */}
            <button className="rounded-[10px] bg-[#871dad] px-5 py-[18px] text-[16px] font-bold text-white hover:bg-[#751a99] transition-colors">
              Add New Administrator
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
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
              {admins.map((admin) => (
                <tr key={admin.id} className="border-b border-gray-100">
                  <td className="py-4 text-[16px] font-light text-[#666]">
                    {admin.id}
                  </td>
                  <td className="py-4">
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-full bg-gray-300 overflow-hidden">
                        <div className="h-full w-full bg-gradient-to-br from-purple-300 to-purple-500" />
                      </div>
                      <span className="text-[16px] font-light text-[#666]">
                        {admin.name}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 text-[16px] font-light text-[#666]">
                    {admin.adminId}
                  </td>
                  <td className="py-4 text-[16px] font-light text-[#666]">
                    {admin.students}
                  </td>
                  <td className="py-4 text-[16px] font-light text-[#666]">
                    {admin.teachers}
                  </td>
                  <td className="py-4">
                    <div className="flex items-center justify-center gap-3">
                      <ToggleSwitch
                        active={admin.active}
                        onChange={() => toggleAdmin(admin.id)}
                      />
                      <button className="rounded-[4px] bg-[#871dad] cursor-pointer px-[6px] py-[8px] text-[16px] font-medium text-white hover:bg-[#751a99] transition-colors">
                        View
                      </button>
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
