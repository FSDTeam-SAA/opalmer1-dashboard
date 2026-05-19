"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import {
  ArrowDown,
  ArrowUp,
  Building2,
  Briefcase,
  ChevronDown,
  Edit3,
  GraduationCap,
  Mail,
  MapPin,
  Phone,
  Users,
} from "lucide-react";
import PageHeader from "@/components/sheard/PageHeader";
import { Skeleton } from "@/components/ui/skeleton";
import { useStudentGenderStats, useUserStats } from "../hooks/useDashboard";
import { useMySchool } from "../hooks/useSchool";
import type { School } from "../types/school.types";
import ManageSchoolModal from "./ManageSchoolModal";
import { DonutSkeleton, StatCardSkeleton } from "./shared/Skeletons";
import { ErrorFallback } from "./shared/ErrorFallback";

type StatDisplay = {
  label: string;
  value: string;
  icon: typeof GraduationCap;
  color: string;
  bgColor: string;
  change: string;
  changeType: "up" | "down";
};

function StatCard({ stat }: { stat: StatDisplay }) {
  const Icon = stat.icon;
  return (
    <div className="mt-10 flex-1 rounded-[12px] bg-white p-5 shadow-[0px_0px_20px_0px_rgba(0,0,0,0.1)]">
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
    <div className="flex-1 rounded-[20px] bg-white p-6 shadow-[0px_0px_20px_0px_rgba(0,0,0,0.1)] sm:p-8">
      <div className="flex items-center justify-between pb-4">
        <h2 className="text-[20px] font-semibold text-[#131313] sm:text-[24px]">
          Growth
        </h2>
        <button className="flex items-center gap-1 text-[14px] text-[#454545] sm:text-[16px]">
          Yearly
          <ChevronDown size={18} />
        </button>
      </div>
      <div className="relative">
        <div className="absolute left-0 top-0 flex h-[200px] flex-col justify-between text-[12px] font-medium text-[#7d7d7d]">
          <span>100k</span>
          <span>50k</span>
          <span>20k</span>
          <span>10k</span>
          <span>0</span>
        </div>
        <div className="ml-12">
          <svg
            viewBox="0 0 600 100"
            className="h-[200px] w-full"
            preserveAspectRatio="none"
          >
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
            <path
              d={`${pathD} L 600 100 L 0 100 Z`}
              fill="url(#growthGradient)"
              opacity="0.3"
            />
            <path
              d={pathD}
              fill="none"
              stroke="#871dad"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
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

function StudentsDonut() {
  const {
    data: genderStats,
    isLoading,
    isError,
    error,
    refetch,
  } = useStudentGenderStats();

  const { malePct, femalePct } = useMemo(() => {
    const male = genderStats?.male ?? 0;
    const female = genderStats?.female ?? 0;
    const other = genderStats?.other ?? 0;
    const total = male + female + other;
    if (total === 0) return { malePct: 0, femalePct: 0 };
    return {
      malePct: Math.round((male / total) * 100),
      femalePct: Math.round((female / total) * 100),
    };
  }, [genderStats]);

  if (isLoading) return <DonutSkeleton />;
  if (isError) {
    return (
      <div className="w-full lg:w-[274px]">
        <ErrorFallback
          title="Couldn't load gender stats"
          error={error}
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const maleArc = (malePct / 100) * circumference;

  return (
    <div className="w-full rounded-[20px] bg-white p-6 shadow-[0px_0px_20px_0px_rgba(0,0,0,0.1)] lg:w-[274px]">
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
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="h-4 w-4 rounded-full bg-[#871dad]" />
            <span className="text-[12px] text-[#666]">Male</span>
          </div>
          <span className="text-[14px] font-medium text-[#333]">
            {malePct}%
          </span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="h-4 w-4 rounded-full bg-[#c084fc]" />
            <span className="text-[12px] text-[#666]">Female</span>
          </div>
          <span className="text-[14px] font-medium text-[#333]">
            {femalePct}%
          </span>
        </div>
      </div>
    </div>
  );
}

function formatLocation(school: School) {
  return [school.address, school.city, school.state, school.country]
    .filter(Boolean)
    .join(", ");
}

function SchoolInfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Building2;
  label: string;
  value?: string | number;
}) {
  return (
    <div className="flex min-h-[52px] items-center gap-3 rounded-[10px] bg-[#f9f9f9] px-4 py-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[6px] bg-[#871dad]/10 text-[#871dad]">
        <Icon size={18} />
      </div>
      <div className="min-w-0">
        <p className="text-[12px] text-[#777]">{label}</p>
        <p className="truncate text-[15px] font-medium text-[#333]">
          {value || "Not added"}
        </p>
      </div>
    </div>
  );
}

function SchoolPanel({
  school,
  isLoading,
  isError,
  error,
  onRetry,
  onManage,
}: {
  school?: School;
  isLoading: boolean;
  isError: boolean;
  error: unknown;
  onRetry: () => void;
  onManage: () => void;
}) {
  if (isLoading) {
    return (
      <div className="rounded-[20px] bg-white p-4 shadow-[0px_0px_20px_0px_rgba(0,0,0,0.1)] sm:p-6 lg:p-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <Skeleton className="h-20 w-20 rounded-[16px]" />
            <div className="space-y-3">
              <Skeleton className="h-6 w-[220px]" />
              <Skeleton className="h-4 w-[150px]" />
            </div>
          </div>
          <Skeleton className="h-12 w-[160px] rounded-[10px]" />
        </div>
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-[76px] rounded-[10px]" />
          ))}
        </div>
      </div>
    );
  }

  if (isError || !school?._id) {
    return (
      <div className="rounded-[20px] bg-white p-4 shadow-[0px_0px_20px_0px_rgba(0,0,0,0.1)] sm:p-6 lg:p-8">
        <ErrorFallback
          title="No school assigned"
          message="This administrator account does not have an assigned school yet."
          error={isError ? error : undefined}
          onRetry={onRetry}
        />
      </div>
    );
  }

  const location = formatLocation(school);

  return (
    <div className="rounded-[20px] bg-white p-4 shadow-[0px_0px_20px_0px_rgba(0,0,0,0.1)] sm:p-6 lg:p-8">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-[16px] bg-[#f4edf7]">
            {school.logo ? (
              <Image
                src={school.logo}
                alt={school.name || "Assigned school"}
                width={80}
                height={80}
                className="h-full w-full object-cover"
              />
            ) : (
              <Building2 size={34} className="text-[#871dad]" />
            )}
          </div>
          <div className="min-w-0">
            <p className="text-[14px] font-medium text-[#871dad]">
              Assigned School
            </p>
            <h2 className="mt-1 truncate text-[24px] font-semibold text-[#333] sm:text-[28px]">
              {school.name || "Unnamed school"}
            </h2>
            <p className="mt-1 text-[14px] text-[#666]">
              {school.code ? `Code: ${school.code}` : "No school code added"}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onManage}
          className="inline-flex items-center justify-center gap-2 rounded-[10px] bg-[#871dad] px-5 py-[14px] text-[15px] font-bold text-white transition-colors hover:bg-[#751a99]"
        >
          <Edit3 size={18} />
          Manage School
        </button>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <SchoolInfoRow icon={Mail} label="Email" value={school.email} />
        <SchoolInfoRow icon={Phone} label="Phone" value={school.phone} />
        <SchoolInfoRow icon={MapPin} label="Location" value={location} />
        <SchoolInfoRow
          icon={Building2}
          label="Established"
          value={school.establishedYear}
        />
      </div>
    </div>
  );
}

export function DashboardView() {
  const [showManageSchool, setShowManageSchool] = useState(false);

  const {
    data: userStats,
    isLoading: statsLoading,
    isError: statsError,
    error: statsErrorObj,
    refetch: refetchStats,
  } = useUserStats();

  const {
    data: school,
    isLoading: schoolLoading,
    isError: schoolError,
    error: schoolErrorObj,
    refetch: refetchSchool,
  } = useMySchool();

  const stats: StatDisplay[] = useMemo(
    () => [
      {
        label: "Students",
        value: (userStats?.totalStudents ?? 0).toLocaleString(),
        icon: GraduationCap,
        color: "#3f99b4",
        bgColor: "rgba(63,153,180,0.1)",
        change: "+6.5%",
        changeType: "up",
      },
      {
        label: "Teachers",
        value: (userStats?.totalTeachers ?? 0).toLocaleString(),
        icon: Briefcase,
        color: "#4aa678",
        bgColor: "rgba(74,166,120,0.1)",
        change: "-0.10%",
        changeType: "down",
      },
      {
        label: "Parents",
        value: (userStats?.totalParents ?? 0).toLocaleString(),
        icon: Users,
        color: "#febd43",
        bgColor: "rgba(254,189,67,0.1)",
        change: "-0.10%",
        changeType: "down",
      },
    ],
    [userStats],
  );

  return (
    <div className="space-y-6">
      <PageHeader title="Main Dashboard" showBack={false} />

      <div className="flex flex-col gap-5 md:flex-row">
        {statsLoading &&
          Array.from({ length: 3 }).map((_, i) => <StatCardSkeleton key={i} />)}

        {!statsLoading && statsError && (
          <div className="mt-10 flex-1">
            <ErrorFallback
              title="Couldn't load dashboard stats"
              error={statsErrorObj}
              onRetry={() => refetchStats()}
            />
          </div>
        )}

        {!statsLoading &&
          !statsError &&
          stats.map((stat) => <StatCard key={stat.label} stat={stat} />)}
      </div>

      <div className="flex flex-col gap-5 lg:flex-row">
        <GrowthChart />
        <StudentsDonut />
      </div>

      <SchoolPanel
        school={school}
        isLoading={schoolLoading}
        isError={schoolError}
        error={schoolErrorObj}
        onRetry={() => refetchSchool()}
        onManage={() => setShowManageSchool(true)}
      />

      {showManageSchool && school?._id && (
        <ManageSchoolModal
          school={school}
          onClose={() => setShowManageSchool(false)}
        />
      )}
    </div>
  );
}
