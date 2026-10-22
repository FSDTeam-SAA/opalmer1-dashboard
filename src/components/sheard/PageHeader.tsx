"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useNavbarTitle } from "./NavbarContext";
import { getDashboardBackHref } from "@/lib/dashboard-navigation";

interface PageHeaderProps {
  title: string;
  showBack?: boolean;
}

export default function PageHeader({
  title,
  showBack = true,
}: PageHeaderProps) {
  const pathname = usePathname();
  const backHref = getDashboardBackHref(pathname);
  const { setTitle } = useNavbarTitle();

  useEffect(() => {
    setTitle(title);
  }, [title, setTitle]);

  return (
    <div className="mb-6 flex w-full items-center px-2 pt-4">
      {showBack && backHref && (
        <Link
          href={backHref}
          aria-label="Back"
          className="group inline-flex h-9 shrink-0 items-center gap-2 rounded-full border border-purple-200 bg-white py-1 pl-1.5 pr-4 text-[13px] font-semibold leading-none text-[#871dad] shadow-[0_2px_8px_rgba(49,15,65,0.08)] transition-colors hover:border-purple-300 hover:bg-purple-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#871dad]"
        >
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-purple-50 transition-colors group-hover:bg-purple-100">
            <ArrowLeft size={15} strokeWidth={2} aria-hidden="true" />
          </span>
          Back
        </Link>
      )}
    </div>
  );
}
