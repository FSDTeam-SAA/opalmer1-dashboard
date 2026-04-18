import { api } from "@/lib/api";
import type {
  StudentGenderStats,
  StudentGenderStatsResponse,
  UserStats,
  UserStatsResponse,
} from "../types/dashboard.types";

/**
 * GET /dashboard/stats
 * Returns platform-wide totals for students, parents, and teachers.
 * Backend: adminDashboard.controller.ts → getUserStats (protected)
 */
export async function fetchUserStats(): Promise<UserStats> {
  const { data } = await api.get<UserStatsResponse>("/dashboard/stats");
  return data.data;
}

/**
 * GET /dashboard/stats/student-gender
 * Returns student counts grouped by gender (male/female/other).
 * Backend: adminDashboard.controller.ts → getStudentGenderStats (protected)
 */
export async function fetchStudentGenderStats(): Promise<StudentGenderStats> {
  const { data } = await api.get<StudentGenderStatsResponse>(
    "/dashboard/stats/student-gender",
  );
  return data.data;
}
