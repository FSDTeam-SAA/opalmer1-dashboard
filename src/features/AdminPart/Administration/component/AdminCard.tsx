"use client";

import Image from "next/image";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import ToggleSwitch from "./ToggleSwitch";
import { Admin } from "./Administration";

export default function AdminCard({
  admin,
  onToggle,
  onDelete,
  onEdit,
}: {
  admin: Admin;
  onToggle: () => void;
  onDelete: () => void;
  onEdit: () => void;
}) {
  return (
    <div>
      <div className="flex gap-5 rounded-[20px] bg-white p-5 shadow-[0px_0px_20px_0px_rgba(0,0,0,0.1)]">
        {/* Profile Image */}
        <div className="h-[200px] w-[200px] flex-shrink-0 overflow-hidden rounded-[6px]">
          <Image
            src={admin.image}
            alt={admin.name}
            width={200}
            height={200}
            className="h-full w-full object-cover"
          />
        </div>

        {/* Info & Actions */}
        <div className="flex flex-1 flex-col justify-between py-3">
          <div>
            <Link
              href={`/admin/administration/${admin.name.replace(/\s+/g, "-")}`}
              className="text-[28px] font-semibold text-black tracking-[0.3px] hover:text-[#871dad] transition-colors"
            >
              {admin.name}
            </Link>
            <p className="mt-3 text-[18px] text-[#666]">{admin.email}</p>
            <p className="mt-2 text-[18px] text-[#666]">{admin.username}</p>
          </div>

          {/* Actions Row */}
          <div className="flex items-center gap-8">
            <ToggleSwitch active={admin.active} onChange={onToggle} />

            {/* Delete Button */}
            <button
              onClick={onDelete}
              className="flex h-[34px] w-[34px] items-center cursor-pointer justify-center rounded-full bg-[#fde8e8] text-[#e64540] hover:bg-[#fbd0d0] transition-colors"
            >
              <Trash2 size={18} />
            </button>

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
