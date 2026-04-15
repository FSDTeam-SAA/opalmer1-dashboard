"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Trash2, MapPin, Copy } from "lucide-react";
import ToggleSwitch from "./ToggleSwitch";
import EditAdminModal from "./EditAdminModal";
import StudentCard, { Student } from "./StudentCard";
import TeacherCard, { Teacher } from "./TeacherCard";
import { Admin } from "./Administration";

/* ───── Mock Data ───── */
const adminsData: (Admin & {
  location: string;
  adminId: string;
  adminPassword: string;
})[] = [
  {
    id: 1,
    name: "Olivia Carter",
    email: "oliviacarter@gmail.com",
    username: "eriny1234",
    image: "/images/12043465729ab7c8ceffce00749e7c71df0c9e25.jpg",
    active: true,
    location: "6103, Dr drive, Laurel MD",
    adminId: "mia_johnson",
    adminPassword: "mia123456",
  },
  {
    id: 2,
    name: "Erin Yaeger",
    email: "erinyaeger@gmail.com",
    username: "eriny1234",
    image: "/images/4f8da1b70693c4fcf9e01b9293706aed5cd4e34d.jpg",
    active: true,
    location: "6103, Dr drive, Laurel MD",
    adminId: "erin_yaeger",
    adminPassword: "erin123456",
  },
];

const studentsData: Student[] = [
  {
    id: 1,
    name: "Mia Johnson",
    grade: "Grade 6",
    age: 12,
    attendance: "92%",
    progress: "75%",
    status: "Excellent",
    image: "/images/12043465729ab7c8ceffce00749e7c71df0c9e25.jpg",
  },
  {
    id: 2,
    name: "Mia Johnson",
    grade: "Grade 6",
    age: 12,
    attendance: "92%",
    progress: "75%",
    status: "Excellent",
    image: "/images/12043465729ab7c8ceffce00749e7c71df0c9e25.jpg",
  },
  {
    id: 3,
    name: "Mia Johnson",
    grade: "Grade 6",
    age: 12,
    attendance: "92%",
    progress: "75%",
    status: "Excellent",
    image: "/images/12043465729ab7c8ceffce00749e7c71df0c9e25.jpg",
  },
];

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
  const adminName = slug.replace(/-/g, " ");
  const admin =
    adminsData.find((a) => a.name.toLowerCase() === adminName.toLowerCase()) ??
    adminsData[0];

  const [active, setActive] = useState(admin.active);
  const [editingAdmin, setEditingAdmin] = useState<Admin | null>(null);

  return (
    <div className="space-y-8 pt-10 mt-16">
      {/* Admin Profile Card */}
      <div className="flex gap-5 rounded-[20px] bg-white p-5 shadow-[0px_0px_20px_0px_rgba(0,0,0,0.1)]">
        {/* Profile Image */}
        <div className="h-[200px] w-[200px] flex-shrink-0 overflow-hidden rounded-[6px]">
          <Image
            src={admin.image}
            alt={admin.name}
            width={200}
            height={200}
            className="h-full w-full object-cover"
          />
        </div>

        {/* Info & Actions */}
        <div className="flex flex-1 flex-col justify-between py-3">
          <div>
            <h3 className="text-[32px] font-semibold text-black tracking-[0.3px]">
              {admin.name}
            </h3>
            <p className="mt-3 text-[20px] text-[#666]">{admin.email}</p>
            <p className="mt-2 text-[20px] text-[#666]">{admin.username}</p>
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
              {admin.location}
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
                {admin.adminId}
              </p>
              <p className="mt-1 text-[20px] text-[#666]">
                {admin.adminPassword}
              </p>
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
          {studentsData.map((student) => (
            <StudentCard key={student.id} student={student} />
          ))}
        </div>
      </div>

      {/* Teachers Section */}
      <div>
        <div className="flex items-center justify-between">
          <h2 className="text-[30px] font-semibold text-[#333]">Teachers</h2>
          <button className="cursor-pointer text-[20px] text-[#871dad] underline hover:text-[#751a99] transition-colors">
            View All
          </button>
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
