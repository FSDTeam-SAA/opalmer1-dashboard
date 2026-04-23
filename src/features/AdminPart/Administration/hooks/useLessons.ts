import { useQuery } from "@tanstack/react-query";
import { fetchLessonsByStudent, fetchLessonById } from "../api/lesson.api";

/**
 * useLessons
 * Query hook for lessons by student ID.
 */
export function useLessons(studentId: string) {
  return useQuery({
    queryKey: ["lessons", "student", studentId],
    queryFn: () => fetchLessonsByStudent(studentId),
    enabled: !!studentId,
  });
}

/**
 * useLessonDetails
 * Query hook for a single lesson by ID.
 */
export function useLessonDetails(lessonId: string) {
  return useQuery({
    queryKey: ["lessons", lessonId],
    queryFn: () => fetchLessonById(lessonId),
    enabled: !!lessonId,
  });
}
