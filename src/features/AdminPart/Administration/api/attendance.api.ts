import { api } from "@/lib/api";
import {
  AttendanceResponse,
  AttendanceRecord,
  AttendanceRequestBody,
} from "../types/attendance.types";

/**
 * GET /attendances/:studentId/:classId
 * Fetches class attendance for a specific student and class.
 */
export async function fetchClassAttendance(
  body: AttendanceRequestBody,
): Promise<AttendanceRecord[]> {
  const { data } = await api.get<AttendanceResponse>(
    `/attendances/${body.studentId}/${body.classId}`,
  );
  return data.data;
}
