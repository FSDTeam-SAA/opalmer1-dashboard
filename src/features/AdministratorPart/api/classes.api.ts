import { api } from "@/lib/api";
import type {
  ClassesResponse,
  ClassRecord,
  StudentClassesResponse,
} from "../types/classes.types";

/**
 * GET /classes/teacher/:teacherId
 * Returns classes taught by the given teacher (with populated teacher info).
 * Backend: class.controller.ts → getClassesByTeacher (open route).
 */
export async function fetchClassesByTeacher(
  teacherId: string,
): Promise<ClassRecord[]> {
  const { data } = await api.get<ClassesResponse>(
    `/classes/teacher/${teacherId}`,
  );
  return data.data;
}

/**
 * GET /classes/student/:studentId
 * Returns classes for the student's grade (with populated teacher info).
 * Backend: class.controller.ts → getClassesByStudent (protected route).
 *
 * The backend wraps `{ student, classes }`; we surface only the classes
 * here since the StudentProfileView already has the student record from
 * its cached list.
 */
export async function fetchClassesByStudent(
  studentId: string,
): Promise<ClassRecord[]> {
  const { data } = await api.get<StudentClassesResponse>(
    `/classes/student/${studentId}`,
  );
  return data.data.classes;
}
