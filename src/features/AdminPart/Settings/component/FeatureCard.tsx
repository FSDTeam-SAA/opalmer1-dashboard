"use client";

import { Edit3 } from "lucide-react";

export default function FeatureCard({
  title,
  description,
  onEdit,
}: {
  title: string;
  description: string;
  onEdit: () => void;
}) {
  return (
    <div className="rounded-[8px] border-l-[8px] border-[#871dad] bg-white p-5 shadow-[0px_0px_20px_0px_rgba(0,0,0,0.1)]">
      <div className="flex items-center justify-between">
        <h3 className="text-[22px] font-medium text-[#333]">{title}</h3>
        <button
          onClick={onEdit}
          className="cursor-pointer text-[#871dad] hover:text-[#751a99] transition-colors"
        >
          <Edit3 size={20} />
        </button>
      </div>
      <p className="mt-2 text-[20px] leading-[1.4] text-[#666]">
        {description}
      </p>
    </div>
  );
}
