"use client";
import { useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function DashboardShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative min-h-screen rounded-l-[20px] bg-white">
      <div className="absolute left-0 top-0 h-[200px] w-full bg-[#871dad]" />
      <Sidebar open={open} onClose={() => setOpen(false)} />
      <div className="relative min-w-0 lg:ml-[282px]">
        <Navbar onMenuClick={() => setOpen(true)} />
        <div className="relative -mt-[120px] px-4 pb-8 sm:px-6">{children}</div>
      </div>
    </div>
  );
}
