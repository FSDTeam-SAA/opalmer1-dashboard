"use client";

import { useState } from "react";
import ListPagination, {
  useListPagination,
} from "@/components/shared/ListPagination";
import Link from "next/link";
import Image from "@/components/ui/data-image";
import { Plus, Search, Trash2, Pencil } from "lucide-react";
import CreateAdminModal from "./CreateAdminModal";
import EditAdminModal from "./EditAdminModal";
import PageHeader from "@/components/sheard/PageHeader";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  useAdministrators,
  useDeleteAdministrator,
  useToggleAdministratorState,
} from "../hooks/useAdministrators";
import type { Administrator } from "../types/administrator.types";

export type Admin = Administrator;

export default function Administration() {
  const { data: admins = [], isLoading, isError } = useAdministrators();
  const toggleState = useToggleAdministratorState();
  const deletion = useDeleteAdministrator();
  const [search, setSearch] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<Admin | null>(null);
  const [deletingAdmin, setDeletingAdmin] = useState<Admin | null>(null);
  const [actionError, setActionError] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const schoolName = (admin: Admin) =>
    typeof admin.schoolId === "object" && admin.schoolId
      ? `${admin.schoolId.name}${admin.schoolId.code ? ` (${admin.schoolId.code})` : ""}`
      : "Unassigned";
  const filtered = admins.filter((admin) =>
    [
      admin.username,
      admin.Id,
      admin.email,
      admin.phoneNumber,
      schoolName(admin),
    ].some((value) =>
      value?.toLowerCase().includes(search.trim().toLowerCase()),
    ),
  );
  const describeError = (err: unknown) =>
    (err as { response?: { data?: { message?: string } } })?.response?.data
      ?.message || (err instanceof Error ? err.message : "Request failed");
  const pagination = useListPagination(filtered, search);

  async function confirmDelete() {
    if (!deletingAdmin) return;
    setDeleteError("");
    try {
      await deletion.mutateAsync(deletingAdmin._id);
      setDeletingAdmin(null);
    } catch (err) {
      setDeleteError(describeError(err));
    }
  }

  return (
    <div className="mt-32 pt-10">
      <PageHeader title="Administration" />
      <div className="rounded-[20px] bg-white p-8 shadow-[0px_0px_20px_0px_rgba(0,0,0,0.1)]">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-[24px] font-semibold text-[#333]">
            Administrators ({filtered.length})
          </h2>
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search
                size={20}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#666]"
              />
              <input
                aria-label="Search administrators"
                placeholder="Search administrators..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-12 w-full rounded-lg border border-[#08374d] bg-[#f9f9f9] pl-10 pr-4 outline-none sm:w-[280px]"
              />
            </div>
            <button
              type="button"
              onClick={() => setShowCreateModal(true)}
              className="flex h-12 items-center gap-2 rounded-lg bg-[#871dad] px-5 text-[15px] font-semibold text-white hover:bg-[#751a99]"
            >
              <Plus size={18} />
              Add Administrator
            </button>
          </div>
        </div>
        {actionError && (
          <p role="alert" className="mb-4 text-sm text-red-600">
            {actionError}
          </p>
        )}
        {isLoading ? (
          <p className="py-12 text-center text-[#666]">
            Loading administrators...
          </p>
        ) : isError ? (
          <p role="alert" className="py-12 text-center text-red-600">
            Failed to load administrators
          </p>
        ) : !filtered.length ? (
          <p className="py-12 text-center text-[#666]">
            No administrators found
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b-2 border-[#871dad] text-[#666]">
                  {[
                    "No",
                    "Administrator Name",
                    "Admin ID",
                    "Email",
                    "Phone",
                    "School",
                    "Status",
                    "Actions",
                  ].map((title) => (
                    <th
                      key={title}
                      className={`pb-3 pr-5 font-normal ${title === "Actions" ? "text-right" : ""}`}
                    >
                      {title}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pagination.items.map((admin, i) => (
                  <tr
                    key={admin._id}
                    className="border-b border-gray-100 text-[#666]"
                  >
                    <td className="py-4 pr-5">{pagination.offset + i + 1}</td>
                    <td className="py-4 pr-5">
                      <Link
                        href={`/admin/administration/${admin._id}`}
                        className="flex items-center gap-3 hover:text-[#871dad]"
                      >
                        <Image
                          src={admin.avatar?.url || ""}
                          alt=""
                          width={36}
                          height={36}
                          className="h-9 w-9 rounded-full object-cover"
                        />
                        <span className="whitespace-nowrap font-medium text-[#333]">
                          {admin.username}
                        </span>
                      </Link>
                    </td>
                    <td className="py-4 pr-5">{admin.Id || "—"}</td>
                    <td className="py-4 pr-5">{admin.email || "—"}</td>
                    <td className="py-4 pr-5">{admin.phoneNumber || "—"}</td>
                    <td className="py-4 pr-5">{schoolName(admin)}</td>
                    <td className="py-4 pr-5">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          role="switch"
                          aria-checked={admin.state === "active"}
                          aria-label={`Active status for ${admin.username}`}
                          disabled={toggleState.isPending}
                          onClick={async () => {
                            setActionError("");
                            try {
                              await toggleState.mutateAsync({
                                id: admin._id,
                                state:
                                  admin.state === "active"
                                    ? "inactive"
                                    : "active",
                              });
                            } catch (err) {
                              setActionError(describeError(err));
                            }
                          }}
                          className={`relative h-5 w-10 shrink-0 rounded-full transition-colors disabled:opacity-50 ${admin.state === "active" ? "bg-[#871dad]" : "bg-gray-300"}`}
                        >
                          <span
                            className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-all ${admin.state === "active" ? "left-[22px]" : "left-0.5"}`}
                          />
                        </button>
                        <span className="capitalize">
                          {admin.state || "inactive"}
                        </span>
                      </div>
                    </td>
                    <td className="py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setEditingAdmin(admin)}
                          className="inline-flex h-9 items-center gap-2 rounded-lg border border-[#871dad] px-3 font-medium text-[#871dad] hover:bg-purple-50"
                        >
                          <Pencil size={15} />
                          Edit
                        </button>
                        <button
                          type="button"
                          aria-label={`Delete ${admin.username}`}
                          title="Delete administrator"
                          onClick={() => {
                            setDeleteError("");
                            setDeletingAdmin(admin);
                          }}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-[#e64540] hover:bg-red-50"
                        >
                          <Trash2 size={18} />
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
      {!isLoading && !isError && <ListPagination {...pagination} />}
      {showCreateModal && (
        <CreateAdminModal onClose={() => setShowCreateModal(false)} />
      )}
      {editingAdmin && (
        <EditAdminModal
          admin={editingAdmin}
          onClose={() => setEditingAdmin(null)}
        />
      )}
      <Dialog
        open={Boolean(deletingAdmin)}
        onOpenChange={(open) => {
          if (!open && !deletion.isPending) setDeletingAdmin(null);
        }}
      >
        <DialogContent showCloseButton={false} className="sm:max-w-[420px]">
          <DialogHeader>
            <DialogTitle>Delete Administrator?</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {deletingAdmin?.username}? This
              cannot be undone. The school and its users will remain.
            </DialogDescription>
          </DialogHeader>
          {deleteError && (
            <p
              role="alert"
              className="rounded-lg bg-red-50 p-3 text-sm text-red-600"
            >
              {deleteError}
            </p>
          )}
          <DialogFooter className="gap-3">
            <button
              type="button"
              disabled={deletion.isPending}
              onClick={() => setDeletingAdmin(null)}
              className="rounded-lg border border-gray-300 px-5 py-2 disabled:opacity-50"
            >
              No
            </button>
            <button
              type="button"
              disabled={deletion.isPending}
              onClick={confirmDelete}
              className="rounded-lg bg-[#e64540] px-5 py-2 font-semibold text-white hover:bg-[#d63a35] disabled:opacity-50"
            >
              {deletion.isPending ? "Deleting..." : "Yes"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
