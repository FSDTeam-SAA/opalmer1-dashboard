"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronRight, ChevronDown } from "lucide-react";

/* ───── Class Info Items ───── */
const classInfoItems = [
  "Home Work",
  "Attendance",
  "Lessons",
  "Behavior Record",
  "Academic Notes",
  "Grading Progress",
];

/* ───── Progress Chart ───── */
function ProgressChart() {
  const points = [
    [0, 70],
    [50, 68],
    [100, 72],
    [150, 60],
    [200, 55],
    [250, 50],
    [300, 40],
    [350, 35],
    [400, 45],
    [450, 50],
    [500, 55],
    [550, 60],
    [600, 65],
  ];

  const pathD = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p[0]} ${p[1]}`)
    .join(" ");

  return (
    <div className="rounded-[12px] bg-white p-8 shadow-[0px_0px_20px_0px_rgba(0,0,0,0.1)]">
      <div className="flex items-center justify-between pb-4">
        <h2 className="text-[20px] font-medium capitalize text-[#871dad]">
          Progress
        </h2>
        <button className="flex items-center gap-1 rounded-[30px] border border-[#871dad] px-3 py-1 text-[12px] text-[#871dad]">
          Weekly
          <ChevronDown size={14} />
        </button>
      </div>

      <div className="relative">
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 flex h-[200px] flex-col justify-between text-[13px] text-[#848a9c]">
          <span>100</span>
          <span>50</span>
          <span>40</span>
          <span>30</span>
          <span>20</span>
          <span>10</span>
        </div>

        {/* Chart area */}
        <div className="ml-10">
          <svg
            viewBox="0 0 600 100"
            className="h-[200px] w-full"
            preserveAspectRatio="none"
          >
            {/* Grid lines */}
            {[0, 20, 40, 60, 80, 100].map((y) => (
              <line
                key={y}
                x1="0"
                y1={y}
                x2="600"
                y2={y}
                stroke="#e5e5e5"
                strokeWidth="0.3"
                strokeDasharray="4 4"
              />
            ))}
            {/* Area fill */}
            <path
              d={`${pathD} L 600 100 L 0 100 Z`}
              fill="url(#subjectGradient)"
              opacity="0.3"
            />
            {/* Line */}
            <path
              d={pathD}
              fill="none"
              stroke="#871dad"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Highlight dot */}
            <circle
              cx="350"
              cy="35"
              r="4"
              fill="white"
              stroke="#871dad"
              strokeWidth="2"
            />
            <defs>
              <linearGradient id="subjectGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#871dad" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#871dad" stopOpacity="0.05" />
              </linearGradient>
            </defs>
          </svg>

          {/* X-axis labels */}
          <div className="mt-2 flex justify-between text-[13px] text-[#848a9c]">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <span key={day}>{day}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SubjectDetail({
  slug,
  studentSlug,
  subjectSlug,
}: {
  slug: string;
  studentSlug: string;
  subjectSlug: string;
}) {
  const subjectName = subjectSlug.replace(/-/g, " ");

  return (
    <div className="space-y-8 pt-10 mt-16">
      {/* Progress Chart */}
      <ProgressChart />

      {/* Teacher Profile */}
      <div>
        <h2 className="text-[30px] font-semibold text-[#333]">
          Teacher Profile
        </h2>
        <div className="mt-4 flex w-fit items-center gap-5 rounded-[20px] bg-white px-5 py-5 shadow-[0px_0px_20px_0px_rgba(0,0,0,0.1)]">
          <div className="h-[80px] w-[80px] flex-shrink-0 overflow-hidden rounded-full">
            <Image
              src="/images/12043465729ab7c8ceffce00749e7c71df0c9e25.jpg"
              alt="Olivia Carter"
              width={80}
              height={80}
              className="h-full w-full object-cover"
            />
          </div>
          <p className="text-[28px] font-semibold text-[#333]">Olivia Carter</p>
        </div>
      </div>

      {/* Class Information */}
      <div>
        <h2 className="text-[30px] font-semibold text-[#333]">
          Class Information
        </h2>
        <div className="mt-4 grid grid-cols-2 gap-5">
          {classInfoItems.map((item) => {
            const itemSlug = item.replace(/\s+/g, "-").toLowerCase();
            const basePath = `/admin/administration/${slug}/students/${studentSlug}/${subjectSlug}`;
            const hrefMap: Record<string, string> = {
              "Home Work": `${basePath}/homework`,
              Attendance: `${basePath}/attendance`,
              Lessons: `${basePath}/lessons`,
            };
            const href = hrefMap[item];

            if (href) {
              return (
                <Link
                  key={item}
                  href={href}
                  className="flex items-center justify-between rounded-[16px] bg-white px-6 py-5 shadow-[0px_0px_20px_0px_rgba(6,51,54,0.1)] transition-colors hover:bg-gray-50"
                >
                  <span className="text-[24px] font-bold text-[#333]">
                    {item}
                  </span>
                  <ChevronRight size={24} className="text-[#333]" />
                </Link>
              );
            }

            return (
              <button
                key={item}
                className="flex cursor-pointer items-center justify-between rounded-[16px] bg-white px-6 py-5 shadow-[0px_0px_20px_0px_rgba(6,51,54,0.1)] transition-colors hover:bg-gray-50"
              >
                <span className="text-[24px] font-bold text-[#333]">
                  {item}
                </span>
                <ChevronRight size={24} className="text-[#333]" />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
