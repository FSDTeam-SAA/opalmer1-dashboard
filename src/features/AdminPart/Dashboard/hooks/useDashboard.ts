import { useQuery } from "@tanstack/react-query";
import { fetchStudentGenderStats, fetchUserStats } from "../api/dashboard.api";

/**
 * useUserStats
 * Fetches total counts of students, teachers, and parents.
 * Endpoint: GET /dashboard/stats
 */
export function useUserStats() {
  return useQuery({
    queryKey: ["dashboard", "user-stats"],
    queryFn: fetchUserStats,
  });
}

/**
 * useStudentGenderStats
 * Fetches student counts grouped by gender.
 * Endpoint: GET /dashboard/stats/student-gender
 */
export function useStudentGenderStats() {
  return useQuery({
    queryKey: ["dashboard", "student-gender-stats"],
    queryFn: fetchStudentGenderStats,
  });
}
