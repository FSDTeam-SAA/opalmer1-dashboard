"use client";

import { useState } from "react";
import SettingsToggle from "./SettingsToggle";

export default function NotificationSettings() {
  const [settings, setSettings] = useState({
    general: true,
    sound: false,
    vibrate: true,
    specialOffers: false,
  });

  const toggle = (key: keyof typeof settings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const items = [
    { key: "general" as const, label: "General Notifications" },
    { key: "sound" as const, label: "Sound" },
    { key: "vibrate" as const, label: "Vibrate" },
    { key: "specialOffers" as const, label: "Special Offers" },
  ];

  return (
    <div className="space-y-0">
      {items.map((item, index) => (
        <div key={item.key}>
          <div className="flex items-center justify-between py-4">
            <span className="text-[22px] font-medium text-[#666]">
              {item.label}
            </span>
            <SettingsToggle
              active={settings[item.key]}
              onChange={() => toggle(item.key)}
            />
          </div>
          {index < items.length - 1 && <div className="h-[1px] bg-gray-200" />}
        </div>
      ))}
    </div>
  );
}
