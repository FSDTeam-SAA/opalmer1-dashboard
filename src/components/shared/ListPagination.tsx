"use client";

import { useState } from "react";

export function useListPagination<T>(items: T[], resetKey = "") {
  const [state, setState] = useState({ page: 1, pageSize: 10, resetKey });
  if (state.resetKey !== resetKey) {
    setState({ ...state, page: 1, resetKey });
  }
  const totalPages = Math.max(1, Math.ceil(items.length / state.pageSize));
  const page =
    state.resetKey === resetKey ? Math.min(state.page, totalPages) : 1;
  // Keep a reduced data set from stranding the user beyond its last page.
  if (state.resetKey === resetKey && state.page !== page) {
    setState({ ...state, page });
  }
  const offset = (page - 1) * state.pageSize;
  return {
    items: items.slice(offset, offset + state.pageSize),
    offset,
    page,
    pageSize: state.pageSize,
    total: items.length,
    onPageChange: (next: number) =>
      setState((s) => ({
        ...s,
        page: Math.max(1, Math.min(next, totalPages)),
      })),
    onPageSizeChange: (pageSize: number) =>
      setState((s) => ({ ...s, page: 1, pageSize })),
  };
}

type ListPaginationProps = {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
};

export default function ListPagination({
  page,
  pageSize,
  total,
  onPageChange,
  onPageSizeChange,
}: ListPaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const start = total ? (page - 1) * pageSize + 1 : 0;
  const pages = Array.from(
    new Set([
      1,
      ...Array.from({ length: 3 }, (_, i) => page + i - 1),
      totalPages,
    ]),
  )
    .filter((value) => value >= 1 && value <= totalPages)
    .sort((a, b) => a - b);
  const buttonClass =
    "rounded-md border border-[#871dad] px-3 py-2 text-[#871dad] hover:bg-purple-50 disabled:cursor-not-allowed disabled:opacity-40";
  return (
    <nav
      aria-label="Table pagination"
      className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t pt-4 text-sm"
    >
      <p aria-live="polite">
        Showing {start}–{Math.min(page * pageSize, total)} of {total} records
      </p>
      <label className="flex items-center gap-2">
        Rows per page
        <select
          value={pageSize}
          onChange={(event) => onPageSizeChange(Number(event.target.value))}
          className="rounded-md border p-2"
        >
          {[10, 25, 50, 100].map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </label>
      <div className="flex flex-wrap items-center gap-2">
        <span>
          Page {page} of {totalPages}
        </span>
        <button
          type="button"
          className={buttonClass}
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          Previous
        </button>
        {pages.map((value, index) => (
          <span key={value} className="inline-flex items-center gap-2">
            {index > 0 && value - pages[index - 1] > 1 && <span>…</span>}
            <button
              type="button"
              aria-label={`Go to page ${value}`}
              aria-current={page === value ? "page" : undefined}
              onClick={() => onPageChange(value)}
              className={`${buttonClass} ${page === value ? "bg-[#871dad] text-white hover:bg-[#751a99]" : ""}`}
            >
              {value}
            </button>
          </span>
        ))}
        <button
          type="button"
          className={buttonClass}
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          Next
        </button>
      </div>
    </nav>
  );
}
