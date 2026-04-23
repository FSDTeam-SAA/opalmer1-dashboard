"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Trash2, MapPin, Copy } from "lucide-react";
import PageHeader from "@/components/sheard/PageHeader";
import ToggleSwitch from "./ToggleSwitch";
import EditAdminModal from "./EditAdminModal";
import StudentCard, { Student } from "./StudentCard";
import TeacherCard, { Teacher } from "./TeacherCard";
import { Skeleton } from "@/components/ui/skeleton";
import { useAdministratorDetails } from "../hooks/useAdministrators";
import type { Administrator } from "../types/administrator.types";

/* ───── Mock Data for Teachers (Fallback) ───── */
const teachersData: Teacher[] = [
  {
    id: 1,
    name: "Erin Yaeger",
    grade: "Grade 6",
    state: "MD",
    subjects: "Math, English",
    status: "Excellent",
    image: "/images/4f8da1b70693c4fcf9e01b9293706aed5cd4e34d.jpg",
  },
  {
    id: 2,
    name: "Erin Yaeger",
    grade: "Grade 6",
    state: "MD",
    subjects: "Math, English",
    status: "Excellent",
    image: "/images/4f8da1b70693c4fcf9e01b9293706aed5cd4e34d.jpg",
  },
  {
    id: 3,
    name: "Erin Yaeger",
    grade: "Grade 6",
    state: "MD",
    subjects: "Math, English",
    status: "Excellent",
    image: "/images/4f8da1b70693c4fcf9e01b9293706aed5cd4e34d.jpg",
  },
];

export default function AdminProfile({ slug }: { slug: string }) {
  const { data, isLoading, isError } = useAdministratorDetails(slug);
  const [active, setActive] = useState(true);
  const [editingAdmin, setEditingAdmin] = useState<Administrator | null>(null);

  if (isLoading) {
    return (
      <div className="space-y-8 pt-10 mt-16">
        <PageHeader title="Administrator" />
        <Skeleton className="h-[200px] w-full rounded-[20px]" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="space-y-8 pt-10 mt-16">
        <PageHeader title="Administrator" />
        <div className="rounded-[20px] bg-white p-10 text-center shadow-[0px_0px_20px_0px_rgba(0,0,0,0.08)]">
          <p className="text-[18px] font-medium text-[#e64540]">
            Failed to load administrator profile
          </p>
        </div>
      </div>
    );
  }

  const { admin, school, students } = data;
  const fallbackImage =
    "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=400&auto=format&fit=crop";
  const avatarUrl = admin.avatar?.url || fallbackImage;
  const locationStr = school
    ? `${school.address}, ${school.city}, ${school.state}`
    : "Location N/A";

  // Map API students to StudentCard format
  const mappedStudents: Student[] = students.map((s, idx) => ({
    id: s._id as unknown as number,
    name: s.username || "Unknown Student",
    grade: `Grade ${s.gradeLevel}`,
    age: 0, // Fallback
    attendance: "N/A", // Fallback
    progress: "N/A", // Fallback
    status: "N/A", // Fallback
    image: s.avatar?.url || fallbackImage,
  }));

  return (
    <div className="space-y-8 pt-10 mt-16">
      <PageHeader title="Administrator" />

      {/* Admin Profile Card */}
      <div className="flex gap-5 rounded-[20px] bg-white p-5 shadow-[0px_0px_20px_0px_rgba(0,0,0,0.1)]">
        {/* Profile Image */}
        <div className="h-[200px] w-[200px] flex-shrink-0 overflow-hidden rounded-[6px]">
          <Image
            src={avatarUrl}
            alt={admin.username || "Administrator"}
            width={200}
            height={200}
            className="h-full w-full object-cover"
          />
        </div>

        {/* Info & Actions */}
        <div className="flex flex-1 flex-col justify-between py-3">
          <div>
            <h3 className="text-[32px] font-semibold text-black tracking-[0.3px]">
              {admin.username || "Administrator"}
            </h3>
            <p className="mt-3 text-[20px] text-[#666]">
              {admin.phoneNumber || "No Phone Number"}
            </p>
            <p className="mt-2 text-[20px] text-[#666] capitalize">
              {admin.state || "active"}
            </p>
          </div>

          {/* Actions Row */}
          <div className="flex items-center gap-8">
            <ToggleSwitch active={active} onChange={() => setActive(!active)} />

            <button className="flex h-[34px] w-[34px] cursor-pointer items-center justify-center rounded-full bg-[#fde8e8] text-[#e64540] hover:bg-[#fbd0d0] transition-colors">
              <Trash2 size={18} />
            </button>

            <button
              onClick={() => setEditingAdmin(admin)}
              className="rounded-[6px] bg-[#871dad] cursor-pointer px-[15px] py-[10px] text-[20px] text-white hover:bg-[#751a99] transition-colors"
            >
              Edit
            </button>
          </div>
        </div>
      </div>

      {/* Location & Administrator Id */}
      <div className="grid grid-cols-2 gap-6">
        {/* Location */}
        <div>
          <h2 className="text-[30px] font-semibold text-[#333]">Location</h2>
          <div className="mt-4 flex items-center gap-5 rounded-[20px] bg-[rgba(63,153,180,0.1)] px-5 py-7">
            <div className="flex h-[80px] w-[80px] flex-shrink-0 items-center justify-center rounded-full bg-[rgba(63,153,180,0.2)]">
              <MapPin size={36} className="text-[#3f99b4]" />
            </div>
            <p className="text-[28px] font-semibold text-[#333]">
              {locationStr}
            </p>
          </div>
        </div>

        {/* Administrator Id */}
        <div>
          <h2 className="text-[30px] font-semibold text-[#333]">
            Administrator Id
          </h2>
          <div className="mt-4 flex items-center justify-between rounded-[20px] bg-[rgba(254,189,67,0.1)] px-5 py-7">
            <div>
              <p className="text-[28px] font-semibold text-[#333] tracking-[0.3px]">
                {admin.Id || "N/A"}
              </p>
              <p className="mt-1 text-[20px] text-[#666]">{"*******"}</p>
            </div>
            <button className="cursor-pointer text-[#871dad] hover:text-[#751a99] transition-colors">
              <Copy size={32} />
            </button>
          </div>
        </div>
      </div>

      {/* Students Section */}
      <div>
        <div className="flex items-center justify-between">
          <h2 className="text-[30px] font-semibold text-[#333]">Students</h2>
          <Link
            href={`/admin/administration/${slug}/students`}
            className="cursor-pointer text-[20px] text-[#871dad] underline hover:text-[#751a99] transition-colors"
          >
            View All
          </Link>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-5">
          {mappedStudents.slice(0, 3).map((student) => (
            <StudentCard key={student.id} student={student} />
          ))}
          {mappedStudents.length === 0 && (
            <p className="text-gray-500 text-lg">No students found.</p>
          )}
        </div>
      </div>

      {/* Teachers Section */}
      <div>
        <div className="flex items-center justify-between">
          <h2 className="text-[30px] font-semibold text-[#333]">Teachers</h2>
          <Link
            href={`/admin/administration/${slug}/teachers`}
            className="cursor-pointer text-[20px] text-[#871dad] underline hover:text-[#751a99] transition-colors"
          >
            View All
          </Link>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-5">
          {teachersData.map((teacher) => (
            <TeacherCard key={teacher.id} teacher={teacher} />
          ))}
        </div>
      </div>

      {/* Edit Administrator Modal */}
      {editingAdmin && (
        <EditAdminModal
          admin={editingAdmin}
          onClose={() => setEditingAdmin(null)}
        />
      )}
    </div>
  );
}
