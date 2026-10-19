"use client";

import { Menu } from "lucide-react";
import { useNavbarTitle } from "./NavbarContext";

export default function Navbar({ onMenuClick }: { onMenuClick: () => void }) {
  const { title } = useNavbarTitle();

  return (
    <header className="relative h-[200px] gap-3 px-4 pt-8 sm:px-8 flex items-start justify-between">
      <button
        onClick={onMenuClick}
        aria-label="Open menu"
        className="mt-2 rounded-lg p-2 text-white hover:bg-white/10 lg:hidden"
      >
        <Menu size={26} />
      </button>
      {/* Page Title */}
      <h1 className="min-w-0 flex-1 text-2xl sm:text-[32px] font-bold capitalize text-white leading-[24px] mt-4">
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
