"use client";

import { useState } from "react";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white rounded-tl-[20px] rounded-bl-[20px] relative">
      {/* Full-width purple header band */}
      <div className="absolute left-0 top-0 h-[200px] w-full bg-[#871dad]" />

      {/* Sidebar */}
      <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main content area */}
      <div className="relative lg:ml-[282px]">
        <AdminHeader onMenuClick={() => setSidebarOpen(true)} />

        {/* Page content overlaps the purple header */}
        <div className="relative -mt-[120px] px-4 sm:px-6 pb-8">{children}</div>
      </div>
    </div>
  );
}
