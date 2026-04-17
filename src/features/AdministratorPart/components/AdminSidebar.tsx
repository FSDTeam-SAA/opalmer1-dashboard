"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  Home,
  GraduationCap,
  Users,
  BookMarked,
  Settings,
  LogOut,
  X,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

const menuItems = [
  { label: "Dashboard", href: "/administrator/dashboard", icon: Home },
  { label: "Students", href: "/administrator/students", icon: GraduationCap },
  { label: "Teachers", href: "/administrator/teachers", icon: Users },
  // {
  //   label: "Administration",
  //   href: "/administrator/administration",
  //   icon: BookMarked,
  // },
];

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export default function AdminSidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = () => {
    signOut({ callbackUrl: "/login" });
  };

  return (
    <>
      {/* Mobile backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-20 bg-black/40 lg:hidden"
          onClick={onClose}
          aria-hidden
        />
      )}

      <aside
        className={`fixed left-5 top-1/2 -translate-y-1/2 z-30 flex h-[calc(100vh-40px)] w-[242px] flex-col rounded-[20px] bg-white shadow-[0px_0px_20px_0px_rgba(0,0,0,0.1)] transition-transform duration-200 lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-[270px]"
        }`}
      >
        {/* Close button (mobile only) */}
        <button
          onClick={onClose}
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full text-[#333] hover:bg-gray-100 lg:hidden"
          aria-label="Close sidebar"
        >
          <X size={18} />
        </button>

        {/* Logo */}
        <div className="flex items-center justify-center pt-8 pb-6">
          <h1
            className="text-[40px] font-bold uppercase bg-clip-text text-transparent"
            style={{
              backgroundImage:
                "linear-gradient(93deg, #6F5AA6 0%, #9B87F5 100%)",
            }}
          >
            Logo
          </h1>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-[10px]">
          {menuItems.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(`${item.href}/`);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
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
            href="/administrator/settings"
            onClick={onClose}
            className={`flex items-center gap-3 px-[10px] py-3 text-[16px] rounded-[12px] transition-colors ${
              pathname.startsWith("/administrator/settings")
                ? "bg-[#871dad] text-white backdrop-blur-[10px]"
                : "text-[#333] hover:bg-gray-50"
            }`}
          >
            <Settings size={24} />
            <span>Settings</span>
          </Link>
          <button
            onClick={() => setShowLogoutModal(true)}
            className="flex items-center gap-3 px-[10px] py-3 text-[16px] text-[#e64540] hover:bg-red-50 rounded-lg transition-colors w-full cursor-pointer"
          >
            <LogOut size={24} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Logout Confirmation Modal */}
      <Dialog open={showLogoutModal} onOpenChange={setShowLogoutModal}>
        <DialogContent showCloseButton={false} className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="text-center">Confirm Logout</DialogTitle>
            <DialogDescription className="text-center">
              Are you sure you want to logout? You will need to sign in again to
              access the dashboard.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-center gap-3 pt-2">
            <button
              onClick={() => setShowLogoutModal(false)}
              className="px-6 py-2 rounded-lg border cursor-pointer border-gray-300 text-[#333] hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleLogout}
              className="px-6 py-2 rounded-lg bg-red-500 cursor-pointer text-white hover:bg-[#d63a35] transition-colors"
            >
              Logout
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
