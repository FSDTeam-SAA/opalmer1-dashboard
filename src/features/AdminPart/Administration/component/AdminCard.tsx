"use client";

import Image from "next/image";
import Link from "next/link";
import ToggleSwitch from "./ToggleSwitch";
import { Admin } from "./Administration";

const FALLBACK_AVATAR = "/images/12043465729ab7c8ceffce00749e7c71df0c9e25.jpg";

export default function AdminCard({
  admin,
  onToggle,
  onEdit,
}: {
  admin: Admin;
  onToggle: () => void;
  onEdit: () => void;
}) {
  const avatarUrl = admin.avatar?.url || FALLBACK_AVATAR;
  const assignedSchool =
    typeof admin.schoolId === "object" && admin.schoolId
      ? `${admin.schoolId.name}${
          admin.schoolId.code ? ` (${admin.schoolId.code})` : ""
        }`
      : "Unassigned";

  return (
    <div>
      <div className="flex gap-5 rounded-[20px] bg-white p-5 shadow-[0px_0px_20px_0px_rgba(0,0,0,0.1)]">
        {/* Profile Image */}
        <div className="h-[200px] w-[200px] flex-shrink-0 overflow-hidden rounded-[6px]">
          <Image
            src={avatarUrl}
            alt={admin.username}
            width={200}
            height={200}
            className="h-full w-full object-cover"
          />
        </div>

        {/* Info & Actions */}
        <div className="flex flex-1 flex-col justify-between py-3">
          <div>
            <Link
              href={`/admin/administration/${admin._id}`}
              className="text-[28px] font-semibold text-black tracking-[0.3px] hover:text-[#871dad] transition-colors"
            >
              {admin.username}
            </Link>
            <p className="mt-3 text-[18px] text-[#666]">{admin.phoneNumber}</p>
            <div className="mt-4 grid grid-cols-1 gap-2 text-[14px] text-[#666]">
              <p>
                <span className="font-semibold text-[#333]">Admin ID:</span>{" "}
                {admin.Id || "Not set"}
              </p>
              <p>
                <span className="font-semibold text-[#333]">Email:</span>{" "}
                {admin.email || "Not set"}
              </p>
              <p>
                <span className="font-semibold text-[#333]">School:</span>{" "}
                {assignedSchool}
              </p>
              <p className="capitalize">
                <span className="font-semibold text-[#333]">Status:</span>{" "}
                {admin.state || "inactive"}
              </p>
            </div>
          </div>

          {/* Actions Row */}
          <div className="flex items-center gap-8">
            <ToggleSwitch
              active={admin.state === "active"}
              onChange={onToggle}
            />
            {/* Edit Button */}
            <button
              onClick={onEdit}
              className="rounded-[6px] bg-[#871dad] cursor-pointer px-[15px] py-[10px] text-[18px] text-white hover:bg-[#751a99] transition-colors"
            >
              Edit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
