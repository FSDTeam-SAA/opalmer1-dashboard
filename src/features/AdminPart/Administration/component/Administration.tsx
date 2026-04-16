"use client";

import { useState } from "react";
import AdminCard from "./AdminCard";
import CreateAdminModal from "./CreateAdminModal";
import EditAdminModal from "./EditAdminModal";
import PageHeader from "@/components/sheard/PageHeader";
import { useAdministrators } from "../hooks/useAdministrators";
import type { Administrator } from "../types/administrator.types";

export type Admin = Administrator;

/* ───── Main Administration ───── */
export default function Administration() {
  const { data: admins, isLoading, isError, error } = useAdministrators();
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

      {/* Admin Cards Grid */}
      {!isLoading && !isError && (
        <div className="grid grid-cols-2 gap-6">
          {admins?.map((admin) => (
            <AdminCard
              key={admin._id}
              admin={admin}
              onToggle={() => {
                /* TODO: backend — PATCH /users/administrators/:id state */
              }}
              onDelete={() => {
                /* TODO: backend — DELETE /users/administrators/:id */
              }}
              onEdit={() => setEditingAdmin(admin)}
            />
          ))}
        </div>
      )}

      {/* Create New Administrator Button */}
      <div className="flex justify-center pt-4 mt-4">
        <button
          onClick={() => setShowCreateModal(true)}
          className="rounded-[10px] bg-[#871dad] cursor-pointer px-16 py-4 text-[20px] font-bold uppercase text-white hover:bg-[#751a99] transition-colors"
        >
          Create New Administrator
        </button>
      </div>

      {/* Create Administrator Modal */}
      {showCreateModal && (
        <CreateAdminModal onClose={() => setShowCreateModal(false)} />
      )}

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
