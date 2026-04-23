"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Search, Users, UserCheck, UserX } from "lucide-react";
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
  children,
}: UserListViewProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<UserRow | null>(null);

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
            </div>
          );
        },
      },
    ],
    [config, isTogglePending, onToggle, router, onViewClick],
  );

  return (
    <div className="space-y-6">
      <PageHeader title={config.title} showBack={false} />

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

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
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

        <DataTable<UserRow>
          data={data}
          columns={columns}
          isLoading={isLoading}
          isError={isError}
          error={error}
          onRetry={onRefetch}
          globalFilter={query}
          minWidth={800}
          emptyMessage={config.emptyMessage}
          errorMessage={config.errorMessage}
        />
      </div>

      {/* Additional children (e.g., create modal) */}
      {children}

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
            ...(config.type === "student"
              ? {
                  gradeLevel:
                    editing.badge && editing.badge !== "—"
                      ? Number(editing.badge) || undefined
                      : undefined,
                }
              : {}),
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
