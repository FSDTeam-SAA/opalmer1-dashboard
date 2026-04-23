"use client";

import { useState } from "react";
import {
  useParents,
  useToggleParentState,
  useUpdateParent,
} from "../hooks/useParents";
import {
  UserListView,
  type UserRow,
  type UserListConfig,
} from "./shared/UserListView";
import CreateParentModal from "./CreateParentModal";
import ParentDetailsModal from "./ParentDetailsModal";

const CONFIG: UserListConfig = {
  type: "parent",
  title: "Parents",
  tableHeading: "All Parents",
  idColumnHeader: "Parent I'd",
  badgeColumnHeader: "—",
  searchPlaceholder: "Search by name or ID…",
  addButtonLabel: "Add New Parent",
  viewRoutePrefx: "/administrator/parents",
  emptyMessage: "No parents match your search.",
  errorMessage: "We couldn't load the parents list.",
};

export function ParentsView() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedParent, setSelectedParent] = useState<UserRow | null>(null);

  const { data: raw, isLoading, isError, error, refetch } = useParents();
  const toggleState = useToggleParentState();
  const updateParent = useUpdateParent();

  const data: UserRow[] | undefined = raw?.map((p) => ({
    _id: p._id,
    name: p.name,
    userId: p.parentId,
    badge: "—",
    email: p.email,
    phoneNumber: p.phoneNumber,
    active: p.active,
    image: p.image,
  }));

  return (
    <>
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
        isUpdatePending={updateParent.isPending}
        onUpdate={(id, payload) => updateParent.mutateAsync({ id, payload })}
        onAdd={() => setShowCreateModal(true)}
        onViewClick={(row) => setSelectedParent(row)}
      />
      {showCreateModal && (
        <CreateParentModal onClose={() => setShowCreateModal(false)} />
      )}
      {selectedParent && (
        <ParentDetailsModal
          parent={selectedParent}
          onClose={() => setSelectedParent(null)}
        />
      )}
    </>
  );
}
