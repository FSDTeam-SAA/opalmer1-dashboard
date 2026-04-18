"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import PageHeader from "@/components/sheard/PageHeader";
import {
  useAdministrators,
  useToggleAdministratorState,
} from "../hooks/useAdministrators";
import type { Administrator } from "../types/administrators.types";
import { DataTable } from "./shared/DataTable";
import { ToggleSwitch } from "./shared/ToggleSwitch";

export function AdministrationView() {
  const [query, setQuery] = useState("");

  const { data, isLoading, isError, error, refetch } = useAdministrators();
  const toggleState = useToggleAdministratorState();

  const columns = useMemo<ColumnDef<Administrator, unknown>[]>(
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
        header: "Administrator Name",
        accessorFn: (row) => row.username,
        cell: ({ row }) => {
          const a = row.original;
          return (
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-full bg-gray-300 overflow-hidden">
                {a.avatar?.url ? (
                  <Image
                    src={a.avatar.url}
                    alt={a.username}
                    width={24}
                    height={24}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full bg-gradient-to-br from-purple-300 to-purple-500" />
                )}
              </div>
              <Link
                href={`/administrator/administration/${a._id}`}
                className="text-[16px] font-light text-[#666] hover:text-[#871dad] transition-colors"
              >
                {a.username}
              </Link>
            </div>
          );
        },
      },
      {
        id: "adminId",
        header: "Administrator I'd",
        accessorFn: (row) => row._id,
        cell: ({ getValue }) => (
          <span className="text-[16px] font-light text-[#666]">
            {String(getValue() ?? "—")}
          </span>
        ),
      },
      {
        id: "email",
        header: "Email",
        accessorFn: (row) => row.email ?? "—",
        cell: ({ getValue }) => (
          <span className="text-[16px] font-light text-[#666]">
            {String(getValue() ?? "—")}
          </span>
        ),
      },
      {
        id: "phone",
        header: "Phone",
        accessorFn: (row) => row.phoneNumber ?? "—",
        cell: ({ getValue }) => (
          <span className="text-[16px] font-light text-[#666]">
            {String(getValue() ?? "—")}
          </span>
        ),
      },
      {
        id: "state",
        header: "State",
        accessorFn: (row) => row.state ?? "—",
        cell: ({ getValue }) => {
          const value = String(getValue() ?? "—");
          const active = value === "active";
          return (
            <span
              className={`inline-flex items-center gap-1.5 text-[14px] font-medium capitalize ${
                active ? "text-[#5fb892]" : "text-[#ef3c50]"
              }`}
            >
              <span
                className={`h-2 w-2 rounded-full ${
                  active ? "bg-[#5fb892]" : "bg-[#ef3c50]"
                }`}
              />
              {value}
            </span>
          );
        },
      },
      {
        id: "action",
        header: () => <span className="block text-center">Action</span>,
        size: 160,
        cell: ({ row }) => {
          const a = row.original;
          const active = a.state === "active";
          return (
            <div className="flex items-center justify-center gap-3">
              <ToggleSwitch
                active={active}
                disabled={toggleState.isPending}
                onChange={() =>
                  toggleState.mutate({
                    id: a._id,
                    state: active ? "inactive" : "active",
                  })
                }
              />
              <Link
                href={`/administrator/administration/${a._id}`}
                className="rounded-[4px] bg-[#871dad] px-[6px] py-[8px] text-[16px] font-medium text-white hover:bg-[#751a99] transition-colors"
              >
                View
              </Link>
            </div>
          );
        },
      },
    ],
    [toggleState],
  );

  return (
    <div className="space-y-6">
      <PageHeader title="Administration" showBack={false} />

      <div className="rounded-[20px] bg-white p-4 sm:p-6 lg:p-8 shadow-[0px_0px_20px_0px_rgba(0,0,0,0.1)] mt-10">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <h2 className="text-[20px] sm:text-[24px] font-semibold text-[#333]">
            Administrator Id&apos;s{" "}
            {!isLoading && data && (
              <span className="text-[14px] font-normal text-[#666]">
                ({data.length})
              </span>
            )}
          </h2>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
            <div className="relative">
              <Search
                size={20}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#666]"
              />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                type="text"
                placeholder="Enter administrator Id"
                className="h-[48px] w-full sm:w-[350px] rounded-[8px] border border-[#08374d] bg-[#f9f9f9] pl-10 pr-4 text-[16px] text-[#666] outline-none placeholder:text-[#666]"
              />
            </div>
            <button className="rounded-[10px] bg-[#871dad] cursor-pointer px-5 py-[14px] sm:py-[18px] text-[14px] sm:text-[16px] font-bold text-white hover:bg-[#751a99] transition-colors whitespace-nowrap">
              Add New Administrator
            </button>
          </div>
        </div>

        <DataTable<Administrator>
          data={data}
          columns={columns}
          isLoading={isLoading}
          isError={isError}
          error={error}
          onRetry={() => refetch()}
          globalFilter={query}
          minWidth={900}
          emptyMessage="No administrators match your search."
          errorMessage="We couldn't load the administrators list."
        />
      </div>
    </div>
  );
}
