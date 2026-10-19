"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { Home, BookMarked, Settings, LogOut, Building2, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

const menuItems = [
  { label: "Guardian invitations", href: "/admin/guardians", icon: BookMarked },
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
  {
    label: "Schools",
    href: "/admin/school",
    icon: Building2,
  },
];

export default function Sidebar({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = () => {
    signOut({ callbackUrl: "/login" });
  };

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-20 bg-black/40 lg:hidden"
          onClick={onClose}
          aria-hidden
        />
      )}
      <aside
        className={`fixed left-5 top-1/2 -translate-y-1/2 z-30 flex h-[calc(100dvh-40px)] w-[242px] flex-col rounded-[20px] bg-white shadow-[0px_0px_20px_0px_rgba(0,0,0,0.1)] transition-transform lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-[270px]"}`}
      >
        <button
          onClick={onClose}
          aria-label="Close menu"
          className="absolute right-2 top-2 rounded p-2 lg:hidden"
        >
          <X size={20} />
        </button>
        {/* Logo */}
        <div className="flex shrink-0 items-center justify-center px-5 pt-6 pb-4">
          <Link
            href="/admin/dashboard"
            aria-label="AchieverPlus admin dashboard"
            onClick={onClose}
          >
            <Image
              src="/images/achieverplus-logo.png"
              alt="AchieverPlus logo"
              width={160}
              height={160}
              sizes="160px"
              className="h-auto max-h-[18dvh] w-40 max-w-full object-contain"
              priority
            />
          </Link>
        </div>

        {/* Navigation */}
        <nav className="min-h-0 flex-1 overflow-y-auto px-[10px]">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
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
          <button
            onClick={() => setShowLogoutModal(true)}
            className="flex items-center gap-3 px-[10px] py-3 text-[16px] text-[#e64540] hover:bg-red-50 rounded-lg transition-colors w-full"
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
