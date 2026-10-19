"use client";

import NextImage, { type ImageProps } from "next/image";
import { useState } from "react";
import { ImageOff } from "lucide-react";

/** Data images never fall back to a stock photo. */
export default function DataImage({
  src,
  alt,
  className,
  width,
  height,
  fill,
  style,
  onError,
  ...props
}: ImageProps) {
  const [failedSource, setFailedSource] = useState<string | null>(null);
  const source = typeof src === "string" ? src.trim() : src;
  const sourceKey =
    typeof source === "string" ? source : JSON.stringify(source);
  if (!source || failedSource === sourceKey) {
    return (
      <span
        role="img"
        aria-label={`${alt || "Image"} unavailable`}
        className={`inline-flex shrink-0 items-center justify-center bg-gray-100 text-gray-400 ${className ?? ""}`}
        style={{
          width: width ? Number(width) : undefined,
          height: height ? Number(height) : undefined,
          ...(fill
            ? { position: "absolute", inset: 0, width: "100%", height: "100%" }
            : {}),
          ...style,
        }}
      >
        <ImageOff size={22} aria-hidden="true" />
      </span>
    );
  }
  return (
    <NextImage
      {...props}
      src={source}
      alt={alt}
      width={width}
      height={height}
      fill={fill}
      style={style}
      className={className}
      onError={(event) => {
        setFailedSource(sourceKey);
        onError?.(event);
      }}
    />
  );
}
