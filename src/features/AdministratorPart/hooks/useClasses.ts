import { useQuery } from "@tanstack/react-query";
import {
  fetchClassesByStudent,
  fetchClassesByTeacher,
} from "../api/classes.api";

export const classesKeys = {
  byTeacher: (teacherId: string) =>
    ["administrator", "classes", "by-teacher", teacherId] as const,
  byStudent: (studentId: string) =>
    ["administrator", "classes", "by-student", studentId] as const,
};

/** GET /classes/teacher/:teacherId */
export function useClassesByTeacher(teacherId: string | undefined) {
  return useQuery({
    queryKey: classesKeys.byTeacher(teacherId ?? ""),
    queryFn: () => fetchClassesByTeacher(teacherId as string),
    enabled: Boolean(teacherId),
    staleTime: 30_000,
  });
}

/** GET /classes/student/:studentId */
export function useClassesByStudent(studentId: string | undefined) {
  return useQuery({
    queryKey: classesKeys.byStudent(studentId ?? ""),
    queryFn: () => fetchClassesByStudent(studentId as string),
    enabled: Boolean(studentId),
    staleTime: 30_000,
  });
}
