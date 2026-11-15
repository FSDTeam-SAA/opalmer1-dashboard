"use client";

import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { api } from "@/lib/api";

type Growth = { year: number; months: { month: number; count: number }[] };
const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export default function AccountGrowthChart() {
  const { data: session } = useSession();
  const growth = useQuery({
    queryKey: ["dashboard-growth", session?.user.id],
    enabled: Boolean(session?.user.id),
    queryFn: async () =>
      (await api.get<{ data: Growth }>("/dashboard/stats/growth")).data.data,
  });
  const max = Math.max(
    1,
    ...(growth.data?.months.map((row) => row.count) ?? []),
  );
  return (
    <section className="min-w-0 flex-1 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-gray-900">Account growth</h2>
      <p className="mt-1 text-sm text-gray-500">
        New students, teachers and parents
        {growth.data ? ` in ${growth.data.year}` : ""}
      </p>
      {growth.isPending && (
        <p role="status" className="py-12 text-center text-sm text-gray-500">
          Loading account growth...
        </p>
      )}
      {growth.isError && (
        <p role="alert" className="py-12 text-center text-sm text-red-600">
          Unable to load account growth.{" "}
          <button onClick={() => growth.refetch()} className="underline">
            Retry
          </button>
        </p>
      )}
      {growth.data && (
        <div className="mt-6 overflow-x-auto">
          <div
            className="flex min-w-[360px] items-end gap-2"
            aria-label={`Monthly new accounts in ${growth.data.year}`}
            role="img"
          >
            {growth.data.months.map((row) => (
              <div
                key={row.month}
                className="flex min-w-0 flex-1 flex-col items-center gap-2"
              >
                <span className="text-xs text-gray-600">{row.count}</span>
                <div className="flex h-36 w-full items-end justify-center">
                  <div
                    className="w-full max-w-9 rounded-t-md bg-[#871dad]"
                    style={{
                      height: row.count ? `${(row.count / max) * 100}%` : "2px",
                      opacity: row.count ? 1 : 0.15,
                    }}
                  />
                </div>
                <span className="text-[10px] text-gray-500">
                  {months[row.month - 1]}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
