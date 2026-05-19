"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Pencil, Plus, Search, Trash2 } from "lucide-react";
import PageHeader from "@/components/sheard/PageHeader";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useDeleteSchool, useSchools } from "../hooks/useSchools";
import type { School } from "../types/school.types";
import CreateSchoolModal from "./CreateSchoolModal";

export default function SchoolTable() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [editingSchool, setEditingSchool] = useState<School | null>(null);
  const [deletingSchool, setDeletingSchool] = useState<School | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const { data: schools = [], isLoading, isError } = useSchools();
  const deleteSchool = useDeleteSchool();

  // Use a fallback image for consistency
  const FALLBACK_IMAGE = "/images/4f8da1b70693c4fcf9e01b9293706aed5cd4e34d.jpg";

  const filteredSchools = useMemo(() => {
    const q = searchQuery.toLowerCase();
    if (!q) return schools;
    return schools.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        (s.code && s.code.toLowerCase().includes(q)) ||
        s.administrator?.username.toLowerCase().includes(q),
    );
  }, [searchQuery, schools]);

  const handleDeleteSchool = async () => {
    if (!deletingSchool) return;
    setDeleteError(null);

    try {
      await deleteSchool.mutateAsync(deletingSchool._id);
      setDeletingSchool(null);
    } catch (err) {
      setDeleteError(
        err instanceof Error ? err.message : "Failed to delete school",
      );
    }
  };

  return (
    <div className="mt-32 pt-10">
      <PageHeader title="Schools" showBack={false} />
      <div className="rounded-[20px] bg-white p-8 shadow-[0px_0px_20px_0px_rgba(0,0,0,0.1)]">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-[24px] font-semibold text-[#333]">
            Schools ({filteredSchools.length})
          </h2>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search
                size={20}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#666]"
              />
              <input
                type="text"
                placeholder="Search schools..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-[48px] w-[350px] rounded-[8px] border border-[#08374d] bg-[#f9f9f9] pl-10 pr-4 text-[16px] text-[#333] outline-none placeholder:text-[#666]"
              />
            </div>
            <button
              type="button"
              onClick={() => setShowCreate(true)}
              className="flex h-[48px] items-center gap-2 rounded-[8px] bg-[#871dad] px-5 text-[15px] font-semibold text-white hover:bg-[#751a99]"
            >
              <Plus size={18} />
              Add School
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-0">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-4 border-b border-gray-100 py-4"
              >
                <Skeleton className="h-5 w-[40px]" />
                <Skeleton className="h-6 w-6 rounded-full" />
                <Skeleton className="h-5 w-[160px]" />
                <Skeleton className="h-5 w-[120px]" />
                <Skeleton className="h-5 w-[150px]" />
                <Skeleton className="h-5 w-[150px]" />
                <Skeleton className="h-8 w-[72px]" />
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <p className="text-[18px] font-medium text-[#e64540]">
              Failed to load schools
            </p>
            <p className="mt-2 text-[14px] text-[#666]">
              Please try again later.
            </p>
          </div>
        ) : filteredSchools.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <p className="text-[18px] font-medium text-[#666]">
              No schools found
            </p>
            {searchQuery && (
              <p className="mt-2 text-[14px] text-[#999]">
                Try adjusting your search query.
              </p>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-[#871dad]">
                  <th className="w-[60px] pb-3 text-left text-[14px] font-light text-[#666]">
                    No
                  </th>
                  <th className="pb-3 text-left text-[14px] font-light text-[#666]">
                    School Name
                  </th>
                  <th className="pb-3 text-left text-[14px] font-light text-[#666]">
                    Code
                  </th>
                  <th className="pb-3 text-left text-[14px] font-light text-[#666]">
                    Administrator
                  </th>
                  <th className="pb-3 text-left text-[14px] font-light text-[#666]">
                    Email
                  </th>
                  <th className="pb-3 text-left text-[14px] font-light text-[#666]">
                    Created At
                  </th>
                  <th className="pb-3 text-right text-[14px] font-light text-[#666]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredSchools.map((school, idx) => (
                  <tr key={school._id} className="border-b border-gray-100">
                    <td className="py-4 text-[16px] font-light text-[#666]">
                      {idx + 1}
                    </td>
                    <td className="py-4">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 flex-shrink-0 overflow-hidden rounded-full">
                          <Image
                            src={school.logo || FALLBACK_IMAGE}
                            alt={school.name}
                            width={32}
                            height={32}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <span className="text-[16px] font-light text-[#666]">
                          {school.name}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 text-[16px] font-light text-[#666]">
                      {school.code || "—"}
                    </td>
                    <td className="py-4 text-[16px] font-light text-[#666]">
                      {school.administrator?.username || "—"}
                    </td>
                    <td className="py-4 text-[16px] font-light text-[#666]">
                      {school.email || "—"}
                    </td>
                    <td className="py-4 text-[16px] font-light text-[#666]">
                      {new Date(school.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setEditingSchool(school)}
                          className="inline-flex h-9 items-center gap-2 rounded-[8px] border border-[#871dad] px-3 text-[14px] font-medium text-[#871dad] hover:bg-[#871dad] hover:text-white"
                        >
                          <Pencil size={15} />
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setDeleteError(null);
                            setDeletingSchool(school);
                          }}
                          className="inline-flex h-9 items-center gap-2 rounded-[8px] border border-[#e64540] px-3 text-[14px] font-medium text-[#e64540] hover:bg-[#e64540] hover:text-white"
                        >
                          <Trash2 size={15} />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {showCreate && <CreateSchoolModal onClose={() => setShowCreate(false)} />}
      {editingSchool && (
        <CreateSchoolModal
          school={editingSchool}
          onClose={() => setEditingSchool(null)}
        />
      )}
      <Dialog
        open={Boolean(deletingSchool)}
        onOpenChange={(open) => {
          if (!open && !deleteSchool.isPending) {
            setDeletingSchool(null);
            setDeleteError(null);
          }
        }}
      >
        <DialogContent showCloseButton={false} className="sm:max-w-[420px]">
          <DialogHeader>
            <DialogTitle>Delete School</DialogTitle>
            <DialogDescription>
              Delete {deletingSchool?.name}? The school will be removed, but its
              assigned administrator account will stay active and become
              available for another school.
            </DialogDescription>
          </DialogHeader>

          {deleteError && (
            <p className="rounded-[8px] bg-red-50 px-3 py-2 text-[14px] text-[#e64540]">
              {deleteError}
            </p>
          )}

          <DialogFooter className="gap-3">
            <button
              type="button"
              disabled={deleteSchool.isPending}
              onClick={() => {
                setDeletingSchool(null);
                setDeleteError(null);
              }}
              className="rounded-[8px] border border-gray-300 px-5 py-2 text-[#333] hover:bg-gray-50 disabled:opacity-60"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={deleteSchool.isPending}
              onClick={handleDeleteSchool}
              className="rounded-[8px] bg-[#e64540] px-5 py-2 font-semibold text-white hover:bg-[#d63a35] disabled:opacity-60"
            >
              {deleteSchool.isPending ? "Deleting..." : "Delete"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
