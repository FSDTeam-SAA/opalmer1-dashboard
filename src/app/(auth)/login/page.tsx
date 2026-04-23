import { Suspense } from "react";
import Login from "@/features/auth/component/Login";

export default function page() {
  return (
    <Suspense fallback={null}>
      <Login />
    </Suspense>
  );
}
