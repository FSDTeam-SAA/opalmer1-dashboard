import { useQuery } from "@tanstack/react-query";
import { fetchTeachers } from "../api/teacher.api";

/**
 * useTeachers
 * Fetches all teachers in the authenticated administrator's school.
 * Endpoint: GET /users/my-teachers
 */
export function useTeachers() {
  return useQuery({
    queryKey: ["teachers", "my-school"],
    queryFn: fetchTeachers,
  });
}
