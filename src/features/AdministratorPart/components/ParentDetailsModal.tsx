"use client";

import Image from "next/image";
import { X, Copy } from "lucide-react";
import type { UserRow } from "./shared/UserListView";

type ParentDetailsModalProps = {
  parent: UserRow;
  onClose: () => void;
};

export default function ParentDetailsModal({
  parent,
  onClose,
}: ParentDetailsModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(18,18,18,0.4)] p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-[500px] overflow-hidden rounded-[20px] bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-[#666] hover:bg-gray-100 transition-colors"
        >
          <X size={20} />
        </button>

        <div className="flex flex-col items-center">
          <div className="h-[100px] w-[100px] overflow-hidden rounded-full border-4 border-[#871dad] bg-gray-100 mb-4 shadow-sm">
            {parent.image ? (
              <Image
                src={parent.image}
                alt={parent.name}
                width={100}
                height={100}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-purple-300 to-purple-600">
                <span className="text-[32px] font-semibold text-white">
                  {parent.name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>
          <h2 className="text-[24px] font-bold text-[#333] text-center">
            {parent.name}
          </h2>
          <p className="text-[14px] text-[#666] bg-[#f5f0fc] text-[#871dad] px-3 py-1 rounded-full mt-2 inline-block font-medium">
            Parent ID: {parent.userId}
          </p>
        </div>

        <div className="mt-8 space-y-4">
          <div className="rounded-[12px] bg-[#f9f9f9] p-4 border border-gray-100">
            <h3 className="text-[14px] font-semibold text-[#888] mb-1">
              Contact Information
            </h3>
            <div className="space-y-2 mt-3">
              <div className="flex justify-between items-center">
                <span className="text-[#666] text-[15px]">Phone</span>
                <span className="text-[#333] font-medium">
                  {parent.phoneNumber || "N/A"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#666] text-[15px]">Email</span>
                <span className="text-[#333] font-medium">
                  {parent.email !== "—" ? parent.email : "N/A"}
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-[12px] bg-[#f9f9f9] p-4 border border-gray-100">
            <h3 className="text-[14px] font-semibold text-[#888] mb-1">
              Account Details
            </h3>
            <div className="space-y-2 mt-3">
              <div className="flex justify-between items-center">
                <span className="text-[#666] text-[15px]">Status</span>
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-[10px] py-[4px] text-[13px] font-medium ${
                    parent.active
                      ? "bg-[#edfaf3] text-[#2d9e6a]"
                      : "bg-[#fef2f2] text-[#e53e3e]"
                  }`}
                >
                  <span
                    className={`h-[6px] w-[6px] rounded-full ${
                      parent.active ? "bg-[#2d9e6a]" : "bg-[#e53e3e]"
                    }`}
                  />
                  {parent.active ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-center">
          <button
            onClick={onClose}
            className="w-full rounded-[10px] bg-[#871dad] cursor-pointer px-5 py-[12px] text-[15px] font-semibold text-white hover:bg-[#751a99] active:scale-95 transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
