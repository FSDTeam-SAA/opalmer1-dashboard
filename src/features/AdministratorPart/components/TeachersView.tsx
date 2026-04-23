"use client";

import { useState } from "react";
import {
  useMyTeachers,
  useToggleTeacherState,
  useUpdateTeacher,
} from "../hooks/useTeachers";
import {
  UserListView,
  type UserRow,
  type UserListConfig,
} from "./shared/UserListView";
import CreateTeacherModal from "./CreateTeacherModal";

const CONFIG: UserListConfig = {
  type: "teacher",
  title: "Teachers",
  tableHeading: "All Teachers",
  idColumnHeader: "Teacher I'd",
  badgeColumnHeader: "Subject / Grade",
  searchPlaceholder: "Search by name or ID…",
  addButtonLabel: "Add New Teacher",
  viewRoutePrefx: "/administrator/teachers",
  emptyMessage: "No teachers match your search.",
  errorMessage: "We couldn't load the teachers list.",
};

export function TeachersView() {
  const [showCreateModal, setShowCreateModal] = useState(false);

  const { data: raw, isLoading, isError, error, refetch } = useMyTeachers();
  const toggleState = useToggleTeacherState();
  const updateTeacher = useUpdateTeacher();

  /** Normalise API rows → UserRow */
  const data: UserRow[] | undefined = raw?.map((t) => ({
    _id: t._id,
    name: t.name,
    userId: t.teacherId,
    badge: t.subject,
    email: t.email,
    phoneNumber: t.phoneNumber,
    active: t.active,
    image: t.image,
  }));

  return (
    <UserListView
      config={CONFIG}
      data={data}
      isLoading={isLoading}
      isError={isError}
      error={error}
      onRefetch={refetch}
      isTogglePending={toggleState.isPending}
      onToggle={(id, currentActive) =>
        toggleState.mutate({
          id,
          state: currentActive ? "inactive" : "active",
        })
      }
      isUpdatePending={updateTeacher.isPending}
      onUpdate={(id, payload) => updateTeacher.mutateAsync({ id, payload })}
      onAdd={() => setShowCreateModal(true)}
    >
      {showCreateModal && (
        <CreateTeacherModal onClose={() => setShowCreateModal(false)} />
      )}
    </UserListView>
  );
}
