"use client";

import { useState } from "react";
import { Bell, HelpCircle, Info, FileText, UserRound } from "lucide-react";
import { useSession } from "next-auth/react";
import PageHeader from "@/components/sheard/PageHeader";
import NotificationSettings from "./NotificationSettings";
import DisputeCenter from "./DisputeCenter";
import AboutUs from "./AboutUs";
import TermsConditions from "./TermsConditions";
import ProfileSettings from "./ProfileSettings";

/* ───── Settings Menu Items ───── */
const menuItems = [
  { id: "notifications", label: "Notifications Setting", icon: Bell },
  { id: "profile", label: "Profile Update", icon: UserRound },
  { id: "dispute", label: "Dispute Center", icon: HelpCircle },
  { id: "about", label: "About Us", icon: Info },
  { id: "terms", label: "Terms & Conditions", icon: FileText },
];

export default function SettingsPage({
  canManageContent = true,
}: {
  canManageContent?: boolean;
}) {
  const [activeMenu, setActiveMenu] = useState("notifications");
  const { data: session } = useSession();
  const isAdmin = canManageContent && session?.user.role === "admin";
  const visibleMenuItems = menuItems.filter(
    (item) => isAdmin || ["notifications", "profile"].includes(item.id),
  );
  const selectedMenu = visibleMenuItems.some((item) => item.id === activeMenu)
    ? activeMenu
    : "notifications";

  return (
    <div className="pt-6 sm:pt-10">
      <PageHeader title="Settings" showBack={false} />

      <div className="flex min-h-[600px] min-w-0 flex-col gap-6 rounded-3xl border border-gray-100 bg-white p-4 shadow-sm sm:p-8 md:flex-row">
        {/* Left Menu */}
        <div className="grid w-full shrink-0 grid-cols-2 gap-3 md:flex md:w-[220px] md:flex-col md:gap-5 md:pr-4">
          {visibleMenuItems.map((item) => {
            const Icon = item.icon;
            const isActive = selectedMenu === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveMenu(item.id)}
                className={`flex w-full cursor-pointer items-center gap-2 md:gap-3 text-left transition-colors ${
                  isActive
                    ? "text-[#871dad]"
                    : "text-[#333] hover:text-[#871dad]"
                }`}
              >
                <Icon size={24} className="shrink-0" />
                <span className="text-sm text-left md:text-base">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Vertical Divider */}
        <div className="hidden w-px shrink-0 bg-gray-200 md:block" />

        {/* Right Panel */}
        <div className="min-w-0 flex-1 md:pl-4">
          {selectedMenu === "notifications" && <NotificationSettings />}
          {selectedMenu === "profile" && <ProfileSettings />}
          {isAdmin && selectedMenu === "dispute" && <DisputeCenter />}
          {isAdmin && selectedMenu === "about" && <AboutUs />}
          {isAdmin && selectedMenu === "terms" && <TermsConditions />}
        </div>
      </div>
    </div>
  );
}
