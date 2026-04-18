import { useQuery } from "@tanstack/react-query";
import { fetchStudentGenderStats, fetchUserStats } from "../api/dashboard.api";

export const dashboardKeys = {
  userStats: ["administrator", "dashboard", "user-stats"] as const,
  studentGender: ["administrator", "dashboard", "student-gender"] as const,
};

/** GET /dashboard/stats — totals for students/teachers/parents. */
export function useUserStats() {
  return useQuery({
    queryKey: dashboardKeys.userStats,
    queryFn: fetchUserStats,
    staleTime: 60_000,
  });
}

/** GET /dashboard/stats/student-gender — counts grouped by gender. */
export function useStudentGenderStats() {
  return useQuery({
    queryKey: dashboardKeys.studentGender,
    queryFn: fetchStudentGenderStats,
    staleTime: 60_000,
  });
}
