import { useQuery } from "@tanstack/react-query";
import { fetchClassAttendance } from "../api/attendance.api";
import { AttendanceRequestBody } from "../types/attendance.types";

/**
 * useClassAttendance
 * Query hook for student class attendance.
 */
export function useClassAttendance(body: AttendanceRequestBody) {
  return useQuery({
    queryKey: ["attendance", "class", body.studentId, body.classId],
    queryFn: () => fetchClassAttendance(body),
    enabled: !!body.studentId && !!body.classId,
  });
}
