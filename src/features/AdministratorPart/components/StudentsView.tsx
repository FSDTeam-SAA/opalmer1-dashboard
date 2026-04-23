"use client";

import { useState } from "react";
import {
  useMyStudents,
  useToggleStudentState,
  useUpdateStudent,
} from "../hooks/useStudents";
import {
  UserListView,
  type UserRow,
  type UserListConfig,
} from "./shared/UserListView";
import CreateStudentModal from "./CreateStudentModal";

const CONFIG: UserListConfig = {
  type: "student",
  title: "Students",
  tableHeading: "All Students",
  idColumnHeader: "Student I'd",
  badgeColumnHeader: "Grade",
  searchPlaceholder: "Search by name or ID…",
  addButtonLabel: "Add New Student",
  viewRoutePrefx: "/administrator/students",
  emptyMessage: "No students match your search.",
  errorMessage: "We couldn't load the students list.",
};

export function StudentsView() {
  const [showCreateModal, setShowCreateModal] = useState(false);

  const { data: raw, isLoading, isError, error, refetch } = useMyStudents();
  const toggleState = useToggleStudentState();
  const updateStudent = useUpdateStudent();

  /** Normalise API rows → UserRow */
  const data: UserRow[] | undefined = raw?.map((s) => ({
    _id: s._id,
    name: s.name,
    userId: s.studentId,
    badge: s.grade,
    email: s.email,
    phoneNumber: s.phoneNumber,
    active: s.active,
    image: s.image,
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
      isUpdatePending={updateStudent.isPending}
      onUpdate={(id, payload) => updateStudent.mutateAsync({ id, payload })}
      onAdd={() => setShowCreateModal(true)}
    >
      {showCreateModal && (
        <CreateStudentModal onClose={() => setShowCreateModal(false)} />
      )}
    </UserListView>
  );
}
