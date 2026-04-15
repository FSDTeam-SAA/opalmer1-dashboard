"use client";

import { useState } from "react";
import AdminCard from "./AdminCard";
import CreateAdminModal from "./CreateAdminModal";
import EditAdminModal from "./EditAdminModal";

/* ───── Admin Type ───── */
export type Admin = {
  id: number;
  name: string;
  email: string;
  username: string;
  image: string;
  active: boolean;
};

/* ───── Admin Data ───── */
const initialAdmins: Admin[] = [
  {
    id: 1,
    name: "Olivia Carter",
    email: "oliviacarter@gmail.com",
    username: "Olivia123",
    image: "/images/12043465729ab7c8ceffce00749e7c71df0c9e25.jpg",
    active: true,
  },
  {
    id: 2,
    name: "Erin Yaeger",
    email: "erinyaeger@gmail.com",
    username: "eriny1234",
    image: "/images/4f8da1b70693c4fcf9e01b9293706aed5cd4e34d.jpg",
    active: true,
  },
  {
    id: 3,
    name: "Olivia Carter",
    email: "oliviacarter@gmail.com",
    username: "Olivia123",
    image: "/images/12043465729ab7c8ceffce00749e7c71df0c9e25.jpg",
    active: true,
  },
  {
    id: 4,
    name: "Erin Yaeger",
    email: "erinyaeger@gmail.com",
    username: "eriny1234",
    image: "/images/4f8da1b70693c4fcf9e01b9293706aed5cd4e34d.jpg",
    active: true,
  },
];

/* ───── Main Administration ───── */
export default function Administration() {
  const [admins, setAdmins] = useState(initialAdmins);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<Admin | null>(null);

  const toggleAdmin = (id: number) => {
    setAdmins((prev) =>
      prev.map((a) => (a.id === id ? { ...a, active: !a.active } : a)),
    );
  };

  const deleteAdmin = (id: number) => {
    setAdmins((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <div className="space-y-8 pt-10 mt-32">
      {/* Admin Cards Grid */}
      <div className="grid grid-cols-2 gap-6">
        {admins.map((admin) => (
          <AdminCard
            key={admin.id}
            admin={admin}
            onToggle={() => toggleAdmin(admin.id)}
            onDelete={() => deleteAdmin(admin.id)}
            onEdit={() => setEditingAdmin(admin)}
          />
        ))}
      </div>

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
