"use client";
import PolicyContent from "./PolicyContent";
export default function AboutUs({ readOnly = false }: { readOnly?: boolean }) {
  return <PolicyContent docType="about" readOnly={readOnly} />;
}
