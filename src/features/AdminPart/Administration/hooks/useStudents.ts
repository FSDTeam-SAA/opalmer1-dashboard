import { useQuery } from "@tanstack/react-query";
import { fetchStudents } from "../api/student.api";

/**
 * useStudents
 * Fetches all students in the authenticated administrator's school.
 * Endpoint: GET /users/my-students
 */
export function useStudents() {
  return useQuery({
    queryKey: ["students", "my-school"],
    queryFn: fetchStudents,
  });
}
