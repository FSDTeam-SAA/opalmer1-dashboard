"use client";

import Image from "next/image";
import { Mail, Phone, BookOpen, GraduationCap } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { ToggleSwitch } from "./ToggleSwitch";

/* ────────────────────────────────────────────────────────────
   Shared types
──────────────────────────────────────────────────────────── */
export type ProfileUser = {
  _id: string;
  name: string;
  userId: string; // studentId or teacherId
  email: string;
  phoneNumber: string;
  badge?: string; // grade (student) or subject (teacher)
  image: string;
  active: boolean;
};

export type UserProfileCardProps = {
  user: ProfileUser;
  /** "student" | "teacher" */
  type: "student" | "teacher";
  isTogglePending: boolean;
  onToggle: () => void;
  onEdit: () => void;
};

const FALLBACK_IMAGE = "/images/4f8da1b70693c4fcf9e01b9293706aed5cd4e34d.jpg";

/* ────────────────────────────────────────────────────────────
   Skeleton
──────────────────────────────────────────────────────────── */
export function ProfileCardSkeleton() {
  return (
    <div className="flex flex-col items-center">
      <Skeleton className="h-[180px] w-[180px] rounded-[16px] z-10" />
      <div className="-mt-10 w-full max-w-[560px] rounded-[24px] bg-white pt-16 pb-8 px-8 shadow-[0px_4px_30px_rgba(0,0,0,0.1)]">
        <div className="flex flex-col items-center gap-3">
          <Skeleton className="h-7 w-[200px]" />
          <Skeleton className="h-5 w-[160px]" />
          <Skeleton className="h-5 w-[220px]" />
          <Skeleton className="h-5 w-[140px]" />
          <div className="mt-2 flex items-center gap-4">
            <Skeleton className="h-[22px] w-[44px] rounded-full" />
            <Skeleton className="h-[36px] w-[80px] rounded-[8px]" />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────
   Profile card
──────────────────────────────────────────────────────────── */
export function UserProfileCard({
  user,
  type,
  isTogglePending,
  onToggle,
  onEdit,
}: UserProfileCardProps) {
  const idLabel = type === "student" ? "Student ID" : "Teacher ID";
  const badgeLabel = type === "student" ? "Grade" : "Subject";

  return (
    <div className="flex flex-col items-center">
      {/* Floating photo */}
      <div className="relative z-10 h-[180px] w-[180px] overflow-hidden rounded-[16px] shadow-[0_8px_30px_rgba(135,29,173,0.2)]">
        <Image
          src={user.image || FALLBACK_IMAGE}
          alt={user.name}
          width={180}
          height={180}
          className="h-full w-full object-cover"
        />
        {/* Active indicator dot */}
        <span
          className={`absolute bottom-2 right-2 h-4 w-4 rounded-full border-2 border-white shadow ${
            user.active ? "bg-[#2d9e6a]" : "bg-[#e53e3e]"
          }`}
        />
      </div>

      {/* Card body overlapping behind the photo */}
      <div className="-mt-10 w-full max-w-[580px] rounded-[24px] bg-white pt-16 pb-8 px-8 shadow-[0px_4px_30px_rgba(0,0,0,0.08)] border border-[#f0f0f0]">
        <div className="flex flex-col items-center">
          {/* Name */}
          <h3 className="text-[26px] font-bold text-[#1a1a1a] tracking-tight">
            {user.name}
          </h3>

          {/* ID badge */}
          <span className="mt-1.5 inline-flex items-center gap-1.5 rounded-full bg-[#f5f0fc] px-[14px] py-[5px] text-[13px] font-semibold text-[#871dad]">
            {idLabel}: {user.userId}
          </span>

          {/* Contact info */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[13px] text-[#777]">
            {user.email && user.email !== "—" && (
              <span className="inline-flex items-center gap-1.5">
                <Mail size={13} className="text-[#aaa]" />
                {user.email}
              </span>
            )}
            {user.phoneNumber && user.phoneNumber !== "—" && (
              <span className="inline-flex items-center gap-1.5">
                <Phone size={13} className="text-[#aaa]" />
                {user.phoneNumber}
              </span>
            )}
            {user.badge && user.badge !== "—" && (
              <span className="inline-flex items-center gap-1.5">
                {type === "student" ? (
                  <GraduationCap size={13} className="text-[#aaa]" />
                ) : (
                  <BookOpen size={13} className="text-[#aaa]" />
                )}
                {badgeLabel}: {user.badge}
              </span>
            )}
          </div>

          {/* Divider */}
          <div className="my-5 h-px w-full bg-[#f0f0f0]" />

          {/* Controls */}
          <div className="flex items-center gap-4">
            {/* Status badge */}
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-[12px] py-[5px] text-[13px] font-semibold ${
                user.active
                  ? "bg-[#edfaf3] text-[#2d9e6a]"
                  : "bg-[#fef2f2] text-[#e53e3e]"
              }`}
            >
              <span
                className={`h-[6px] w-[6px] rounded-full ${
                  user.active ? "bg-[#2d9e6a]" : "bg-[#e53e3e]"
                }`}
              />
              {user.active ? "Active" : "Inactive"}
            </span>

            <ToggleSwitch
              active={user.active}
              disabled={isTogglePending}
              onChange={onToggle}
            />

            <button
              type="button"
              onClick={onEdit}
              className="rounded-[8px] bg-[#871dad] cursor-pointer px-[18px] py-[9px] text-[14px] font-semibold text-white hover:bg-[#751a99] active:scale-95 transition-all shadow-[0_4px_12px_rgba(135,29,173,0.3)]"
            >
              Edit Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
