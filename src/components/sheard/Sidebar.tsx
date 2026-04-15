"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BookMarked, Settings, LogOut } from "lucide-react";

const menuItems = [
  {
    label: "Dashboard",
    href: "/admin/dashboard",
    icon: Home,
  },
  {
    label: "Administration",
    href: "/admin/administration",
    icon: BookMarked,
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-5 top-1/2 -translate-y-1/2 z-30 flex h-[calc(100vh-40px)] w-[242px] flex-col rounded-[20px] bg-white shadow-[0px_0px_20px_0px_rgba(0,0,0,0.1)]">
      {/* Logo */}
      <div className="flex items-center justify-center pt-8 pb-6">
        <h1
          className="text-[40px] font-bold uppercase bg-clip-text text-transparent"
          style={{
            backgroundImage: "linear-gradient(93deg, #6F5AA6 0%, #9B87F5 100%)",
          }}
        >
          Logo
        </h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-[10px]">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-[12px] px-5 py-4 mb-2 text-[16px] transition-colors ${
                isActive
                  ? "bg-[#871dad] text-white backdrop-blur-[10px]"
                  : "text-[#333] hover:bg-gray-50"
              }`}
            >
              <Icon size={24} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom actions */}
      <div className="px-[20px] pb-8">
        <Link
          href="/admin/settings"
          className={`flex items-center gap-3 px-[10px] py-3 text-[16px] rounded-[12px] transition-colors ${
            pathname.startsWith("/admin/settings")
              ? "bg-[#871dad] text-white backdrop-blur-[10px]"
              : "text-[#333] hover:bg-gray-50"
          }`}
        >
          <Settings size={24} />
          <span>Settings</span>
        </Link>
        <button className="flex items-center gap-3 px-[10px] py-3 text-[16px] text-[#e64540] hover:bg-red-50 rounded-lg transition-colors w-full">
          <LogOut size={24} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
