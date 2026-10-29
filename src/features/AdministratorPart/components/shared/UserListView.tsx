"use client";

import { useMemo, useState } from "react";
import ListPagination, {
  useListPagination,
} from "@/components/shared/ListPagination";
import Image from "@/components/ui/data-image";
import { useRouter } from "next/navigation";
import { Search, Users, UserCheck, UserX, Trash2, Upload } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { deleteSchoolUser } from "../../api/bulk-users.api";
import { runSchoolBatch } from "@/features/AdminPart/School/lib/school-bulk";
import BulkUserUpload from "./BulkUserUpload";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { ColumnDef } from "@tanstack/react-table";
import PageHeader from "@/components/sheard/PageHeader";
import { DataTable } from "./DataTable";
import { ToggleSwitch } from "./ToggleSwitch";
import type { EditUserPayload } from "./EditUserModal";
import EditUserModal from "./EditUserModal";

/* ──────────────────────────────────────────────
   Generic row shape expected by UserListView
─────────────────────────────────────────────── */
export type UserRow = {
  age?: number;
  gender?: "male" | "female" | "other";
  gradeLevel?: string | number;
  _id: string;
  name: string;
  userId: string; // studentId or teacherId
  badge: string; // grade (student) or subject (teacher)
  email: string;
  phoneNumber: string;
  active: boolean;
  image: string;
};

export type UserListConfig = {
  /** "student" | "teacher" | "parent" */
  type: "student" | "teacher" | "parent";
  /** Page title e.g. "Students" */
  title: string;
  /** Table heading e.g. "All Students" */
  tableHeading: string;
  /** Column header for the ID e.g. "Student I'd" */
  idColumnHeader: string;
  /** Column header for the badge e.g. "Grade" or "Subject / Grade" */
  badgeColumnHeader: string;
  /** Search placeholder */
  searchPlaceholder: string;
  /** Button label */
  addButtonLabel: string;
  /** Route prefix to push on "View" e.g. "/administrator/students" */
  viewRoutePrefx: string;
  /** empty message */
  emptyMessage: string;
  /** error message */
  errorMessage: string;
};

type UserListViewProps = {
  config: UserListConfig;
  data: UserRow[] | undefined;
  isLoading: boolean;
  isError: boolean;
  error?: unknown;
  onRefetch: () => void;
  /** mutation pending state for toggle */
  isTogglePending: boolean;
  onToggle: (id: string, currentState: boolean) => void;
  /** mutation pending state for update */
  isUpdatePending: boolean;
  onUpdate: (id: string, payload: EditUserPayload) => Promise<unknown>;
  onAdd: () => void;
  onViewClick?: (row: UserRow) => void;
  onInviteGuardian?: (row: UserRow) => void;
  /** Extra slot rendered below the table (e.g. create modal) */
  children?: React.ReactNode;
};

/* ──────────────────────────────────────────────
   Stat cards at the top
─────────────────────────────────────────────── */
function StatCards({
  total,
  active,
  inactive,
  type,
}: {
  total: number;
  active: number;
  inactive: number;
  type: "student" | "teacher" | "parent";
}) {
  const label =
    type === "student"
      ? "Students"
      : type === "teacher"
        ? "Teachers"
        : "Parents";
  const cards = [
    {
      label: `Total ${label}`,
      value: total,
      icon: Users,
      iconBg: "bg-[#871dad]/10",
      iconColor: "text-[#871dad]",
      border: "border-[#871dad]/20",
    },
    {
      label: `Active ${label}`,
      value: active,
      icon: UserCheck,
      iconBg: "bg-[#5fb892]/10",
      iconColor: "text-[#5fb892]",
      border: "border-[#5fb892]/20",
    },
    {
      label: `Inactive ${label}`,
      value: inactive,
      icon: UserX,
      iconBg: "bg-[#ef3c50]/10",
      iconColor: "text-[#ef3c50]",
      border: "border-[#ef3c50]/20",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.label}
            className={`flex items-center gap-4 rounded-[16px] bg-white p-5 shadow-[0px_0px_16px_0px_rgba(0,0,0,0.07)] border ${card.border}`}
          >
            <div
              className={`flex h-[48px] w-[48px] flex-shrink-0 items-center justify-center rounded-[12px] ${card.iconBg}`}
            >
              <Icon size={22} className={card.iconColor} />
            </div>
            <div>
              <p className="text-[26px] font-bold text-[#333]">{card.value}</p>
              <p className="text-[13px] text-[#888]">{card.label}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ──────────────────────────────────────────────
   Main component
─────────────────────────────────────────────── */
export function UserListView({
  config,
  data,
  isLoading,
  isError,
  error,
  onRefetch,
  isTogglePending,
  onToggle,
  isUpdatePending,
  onUpdate,
  onAdd,
  onViewClick,
  onInviteGuardian,
  children,
}: UserListViewProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<UserRow | null>(null);
  const queryClient = useQueryClient();
  const [showBulk, setShowBulk] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [deleting, setDeleting] = useState<UserRow[]>([]);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(0);
  const [deleteError, setDeleteError] = useState("");
  const [message, setMessage] = useState("");
  // Use the same searched rows for rendering and select-all.
  const filteredData = useMemo(
    () =>
      data?.filter((u) =>
        [
          u.name,
          u.userId,
          u.badge,
          u.phoneNumber,
          u.active ? "active" : "inactive",
        ].some((value) =>
          value.toLowerCase().includes(query.trim().toLowerCase()),
        ),
      ),
    [data, query],
  );
  const selectedUsers = data?.filter((u) => selected.includes(u._id)) ?? [];
  const pagination = useListPagination(filteredData ?? [], query);
  const visibleUsers = pagination.items;
  const allVisibleSelected =
    Boolean(visibleUsers.length) &&
    visibleUsers.every((u) => selected.includes(u._id));

  async function confirmDelete() {
    setBusy(true);
    setDone(0);
    setDeleteError("");
    try {
      const outcome = await runSchoolBatch(
        deleting,
        (u) => deleteSchoolUser(config.type, u._id),
        setDone,
      );
      const deleted = new Set(outcome.succeeded.map((u) => u._id));
      setSelected((ids) => ids.filter((id) => !deleted.has(id)));
      setMessage(
        `${outcome.succeeded.length} deleted. ${outcome.failed.length} failed.`,
      );
      setDeleting(outcome.failed.map((f) => f.item));
      setDeleteError(
        outcome.failed.map((f) => `${f.item.name}: ${f.error}`).join("\n"),
      );
      await queryClient.invalidateQueries({ queryKey: ["administrator"] });
      await queryClient.invalidateQueries({ queryKey: ["parents"] });
      await queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      onRefetch();
    } finally {
      setBusy(false);
    }
  }

  /* Stats */
  const stats = useMemo(() => {
    if (!data) return { total: 0, active: 0, inactive: 0 };
    return {
      total: data.length,
      active: data.filter((u) => u.active).length,
      inactive: data.filter((u) => !u.active).length,
    };
  }, [data]);

  /* Columns */
  const columns = useMemo<ColumnDef<UserRow, unknown>[]>(
    () => [
      {
        id: "select",
        size: 40,
        header: () => (
          <input
            type="checkbox"
            aria-label="Select all visible users"
            checked={allVisibleSelected}
            ref={(node) => {
              if (node)
                node.indeterminate =
                  !allVisibleSelected &&
                  Boolean(visibleUsers.some((u) => selected.includes(u._id)));
            }}
            onChange={(e) =>
              setSelected((ids) =>
                e.target.checked
                  ? [...new Set([...ids, ...visibleUsers.map((u) => u._id)])]
                  : ids.filter((id) => !visibleUsers.some((u) => u._id === id)),
              )
            }
          />
        ),
        cell: ({ row }) => (
          <input
            type="checkbox"
            aria-label={`Select ${row.original.name}`}
            checked={selected.includes(row.original._id)}
            onChange={(e) =>
              setSelected((ids) =>
                e.target.checked
                  ? [...ids, row.original._id]
                  : ids.filter((id) => id !== row.original._id),
              )
            }
          />
        ),
      },
      {
        id: "no",
        header: "No",
        size: 60,
        cell: ({ row }) => (
          <span className="text-[16px] font-light text-[#666]">
            {pagination.offset + row.index + 1}
          </span>
        ),
      },
      {
        id: "name",
        header:
          config.type === "student"
            ? "Student Name"
            : config.type === "teacher"
              ? "Teacher Name"
              : "Parent Name",
        accessorFn: (row) => row.name,
        cell: ({ row }) => {
          const u = row.original;
          return (
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-gray-200 overflow-hidden flex-shrink-0 shadow-sm">
                {u.image ? (
                  <Image
                    src={u.image}
                    alt={u.name}
                    width={32}
                    height={32}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full bg-gradient-to-br from-purple-300 to-purple-600 flex items-center justify-center">
                    <span className="text-white text-[12px] font-semibold">
                      {u.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
              <span className="text-[15px] font-medium text-[#444]">
                {u.name}
              </span>
            </div>
          );
        },
      },
      {
        id: "userId",
        header: config.idColumnHeader,
        accessorFn: (row) => row.userId,
        cell: ({ getValue }) => (
          <span className="inline-flex items-center rounded-[6px] bg-[#f5f0fc] px-[10px] py-[4px] text-[13px] font-medium text-[#871dad]">
            {String(getValue() ?? "—")}
          </span>
        ),
      },
      {
        id: "badge",
        header: config.badgeColumnHeader,
        accessorFn: (row) => row.badge,
        cell: ({ getValue }) => (
          <span className="text-[15px] font-light text-[#666]">
            {String(getValue() ?? "—")}
          </span>
        ),
      },
      {
        id: "phone",
        header: "Phone",
        accessorFn: (row) => row.phoneNumber,
        cell: ({ getValue }) => (
          <span className="text-[15px] font-light text-[#666]">
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
              className={`inline-flex items-center gap-1.5 rounded-full px-[10px] py-[4px] text-[13px] font-medium ${
                active
                  ? "bg-[#edfaf3] text-[#2d9e6a]"
                  : "bg-[#fef2f2] text-[#e53e3e]"
              }`}
            >
              <span
                className={`h-[6px] w-[6px] rounded-full ${
                  active ? "bg-[#2d9e6a]" : "bg-[#e53e3e]"
                }`}
              />
              {active ? "Active" : "Inactive"}
            </span>
          );
        },
      },
      ...(onInviteGuardian
        ? [
            {
              id: "guardianInvitation",
              header: "Guardian Invitations",
              cell: ({ row }: { row: { original: UserRow } }) => (
                <button
                  type="button"
                  onClick={() => onInviteGuardian(row.original)}
                  aria-label={`Invite guardian for ${row.original.name}`}
                  className="cursor-pointer whitespace-nowrap rounded-[6px] border border-[#871dad] px-3 py-1.5 text-[13px] font-medium text-[#871dad] transition-colors hover:bg-[#faf2f9]"
                >
                  Invite Guardian
                </button>
              ),
            },
          ]
        : []),
      {
        id: "action",
        header: () => <span className="block text-center">Action</span>,
        size: 220,
        cell: ({ row }) => {
          const u = row.original;
          return (
            <div className="flex items-center justify-center gap-2">
              {config.type !== "parent" && (
                <>
                  <ToggleSwitch
                    active={u.active}
                    disabled={isTogglePending}
                    onChange={() => onToggle(u._id, u.active)}
                  />
                  <button
                    type="button"
                    onClick={() => setEditing(u)}
                    className="rounded-[6px] border border-[#871dad] px-[12px] py-[6px] text-[13px] font-medium text-[#871dad] hover:bg-[#faf2f9] transition-colors cursor-pointer"
                  >
                    Edit
                  </button>
                </>
              )}
              <button
                type="button"
                onClick={() => {
                  if (onViewClick) {
                    onViewClick(u);
                  } else {
                    router.push(`${config.viewRoutePrefx}/${u._id}`);
                  }
                }}
                className="rounded-[6px] bg-[#871dad] px-[12px] py-[6px] text-[13px] font-medium text-white hover:bg-[#751a99] transition-colors cursor-pointer"
              >
                View
              </button>
              <button
                type="button"
                aria-label={`Delete ${u.name}`}
                title={`Delete ${config.type}`}
                onClick={() => {
                  setDeleting([u]);
                  setDeleteError("");
                  setMessage("");
                }}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-[#e64540] hover:bg-red-50"
              >
                <Trash2 size={18} />
              </button>
            </div>
          );
        },
      },
    ],
    [
      config,
      isTogglePending,
      onToggle,
      router,
      onViewClick,
      onInviteGuardian,
      selected,
      allVisibleSelected,
      visibleUsers,
      pagination.offset,
    ],
  );

  return (
    <div className="space-y-6">
      <PageHeader title={config.title} />

      {/* ── Stats Row ── */}
      {!isLoading && !isError && data && (
        <StatCards
          total={stats.total}
          active={stats.active}
          inactive={stats.inactive}
          type={config.type}
        />
      )}

      {/* ── Table card ── */}
      <div className="rounded-[20px] bg-white p-4 sm:p-6 lg:p-8 shadow-[0px_0px_20px_0px_rgba(0,0,0,0.08)]">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-[20px] sm:text-[22px] font-semibold text-[#222]">
              {config.tableHeading}
              {!isLoading && data && (
                <span className="ml-2 text-[14px] font-normal text-[#999]">
                  ({data.length})
                </span>
              )}
            </h2>
            <p className="mt-0.5 text-[13px] text-[#aaa]">
              Manage and view all {config.type}s in your school
            </p>
          </div>

          <div className="flex flex-wrap items-stretch sm:items-center gap-3">
            {/* Search */}
            <div className="relative">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#999]"
              />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                type="text"
                placeholder={config.searchPlaceholder}
                className="h-[44px] w-full sm:w-[300px] rounded-[8px] border border-[#dde0e7] bg-[#f9f9f9] pl-10 pr-4 text-[14px] text-[#444] outline-none placeholder:text-[#bbb] focus:border-[#871dad] transition-colors"
              />
            </div>

            <button
              type="button"
              onClick={() => setShowBulk(true)}
              className="flex items-center justify-center gap-2 rounded-[10px] border border-[#871dad] px-4 py-2 text-sm font-semibold text-[#871dad] hover:bg-purple-50"
            >
              <Upload size={16} />
              Bulk Upload
            </button>
            {/* Add button */}
            <button
              type="button"
              onClick={onAdd}
              className="rounded-[10px] bg-[#871dad] cursor-pointer px-5 py-[11px] text-[14px] font-semibold text-white hover:bg-[#751a99] active:scale-95 transition-all whitespace-nowrap shadow-[0_4px_12px_rgba(135,29,173,0.3)]"
            >
              {config.addButtonLabel}
            </button>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-[#871dad]/20 to-transparent mb-4" />

        {message && (
          <p role="status" className="mb-4 text-sm">
            {message}
          </p>
        )}
        {selectedUsers.length > 0 && (
          <div className="mb-4 flex items-center gap-4">
            <span>{selectedUsers.length} selected</span>
            <button
              type="button"
              aria-label="Delete selected users"
              title="Delete selected users"
              onClick={() => {
                setDeleting(selectedUsers);
                setDeleteError("");
                setMessage("");
              }}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-[#e64540] hover:bg-red-50"
            >
              <Trash2 size={18} />
            </button>
            <button
              type="button"
              onClick={() => setSelected([])}
              className="text-sm underline"
            >
              Clear Selection
            </button>
          </div>
        )}

        <DataTable<UserRow>
          data={visibleUsers}
          paginate={false}
          columns={columns}
          isLoading={isLoading}
          isError={isError}
          error={error}
          onRetry={onRefetch}
          minWidth={800}
          emptyMessage={config.emptyMessage}
          errorMessage={config.errorMessage}
        />
        {!isLoading && !isError && <ListPagination {...pagination} />}
      </div>

      {/* Additional children (e.g., create modal) */}
      {children}
      {showBulk && (
        <BulkUserUpload
          type={config.type}
          onClose={() => setShowBulk(false)}
          onComplete={onRefetch}
        />
      )}
      <Dialog
        open={deleting.length > 0}
        onOpenChange={(open) => {
          if (!open && !busy) {
            setDeleting([]);
            setDeleteError("");
          }
        }}
      >
        <DialogContent showCloseButton={false} className="sm:max-w-[440px]">
          <DialogHeader>
            <DialogTitle>
              Delete{" "}
              {deleting.length === 1
                ? config.type
                : `${deleting.length} ${config.type}s`}
              ?
            </DialogTitle>
            <DialogDescription>
              Are you sure? This cannot be undone. Accounts with linked class,
              child, academic or chat records must be resolved first, or
              deactivated.
            </DialogDescription>
          </DialogHeader>
          <ul className="max-h-32 overflow-auto text-sm">
            {deleting.map((u) => (
              <li key={u._id}>
                {u.name} ({u.userId})
              </li>
            ))}
          </ul>
          {deleteError && (
            <p
              role="alert"
              className="max-h-40 overflow-auto whitespace-pre-line rounded-lg bg-red-50 p-3 text-sm text-red-600"
            >
              {deleteError}
            </p>
          )}
          <DialogFooter className="gap-3">
            <button
              type="button"
              disabled={busy}
              onClick={() => {
                setDeleting([]);
                setDeleteError("");
              }}
              className="rounded-lg border px-5 py-2 disabled:opacity-50"
            >
              No
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={confirmDelete}
              className="rounded-lg bg-[#e64540] px-5 py-2 font-semibold text-white disabled:opacity-50"
            >
              {busy ? `Deleting ${done}/${deleting.length}...` : "Yes"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit modal */}
      {editing && (
        <EditUserModal
          title={`Edit ${config.type === "student" ? "Student" : config.type === "teacher" ? "Teacher" : "Parent"}`}
          user={{
            _id: editing._id,
            name: editing.name,
            Id: editing.userId,
            phoneNumber: editing.phoneNumber === "—" ? "" : editing.phoneNumber,
            email: editing.email === "—" ? "" : editing.email,
            age: editing.age,
            gender: editing.gender,
            gradeLevel: editing.gradeLevel,
            state: editing.active ? "active" : "inactive",
          }}
          isPending={isUpdatePending}
          onSubmit={(payload) => onUpdate(editing._id, payload)}
          onClose={() => setEditing(null)}
        />
      )}
    </div>
  );
}
