"use client";

import { useState } from "react";
import { Bell, HelpCircle, Info, FileText } from "lucide-react";
import PageHeader from "@/components/sheard/PageHeader";
import NotificationSettings from "./NotificationSettings";
import DisputeCenter from "./DisputeCenter";
import AboutUs from "./AboutUs";

/* ───── Settings Menu Items ───── */
const menuItems = [
  { id: "notifications", label: "Notifications Setting", icon: Bell },
  { id: "dispute", label: "Dispute Center", icon: HelpCircle },
  { id: "about", label: "About Us", icon: Info },
  { id: "terms", label: "Terms & Conditions", icon: FileText },
];

export default function SettingsPage() {
  const [activeMenu, setActiveMenu] = useState("notifications");

  return (
    <div className="pt-10 mt-32">
      <PageHeader title="Settings" showBack={false} />

      <div className="flex min-h-[600px]">
        {/* Left Menu */}
        <div className="w-[320px] flex-shrink-0 space-y-6 pr-8">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeMenu === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveMenu(item.id)}
                className={`flex w-full cursor-pointer items-center gap-4 text-left transition-colors ${
                  isActive
                    ? "text-[#871dad]"
                    : "text-[#333] hover:text-[#871dad]"
                }`}
              >
                <Icon size={32} />
                <span className="text-[20px] capitalize">{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Vertical Divider */}
        <div className="mx-4 w-[1px] bg-gray-200" />

        {/* Right Panel */}
        <div className="flex-1 pl-8">
          {activeMenu === "notifications" && <NotificationSettings />}
          {activeMenu === "dispute" && <DisputeCenter />}
          {activeMenu === "about" && <AboutUs />}
          {activeMenu === "terms" && (
            <p className="text-[20px] text-[#666]">
              Terms & Conditions content coming soon.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
