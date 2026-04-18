/**
 * Dashboard types
 *
 * Backend source:
 *   - GET /dashboard/stats                → adminDashboard.controller.ts:getUserStats
 *   - GET /dashboard/stats/student-gender → adminDashboard.controller.ts:getStudentGenderStats
 */

export type UserStats = {
  totalStudents: number;
  totalParents: number;
  totalTeachers: number;
};

export type UserStatsResponse = {
  success: boolean;
  message: string;
  data: UserStats;
};

export type StudentGenderStats = {
  male: number;
  female: number;
  other: number;
};

export type StudentGenderStatsResponse = {
  success: boolean;
  message: string;
  data: StudentGenderStats;
};
