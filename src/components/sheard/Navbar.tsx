"use client";

import { Menu } from "lucide-react";
import Link from "next/link";
import NotificationBell from "@/features/admin-workspace/NotificationBell";
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

      <div className="flex shrink-0 items-start gap-2 sm:gap-3">
        <Link
          href="/login?role=administrator"
          className="mt-2 inline-flex min-h-[46px] max-w-32 items-center justify-center rounded-xl border border-white/25 bg-white/10 px-3 py-2 text-center text-xs font-semibold text-white transition-colors hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:max-w-none sm:px-4 sm:text-sm"
        >
          Login as Administrator
        </Link>
        <NotificationBell />
      </div>
    </header>
  );
}
