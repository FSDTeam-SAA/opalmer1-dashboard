"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search } from "lucide-react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";
import { Skeleton } from "@/components/ui/skeleton";
import { useTeachers } from "../hooks/useTeachers";
import type { TeacherListItem } from "@/types/teacher.types";

const columnHelper = createColumnHelper<TeacherListItem>();

/* ───── Skeleton Rows ───── */
function TableSkeleton() {
  return (
    <div className="space-y-0">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-4 border-b border-gray-100 py-4"
        >
          <Skeleton className="h-5 w-[40px]" />
          <Skeleton className="h-6 w-6 rounded-full" />
          <Skeleton className="h-5 w-[120px]" />
          <Skeleton className="h-5 w-[100px]" />
          <Skeleton className="h-5 w-[40px]" />
          <Skeleton className="h-5 w-[120px]" />
          <Skeleton className="h-5 w-[40px]" />
          <Skeleton className="h-8 w-[60px] rounded-[4px]" />
        </div>
      ))}
    </div>
  );
}

export default function TeachersTable({
  slug,
  basePath = "/admin/administration",
}: {
  slug?: string;
  basePath?: string;
}) {
  const prefix = slug ? `${basePath}/${slug}` : `${basePath}`;
  const [globalFilter, setGlobalFilter] = useState("");

  const { data: teachers = [], isLoading, isError } = useTeachers();

  const columns = useMemo(
    () => [
      columnHelper.accessor("id", {
        header: "No",
        cell: (info) => info.getValue(),
        size: 60,
      }),
      columnHelper.accessor("name", {
        header: "Teacher Name",
        cell: (info) => (
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 flex-shrink-0 overflow-hidden rounded-full">
              <Image
                src={info.row.original.image}
                alt={info.getValue()}
                width={24}
                height={24}
                className="h-full w-full object-cover"
              />
            </div>
            <span className="text-[16px] font-light text-[#666]">
              {info.getValue()}
            </span>
          </div>
        ),
      }),
      columnHelper.accessor("teacherId", {
        header: "Teacher I'd",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("gradeLevel", {
        header: "Grade Level",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("subjects", {
        header: "Subjects",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("state", {
        header: "State",
        cell: (info) => info.getValue(),
      }),
      columnHelper.display({
        id: "action",
        header: "Action",
        cell: (info) => (
          <div className="flex items-center justify-center">
            <Link
              href={`${prefix}/teachers/${info.row.original.id}`}
              className="cursor-pointer rounded-[4px] bg-[#871dad] px-[6px] py-[8px] text-[16px] font-medium text-white hover:bg-[#751a99] transition-colors"
            >
              View
            </Link>
          </div>
        ),
        size: 100,
      }),
    ],
    [slug],
  );

  const table = useReactTable({
    data: teachers,
    columns,
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: (row, _columnId, filterValue) => {
      const search = filterValue.toLowerCase();
      return (
        row.original.name.toLowerCase().includes(search) ||
        row.original.teacherId.toLowerCase().includes(search)
      );
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: { pageSize: 15 },
    },
  });

  return (
    <div className="mt-32 pt-10">
      <div className="rounded-[20px] bg-white p-8 shadow-[0px_0px_20px_0px_rgba(0,0,0,0.1)]">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-[24px] font-semibold text-[#333]">
            Teacher Id&apos;s ({table.getFilteredRowModel().rows.length})
          </h2>
          <div className="relative">
            <Search
              size={20}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#666]"
            />
            <input
              type="text"
              placeholder="Enter teacher Id"
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="h-[48px] w-[350px] rounded-[8px] border border-[#08374d] bg-[#f9f9f9] pl-10 pr-4 text-[16px] text-[#333] outline-none placeholder:text-[#666]"
            />
          </div>
        </div>

        {/* Table */}
        {isLoading ? (
          <TableSkeleton />
        ) : isError ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <p className="text-[18px] font-medium text-[#e64540]">
              Failed to load teachers
            </p>
            <p className="mt-2 text-[14px] text-[#666]">
              Please try again later.
            </p>
          </div>
        ) : table.getFilteredRowModel().rows.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <p className="text-[18px] font-medium text-[#666]">
              No teachers found
            </p>
            {globalFilter && (
              <p className="mt-2 text-[14px] text-[#999]">
                Try adjusting your search query.
              </p>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr
                    key={headerGroup.id}
                    className="border-b-2 border-[#871dad]"
                  >
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        className={`pb-3 text-left text-[14px] font-light text-[#666] ${
                          header.id === "action" ? "w-[100px] text-center" : ""
                        } ${header.id === "id" ? "w-[60px]" : ""}`}
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getRowModel().rows.map((row) => (
                  <tr key={row.id} className="border-b border-gray-100">
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        className="py-4 text-[16px] font-light text-[#666]"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            {table.getPageCount() > 1 && (
              <div className="mt-6 flex items-center justify-between">
                <p className="text-[14px] text-[#666]">
                  Page {table.getState().pagination.pageIndex + 1} of{" "}
                  {table.getPageCount()}
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                    className="rounded-[6px] border border-[#871dad] px-4 py-2 text-[14px] text-[#871dad] transition-colors hover:bg-[#871dad] hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                    className="rounded-[6px] border border-[#871dad] px-4 py-2 text-[14px] text-[#871dad] transition-colors hover:bg-[#871dad] hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
