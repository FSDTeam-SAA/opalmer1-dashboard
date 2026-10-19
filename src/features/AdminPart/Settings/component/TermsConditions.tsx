"use client";
import PolicyContent from "./PolicyContent";
export default function TermsConditions({
  readOnly = false,
}: {
  readOnly?: boolean;
}) {
  return <PolicyContent docType="terms" readOnly={readOnly} />;
}
