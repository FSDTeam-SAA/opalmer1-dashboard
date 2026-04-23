"use client";

import { useNavbarTitle } from "./NavbarContext";

export default function Navbar() {
  const { title } = useNavbarTitle();

  return (
    <header className="relative h-[200px] px-8 pt-8 flex items-start justify-between">
      {/* Page Title */}
      <h1 className="text-[32px] font-bold capitalize text-white leading-[24px] mt-4">
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
