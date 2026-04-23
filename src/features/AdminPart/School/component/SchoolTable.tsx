"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search } from "lucide-react";
import PageHeader from "@/components/sheard/PageHeader";
import { Skeleton } from "@/components/ui/skeleton";
import { useSchools } from "../hooks/useSchools";
import type { School } from "../types/school.types";

export default function SchoolTable() {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: schools = [], isLoading, isError } = useSchools();

  // Use a fallback image for consistency
  const FALLBACK_IMAGE = "/images/4f8da1b70693c4fcf9e01b9293706aed5cd4e34d.jpg";

  const filteredSchools = useMemo(() => {
    const q = searchQuery.toLowerCase();
    if (!q) return schools;
    return schools.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        (s.code && s.code.toLowerCase().includes(q)) ||
        s.administrator?.username.toLowerCase().includes(q),
    );
  }, [searchQuery, schools]);

  return (
    <div className="mt-32 pt-10">
      <PageHeader title="Schools" showBack={false} />
      <div className="rounded-[20px] bg-white p-8 shadow-[0px_0px_20px_0px_rgba(0,0,0,0.1)]">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-[24px] font-semibold text-[#333]">
            Schools ({filteredSchools.length})
          </h2>
          <div className="relative">
            <Search
              size={20}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#666]"
            />
            <input
              type="text"
              placeholder="Search schools..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-[48px] w-[350px] rounded-[8px] border border-[#08374d] bg-[#f9f9f9] pl-10 pr-4 text-[16px] text-[#333] outline-none placeholder:text-[#666]"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-0">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-4 border-b border-gray-100 py-4"
              >
                <Skeleton className="h-5 w-[40px]" />
                <Skeleton className="h-6 w-6 rounded-full" />
                <Skeleton className="h-5 w-[160px]" />
                <Skeleton className="h-5 w-[120px]" />
                <Skeleton className="h-5 w-[150px]" />
                <Skeleton className="h-5 w-[150px]" />
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <p className="text-[18px] font-medium text-[#e64540]">
              Failed to load schools
            </p>
            <p className="mt-2 text-[14px] text-[#666]">
              Please try again later.
            </p>
          </div>
        ) : filteredSchools.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <p className="text-[18px] font-medium text-[#666]">
              No schools found
            </p>
            {searchQuery && (
              <p className="mt-2 text-[14px] text-[#999]">
                Try adjusting your search query.
              </p>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-[#871dad]">
                  <th className="w-[60px] pb-3 text-left text-[14px] font-light text-[#666]">
                    No
                  </th>
                  <th className="pb-3 text-left text-[14px] font-light text-[#666]">
                    School Name
                  </th>
                  <th className="pb-3 text-left text-[14px] font-light text-[#666]">
                    Code
                  </th>
                  <th className="pb-3 text-left text-[14px] font-light text-[#666]">
                    Administrator
                  </th>
                  <th className="pb-3 text-left text-[14px] font-light text-[#666]">
                    Email
                  </th>
                  <th className="pb-3 text-left text-[14px] font-light text-[#666]">
                    Created At
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredSchools.map((school, idx) => (
                  <tr key={school._id} className="border-b border-gray-100">
                    <td className="py-4 text-[16px] font-light text-[#666]">
                      {idx + 1}
                    </td>
                    <td className="py-4">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 flex-shrink-0 overflow-hidden rounded-full">
                          <Image
                            src={school.logo || FALLBACK_IMAGE}
                            alt={school.name}
                            width={32}
                            height={32}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <span className="text-[16px] font-light text-[#666]">
                          {school.name}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 text-[16px] font-light text-[#666]">
                      {school.code || "—"}
                    </td>
                    <td className="py-4 text-[16px] font-light text-[#666]">
                      {school.administrator?.username || "—"}
                    </td>
                    <td className="py-4 text-[16px] font-light text-[#666]">
                      {school.email || "—"}
                    </td>
                    <td className="py-4 text-[16px] font-light text-[#666]">
                      {new Date(school.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
