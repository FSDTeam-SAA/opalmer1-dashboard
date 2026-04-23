"use client";

import { Bell, Menu } from "lucide-react";
import { useNavbarTitle } from "@/components/sheard/NavbarContext";

interface AdminHeaderProps {
  onMenuClick: () => void;
}

export default function AdminHeader({ onMenuClick }: AdminHeaderProps) {
  const { title } = useNavbarTitle();

  return (
    <header className="relative h-[200px] px-6 sm:px-8 pt-8 flex items-start justify-between">
      {/* Mobile hamburger */}
      <button
        onClick={onMenuClick}
        className="flex h-[39px] w-[39px] items-center justify-center rounded-full border-2 border-white/30 text-white lg:hidden"
        aria-label="Open sidebar"
      >
        <Menu size={22} />
      </button>

      {/* Page Title */}
      <h1 className="hidden lg:block text-[32px] font-bold capitalize text-white leading-[24px] mt-4">
        {title}
      </h1>
      <h1 className="lg:hidden text-[22px] sm:text-[26px] font-bold capitalize text-white leading-[24px] mt-2 ml-4">
        {title}
      </h1>

      {/* Notification */}
      {/* <div className="relative mt-2">
        <div className="flex h-[39px] w-[39px] items-center justify-center rounded-full border-2 border-white/30">
          <Bell size={24} className="text-white" />
        </div>
        <span className="absolute -right-1 -top-1 flex h-[17px] w-[17px] items-center justify-center rounded-full bg-[#4aa678] text-[11px] font-medium text-white">
          5
        </span>
      </div> */}
    </header>
  );
}
