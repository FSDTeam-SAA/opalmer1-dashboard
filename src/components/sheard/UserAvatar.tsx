"use client";

import Image from "next/image";
import { useState } from "react";

type UserAvatarProps = {
  name?: string;
  src?: string | null;
  size?: number;
  className?: string;
};

const initials = (name?: string) =>
  (name ?? "")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("") || "?";

/** Profile photo with an initials fallback when there is no image or it fails to load. */
export default function UserAvatar({
  name,
  src,
  size = 32,
  className = "",
}: UserAvatarProps) {
  const [failed, setFailed] = useState(false);
  const showImage = Boolean(src) && !failed;

  return (
    <span
      className={`relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-purple-300 to-[#871dad] font-semibold text-white ${className}`}
      style={{ width: size, height: size, fontSize: Math.max(10, size * 0.38) }}
      aria-hidden={showImage ? undefined : true}
    >
      {showImage ? (
        <Image
          src={src as string}
          alt={name ? `${name} photo` : ""}
          width={size}
          height={size}
          className="h-full w-full object-cover"
          onError={() => setFailed(true)}
        />
      ) : (
        initials(name)
      )}
    </span>
  );
}
