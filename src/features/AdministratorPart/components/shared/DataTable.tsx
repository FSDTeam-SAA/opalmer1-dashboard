"use client";

import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table";
import { ReactNode, useState } from "react";
import { ErrorFallback } from "./ErrorFallback";
import { TableSkeletonRows } from "./Skeletons";

type DataTableProps<TData> = {
  data: TData[] | undefined;
  columns: ColumnDef<TData, unknown>[];
  isLoading: boolean;
  isError: boolean;
  error?: unknown;
  onRetry?: () => void;
  globalFilter?: string;
  emptyMessage?: string;
  errorMessage?: string;
  /** Min width in px for the inner table (used for horizontal scroll). */
  minWidth?: number;
  /** Number of skeleton rows shown while loading. */
  skeletonRows?: number;
  /** Optional className passed to the outer scroll container. */
  className?: string;
  /** Optional row className resolver. */
  rowClassName?: (row: TData, idx: number) => string;
  /** Slot rendered when data is non-empty but you want to wrap rows differently. */
  children?: ReactNode;
};

/**
 * Headless TanStack-Table powered table with consistent loading / error /
 * empty handling for the administrator dashboard.
 *
 * Visual styling matches the existing administrator screens (purple header
 * underline, light row dividers, etc.) so it can be dropped into any view.
 */
export function DataTable<TData>({
  data,
  columns,
  isLoading,
  isError,
  error,
  onRetry,
  globalFilter,
  emptyMessage = "No records found.",
  errorMessage,
  minWidth = 700,
  skeletonRows = 6,
  className = "",
  rowClassName,
}: DataTableProps<TData>) {
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data: data ?? [],
    columns,
    state: { sorting, globalFilter: globalFilter ?? "" },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const columnCount = columns.length;
  const rows = table.getRowModel().rows;

  if (isError) {
    return (
      <ErrorFallback
        title="Failed to load data"
        message={errorMessage}
        error={error}
        onRetry={onRetry}
      />
    );
  }

  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="w-full" style={{ minWidth }}>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className="border-b-2 border-[#871dad]">
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="pb-3 text-left text-[14px] font-light text-[#666]"
                  style={{
                    width:
                      header.getSize() === 0 ? undefined : header.getSize(),
                  }}
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
          {isLoading && (
            <TableSkeletonRows rows={skeletonRows} columns={columnCount} />
          )}

          {!isLoading &&
            rows.length > 0 &&
            rows.map((row, idx) => (
              <tr
                key={row.id}
                className={`border-b border-gray-100 ${
                  rowClassName ? rowClassName(row.original, idx) : ""
                }`}
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="py-4 align-middle">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}

          {!isLoading && rows.length === 0 && (
            <tr>
              <td
                colSpan={columnCount}
                className="py-10 text-center text-[14px] text-[#666]"
              >
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
