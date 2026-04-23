import { api } from "@/lib/api";
import {
  LessonResponse,
  LessonData,
  SingleLessonResponse,
} from "../types/lesson.types";

/**
 * GET /lessons/student/:studentId
 * Fetches all lessons for a specific student.
 */
export async function fetchLessonsByStudent(
  studentId: string,
): Promise<LessonData[]> {
  const { data } = await api.get<LessonResponse>(
    `/lessons/student/${studentId}`,
  );
  return data.data;
}

/**
 * GET /lessons/:lessonId
 * Fetches a single lesson by ID.
 */
export async function fetchLessonById(lessonId: string): Promise<LessonData> {
  const { data } = await api.get<SingleLessonResponse>(`/lessons/${lessonId}`);
  return data.data;
}
