"use client";

import { Skeleton } from "@/components/ui/skeleton";

/** Stat card skeleton (matches the stat-card layout on the dashboard). */
export function StatCardSkeleton() {
  return (
    <div className="flex-1 rounded-[12px] mt-10 bg-white p-5 shadow-[0px_0px_20px_0px_rgba(0,0,0,0.1)]">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <Skeleton className="h-[44px] w-[4px] rounded-[10px]" />
          <div className="space-y-2">
            <Skeleton className="h-[14px] w-[80px]" />
            <Skeleton className="h-[20px] w-[110px]" />
          </div>
        </div>
        <Skeleton className="h-8 w-8 rounded-[4px]" />
      </div>
      <Skeleton className="mt-3 h-[12px] w-[140px]" />
    </div>
  );
}

/** Donut/chart-card skeleton. */
export function DonutSkeleton() {
  return (
    <div className="w-full lg:w-[274px] rounded-[20px] bg-white p-6 shadow-[0px_0px_20px_0px_rgba(0,0,0,0.1)]">
      <Skeleton className="mx-auto h-[20px] w-[100px]" />
      <div className="flex items-center justify-center py-6">
        <Skeleton className="h-[160px] w-[160px] rounded-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-[14px] w-full" />
        <Skeleton className="h-[14px] w-full" />
      </div>
    </div>
  );
}

/** Generic table-row skeleton. */
export function TableRowSkeleton({ columns }: { columns: number }) {
  return (
    <tr className="border-b border-gray-100">
      {Array.from({ length: columns }).map((_, i) => (
        <td key={i} className="py-4">
          <Skeleton className="h-[16px] w-full max-w-[160px]" />
        </td>
      ))}
    </tr>
  );
}

/** A block of N skeleton rows for table loading states. */
export function TableSkeletonRows({
  rows = 6,
  columns,
}: {
  rows?: number;
  columns: number;
}) {
  return (
    <>
      {Array.from({ length: rows }).map((_, i) => (
        <TableRowSkeleton key={i} columns={columns} />
      ))}
    </>
  );
}
