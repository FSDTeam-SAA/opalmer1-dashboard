"use client";

import Image from "next/image";
import { Copy } from "lucide-react";
import PageHeader from "@/components/sheard/PageHeader";
import SubjectCard, { Subject } from "./SubjectCard";

/* ───── Mock Data ───── */
const studentData = {
  name: "Mia johnson",
  grade: "Grade 6",
  age: 12,
  phone: "+1 301 381 7702",
  attendance: "92%",
  progress: "85%",
  image: "/images/12043465729ab7c8ceffce00749e7c71df0c9e25.jpg",
  parentName: "Sarah Michelle",
  parentImage: "/images/12043465729ab7c8ceffce00749e7c71df0c9e25.jpg",
  studentId: "mia_johnson",
  studentPassword: "mia123456",
};

const subjectsData: Subject[] = [
  {
    id: 1,
    name: "Science",
    teacherName: "Olivia Carter",
    teacherImage: "/images/4f8da1b70693c4fcf9e01b9293706aed5cd4e34d.jpg",
    date: "06-03-25",
    attendance: "92%",
    progress: "85%",
  },
  {
    id: 2,
    name: "English",
    teacherName: "Olivia Carter",
    teacherImage: "/images/4f8da1b70693c4fcf9e01b9293706aed5cd4e34d.jpg",
    date: "06-03-25",
    attendance: "92%",
    progress: "85%",
  },
  {
    id: 3,
    name: "Math",
    teacherName: "Olivia Carter",
    teacherImage: "/images/4f8da1b70693c4fcf9e01b9293706aed5cd4e34d.jpg",
    date: "06-03-25",
    attendance: "92%",
    progress: "85%",
  },
  {
    id: 4,
    name: "Social Study",
    teacherName: "Olivia Carter",
    teacherImage: "/images/4f8da1b70693c4fcf9e01b9293706aed5cd4e34d.jpg",
    date: "06-03-25",
    attendance: "92%",
    progress: "85%",
  },
  {
    id: 5,
    name: "Science",
    teacherName: "Olivia Carter",
    teacherImage: "/images/4f8da1b70693c4fcf9e01b9293706aed5cd4e34d.jpg",
    date: "06-03-25",
    attendance: "92%",
    progress: "85%",
  },
  {
    id: 6,
    name: "English",
    teacherName: "Olivia Carter",
    teacherImage: "/images/4f8da1b70693c4fcf9e01b9293706aed5cd4e34d.jpg",
    date: "06-03-25",
    attendance: "92%",
    progress: "85%",
  },
  {
    id: 7,
    name: "Math",
    teacherName: "Olivia Carter",
    teacherImage: "/images/4f8da1b70693c4fcf9e01b9293706aed5cd4e34d.jpg",
    date: "06-03-25",
    attendance: "92%",
    progress: "85%",
  },
  {
    id: 8,
    name: "Social Study",
    teacherName: "Olivia Carter",
    teacherImage: "/images/4f8da1b70693c4fcf9e01b9293706aed5cd4e34d.jpg",
    date: "06-03-25",
    attendance: "92%",
    progress: "85%",
  },
];

export default function StudentProfile({
  slug,
  studentSlug,
}: {
  slug: string;
  studentSlug: string;
}) {
  return (
    <div className="space-y-8 pt-10 mt-16">
      <PageHeader title="Students" />
      {/* Student Info Card */}
      <div className="flex items-center gap-5 rounded-[20px] bg-white p-5 shadow-[0px_0px_20px_0px_rgba(0,0,0,0.1)]">
        {/* Student Image */}
        <div className="h-[200px] w-[200px] flex-shrink-0 overflow-hidden rounded-[6px]">
          <Image
            src={studentData.image}
            alt={studentData.name}
            width={200}
            height={200}
            className="h-full w-full object-cover"
          />
        </div>

        {/* Info */}
        <div className="flex flex-1 flex-col justify-center">
          <h3 className="text-[32px] font-semibold text-black tracking-[0.3px]">
            {studentData.name}
          </h3>
          <p className="mt-2 text-[20px] text-[#666]">
            {studentData.grade} - Age {studentData.age}
          </p>
          <p className="mt-1 text-[20px] text-[#666]">{studentData.phone}</p>
        </div>

        {/* Attendance & Progress Badges */}
        <div className="flex gap-4">
          <div className="flex h-[110px] w-[240px] flex-col items-center justify-center rounded-[10px] bg-[#4aa678]">
            <p className="text-[20px] text-white">Attendance</p>
            <p className="mt-1 text-[30px] font-medium text-white">
              {studentData.attendance}
            </p>
          </div>
          <div className="flex h-[110px] w-[240px] flex-col items-center justify-center rounded-[10px] bg-[#febd43]">
            <p className="text-[20px] text-white">Progress</p>
            <p className="mt-1 text-[30px] font-medium text-white">
              {studentData.progress}
            </p>
          </div>
        </div>
      </div>

      {/* Parent Profile & Student Id */}
      <div className="grid grid-cols-2 gap-6">
        {/* Parent Profile */}
        <div>
          <h2 className="text-[30px] font-semibold text-[#333]">
            Parent Profile
          </h2>
          <div className="mt-4 flex items-center gap-5 rounded-[20px] bg-[rgba(63,153,180,0.1)] px-5 py-7">
            <div className="h-[80px] w-[80px] flex-shrink-0 overflow-hidden rounded-full">
              <Image
                src={studentData.parentImage}
                alt={studentData.parentName}
                width={80}
                height={80}
                className="h-full w-full object-cover"
              />
            </div>
            <p className="text-[28px] font-semibold text-[#333]">
              {studentData.parentName}
            </p>
          </div>
        </div>

        {/* Student Id */}
        <div>
          <h2 className="text-[30px] font-semibold text-[#333]">Student Id</h2>
          <div className="mt-4 flex items-center justify-between rounded-[20px] bg-[rgba(254,189,67,0.1)] px-5 py-7">
            <div>
              <p className="text-[28px] font-semibold text-[#333] tracking-[0.3px]">
                {studentData.studentId}
              </p>
              <p className="mt-1 text-[20px] text-[#666]">
                {studentData.studentPassword}
              </p>
            </div>
            <button className="cursor-pointer text-[#871dad] hover:text-[#751a99] transition-colors">
              <Copy size={32} />
            </button>
          </div>
        </div>
      </div>

      {/* Subjects Section */}
      <div>
        <h2 className="text-[30px] font-semibold text-[#333]">Subjects</h2>
        <div className="mt-4 grid grid-cols-2 gap-5">
          {subjectsData.map((subject) => (
            <SubjectCard
              key={subject.id}
              subject={subject}
              slug={slug}
              studentSlug={studentSlug}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
