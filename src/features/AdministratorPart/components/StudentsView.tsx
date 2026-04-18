"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import PageHeader from "@/components/sheard/PageHeader";
import {
  useMyStudents,
  useToggleStudentState,
  useUpdateStudent,
} from "../hooks/useStudents";
import type { StudentRow } from "../types/students.types";
import { DataTable } from "./shared/DataTable";
import { ToggleSwitch } from "./shared/ToggleSwitch";
import EditUserModal from "./shared/EditUserModal";
import CreateStudentModal from "./CreateStudentModal";

export function StudentsView() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editing, setEditing] = useState<StudentRow | null>(null);

  const { data, isLoading, isError, error, refetch } = useMyStudents();
  const toggleState = useToggleStudentState();
  const updateStudent = useUpdateStudent();

  const columns = useMemo<ColumnDef<StudentRow, unknown>[]>(
    () => [
      {
        id: "no",
        header: "No",
        size: 60,
        cell: ({ row }) => (
          <span className="text-[16px] font-light text-[#666]">
            {row.index + 1}
          </span>
        ),
      },
      {
        id: "name",
        header: "Student Name",
        accessorFn: (row) => row.name,
        cell: ({ row }) => {
          const s = row.original;
          return (
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-full bg-gray-300 overflow-hidden">
                {s.image ? (
                  <Image
                    src={s.image}
                    alt={s.name}
                    width={24}
                    height={24}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full bg-gradient-to-br from-purple-300 to-purple-500" />
                )}
              </div>
              <span className="text-[16px] font-light text-[#666]">
                {s.name}
              </span>
            </div>
          );
        },
      },
      {
        id: "studentId",
        header: "Student I'd",
        accessorFn: (row) => row.studentId,
        cell: ({ getValue }) => (
          <span className="text-[16px] font-light text-[#666]">
            {String(getValue() ?? "—")}
          </span>
        ),
      },
      {
        id: "grade",
        header: "Grade",
        accessorFn: (row) => row.grade,
        cell: ({ getValue }) => (
          <span className="text-[16px] font-light text-[#666]">
            {String(getValue() ?? "—")}
          </span>
        ),
      },
      {
        id: "phone",
        header: "Phone",
        accessorFn: (row) => row.phoneNumber,
        cell: ({ getValue }) => (
          <span className="text-[16px] font-light text-[#666]">
            {String(getValue() ?? "—")}
          </span>
        ),
      },
      {
        id: "status",
        header: "Status",
        accessorFn: (row) => (row.active ? "active" : "inactive"),
        cell: ({ row }) => {
          const active = row.original.active;
          return (
            <span
              className={`inline-flex items-center gap-1.5 text-[14px] font-medium ${
                active ? "text-[#5fb892]" : "text-[#ef3c50]"
              }`}
            >
              <span
                className={`h-2 w-2 rounded-full ${
                  active ? "bg-[#5fb892]" : "bg-[#ef3c50]"
                }`}
              />
              {active ? "Active" : "Inactive"}
            </span>
          );
        },
      },
      {
        id: "action",
        header: () => <span className="block text-center">Action</span>,
        size: 220,
        cell: ({ row }) => {
          const s = row.original;
          return (
            <div className="flex items-center justify-center gap-3">
              <ToggleSwitch
                active={s.active}
                disabled={toggleState.isPending}
                onChange={() =>
                  toggleState.mutate({
                    id: s._id,
                    state: s.active ? "inactive" : "active",
                  })
                }
              />
              <button
                type="button"
                onClick={() => setEditing(s)}
                className="rounded-[4px] border border-[#871dad] px-[10px] py-[6px] text-[14px] font-medium text-[#871dad] hover:bg-[#faf2f9] transition-colors cursor-pointer"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => router.push(`/administrator/students/${s._id}`)}
                className="rounded-[4px] bg-[#871dad] px-[10px] py-[6px] text-[14px] font-medium text-white hover:bg-[#751a99] transition-colors cursor-pointer"
              >
                View
              </button>
            </div>
          );
        },
      },
    ],
    [toggleState, router],
  );

  return (
    <div className="space-y-6">
      <PageHeader title="Students" showBack={false} />

      <div className="rounded-[20px] bg-white p-4 sm:p-6 lg:p-8 shadow-[0px_0px_20px_0px_rgba(0,0,0,0.1)] mt-10">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <h2 className="text-[20px] sm:text-[24px] font-semibold text-[#333]">
            All Students{" "}
            {!isLoading && data && (
              <span className="text-[14px] font-normal text-[#666]">
                ({data.length})
              </span>
            )}
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
                placeholder="Search students..."
                className="h-[48px] w-full sm:w-[350px] rounded-[8px] border border-[#08374d] bg-[#f9f9f9] pl-10 pr-4 text-[16px] text-[#666] outline-none placeholder:text-[#666]"
              />
            </div>
            <button
              type="button"
              onClick={() => setShowCreateModal(true)}
              className="rounded-[10px] bg-[#871dad] cursor-pointer px-5 py-[14px] sm:py-[18px] text-[14px] sm:text-[16px] font-bold text-white hover:bg-[#751a99] transition-colors whitespace-nowrap"
            >
              Add New Student
            </button>
          </div>
        </div>

        <DataTable<StudentRow>
          data={data}
          columns={columns}
          isLoading={isLoading}
          isError={isError}
          error={error}
          onRetry={() => refetch()}
          globalFilter={query}
          minWidth={780}
          emptyMessage="No students match your search."
          errorMessage="We couldn't load the students list."
        />
      </div>

      {showCreateModal && (
        <CreateStudentModal onClose={() => setShowCreateModal(false)} />
      )}

      {editing && (
        <EditUserModal
          title="Edit Student"
          user={{
            _id: editing._id,
            name: editing.name,
            Id: editing.studentId,
            phoneNumber: editing.phoneNumber === "—" ? "" : editing.phoneNumber,
            email: editing.email === "—" ? "" : editing.email,
            gradeLevel:
              editing.grade && editing.grade !== "—"
                ? Number(editing.grade) || undefined
                : undefined,
            state: editing.active ? "active" : "inactive",
          }}
          isPending={updateStudent.isPending}
          onSubmit={(payload) =>
            updateStudent.mutateAsync({ id: editing._id, payload })
          }
          onClose={() => setEditing(null)}
        />
      )}
    </div>
  );
}
