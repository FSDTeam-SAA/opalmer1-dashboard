"use client";

import { useState } from "react";
import AdminCard from "./AdminCard";
import CreateAdminModal from "./CreateAdminModal";
import EditAdminModal from "./EditAdminModal";
import PageHeader from "@/components/sheard/PageHeader";
import {
  useAdministrators,
  useToggleAdministratorState,
} from "../hooks/useAdministrators";
import type { Administrator } from "../types/administrator.types";

export type Admin = Administrator;

export default function Administration() {
  const { data: admins, isLoading, isError, error } = useAdministrators();
  const toggleState = useToggleAdministratorState();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<Admin | null>(null);

  return (
    <div className="space-y-8 pt-10 mt-32">
      <PageHeader title="Administration" showBack={false} />

      {isLoading && (
        <div className="text-center text-[18px] text-[#666] py-12">
          Loading administrators...
        </div>
      )}

      {isError && (
        <div className="text-center text-[16px] text-[#e64540] bg-red-50 border border-red-200 rounded-[8px] p-4">
          Failed to load administrators
          {error instanceof Error ? `: ${error.message}` : ""}
        </div>
      )}

      {!isLoading && !isError && (
        <div className="grid grid-cols-2 gap-6">
          {admins?.map((admin) => (
            <AdminCard
              key={admin._id}
              admin={admin}
              onToggle={() =>
                toggleState.mutate({
                  id: admin._id,
                  state: admin.state === "active" ? "inactive" : "active",
                })
              }
              onDelete={() => {
                // Backend currently has no dedicated delete endpoint for users.
                // Soft-delete by marking inactive until DELETE /users/:id exists.
                toggleState.mutate({ id: admin._id, state: "inactive" });
              }}
              onEdit={() => setEditingAdmin(admin)}
            />
          ))}
        </div>
      )}

      <div className="flex justify-center pt-4 mt-4">
        <button
          onClick={() => setShowCreateModal(true)}
          className="rounded-[10px] bg-[#871dad] cursor-pointer px-16 py-4 text-[20px] font-bold uppercase text-white hover:bg-[#751a99] transition-colors"
        >
          Create New Administrator
        </button>
      </div>

      {showCreateModal && (
        <CreateAdminModal onClose={() => setShowCreateModal(false)} />
      )}

      {editingAdmin && (
        <EditAdminModal
          admin={editingAdmin}
          onClose={() => setEditingAdmin(null)}
        />
      )}
    </div>
  );
}
