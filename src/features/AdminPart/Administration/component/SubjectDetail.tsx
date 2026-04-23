"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronRight, ChevronDown } from "lucide-react";
import PageHeader from "@/components/sheard/PageHeader";
import { useAnalysis } from "../hooks/useAnalysis";
import { useStudentDetails } from "../hooks/useStudents";
import { Skeleton } from "@/components/ui/skeleton";
import { AnalysisData } from "../types/analysis.types";

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
function ProgressChart({ data }: { data: AnalysisData }) {
  const chartData = data.chartData;

  // Map labels to short forms
  const shortDays: Record<string, string> = {
    Saturday: "Sat",
    Sunday: "Sun",
    Monday: "Mon",
    Tuesday: "Tue",
    Wednesday: "Wed",
    Thursday: "Thu",
    Friday: "Fri",
  };

  // Generate points for the line (using daily percentage)
  const points = chartData.map((item, i) => {
    const x = (i / (chartData.length - 1)) * 600;
    const total = item.present + item.absent;
    const percentage = total > 0 ? (item.present / total) * 100 : 0;
    // Scale y: 100% -> 0, 0% -> 100
    const y = 100 - percentage;
    return [x, y];
  });

  const pathD = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p[0]} ${p[1]}`)
    .join(" ");

  return (
    <div className="rounded-[12px] bg-white p-8 shadow-[0px_0px_20px_0px_rgba(0,0,0,0.1)]">
      <div className="flex items-center justify-between pb-4">
        <h2 className="text-[20px] font-medium capitalize text-[#871dad]">
          Progress ({data.summary.percentage}%)
        </h2>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-[14px] text-[#666]">
            <span className="h-2 w-2 rounded-full bg-[#4aa678]" />
            Present: {data.summary.present}
          </div>
          <div className="flex items-center gap-2 text-[14px] text-[#666]">
            <span className="h-2 w-2 rounded-full bg-[#e64540]" />
            Absent: {data.summary.absent}
          </div>
          <button className="flex items-center gap-1 rounded-[30px] border border-[#871dad] px-3 py-1 text-[12px] text-[#871dad]">
            {data.filter}
            <ChevronDown size={14} />
          </button>
        </div>
      </div>

      <div className="relative">
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 flex h-[300px] flex-col justify-between text-[13px] text-[#848a9c]">
          <span>100%</span>
          <span>75%</span>
          <span>50%</span>
          <span>25%</span>
          <span>0%</span>
        </div>

        {/* Chart area */}
        <div className="ml-10">
          <svg
            viewBox="0 0 600 100"
            className="h-[300px] w-full"
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
                strokeWidth="0.3"
                strokeDasharray="4 4"
              />
            ))}
            {/* Overall Percentage Line (Dashed) */}
            <line
              x1="0"
              y1={100 - parseFloat(data.summary.percentage)}
              x2="600"
              y2={100 - parseFloat(data.summary.percentage)}
              stroke="#871dad"
              strokeWidth="1"
              strokeDasharray="5 5"
              opacity="0.5"
            />
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
            {/* Points */}
            {points.map((p, i) => (
              <circle
                key={i}
                cx={p[0]}
                cy={p[1]}
                r="3"
                fill="white"
                stroke="#871dad"
                strokeWidth="1.5"
              />
            ))}
            <defs>
              <linearGradient id="subjectGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#871dad" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#871dad" stopOpacity="0.05" />
              </linearGradient>
            </defs>
          </svg>

          {/* X-axis labels */}
          <div className="mt-2 flex justify-between text-[13px] text-[#848a9c]">
            {chartData.map((item) => (
              <span key={item.label}>
                {shortDays[item.label] || item.label}
              </span>
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
  basePath = "/admin/administration",
}: {
  slug?: string;
  studentSlug: string;
  subjectSlug: string;
  basePath?: string;
}) {
  const subjectName = subjectSlug.replace(/-/g, " ");
  const prefix = slug ? `${basePath}/${slug}` : `${basePath}`;
  const root = `${prefix}/students/${studentSlug}/${subjectSlug}`;

  // 1. Get student details to find the classId for this subject
  const {
    data: studentData,
    isLoading: isLoadingStudent,
    isError: isErrorStudent,
  } = useStudentDetails(studentSlug);

  const subjectInfo = studentData?.subjects.find(
    (s) => s.subject.toLowerCase() === subjectName.toLowerCase(),
  );

  const classId = subjectInfo?.classId || "";

  // 2. Fetch analysis data
  const {
    data: analysisData,
    isLoading: isLoadingAnalysis,
    isError: isErrorAnalysis,
  } = useAnalysis(classId, studentSlug);

  if (isLoadingStudent || isLoadingAnalysis) {
    return (
      <div className="space-y-8 pt-10 mt-16">
        <PageHeader title={subjectName} />
        <Skeleton className="h-[300px] w-full rounded-[12px]" />
        <Skeleton className="h-[120px] w-fit rounded-[20px]" />
      </div>
    );
  }

  if (isErrorStudent || isErrorAnalysis || !analysisData) {
    return (
      <div className="space-y-8 pt-10 mt-16">
        <PageHeader title={subjectName} />
        <div className="rounded-[20px] bg-white p-10 text-center shadow-[0px_0px_20px_0px_rgba(0,0,0,0.08)]">
          <p className="text-[18px] font-medium text-[#e64540]">
            Failed to load subject analysis
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pt-10 mt-16">
      <PageHeader title={subjectName} />
      {/* Progress Chart */}
      <ProgressChart data={analysisData} />

      {/* Teacher Profile */}
      {/* <div>
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
      </div> */}

      {/* Class Information */}
      <div>
        <h2 className="text-[30px] font-semibold text-[#333]">
          Class Information
        </h2>
        <div className="mt-4 grid grid-cols-2 gap-5">
          {classInfoItems.map((item) => {
            const itemSlug = item.replace(/\s+/g, "-").toLowerCase();
            const hrefMap: Record<string, string> = {
              "Home Work": `${root}/homework`,
              Attendance: `${root}/attendance`,
              Lessons: `${root}/lessons`,
              "Behavior Record": `${root}/behavior-record`,
              "Academic Notes": `${root}/academic-notes`,
              "Grading Progress": `${root}/grading-progress`,
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
