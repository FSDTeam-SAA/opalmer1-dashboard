import { useQuery } from "@tanstack/react-query";
import { fetchAcademicDocumentsByStudent } from "../api/academic-note.api";

/**
 * useAcademicNotes
 * Query hook for academic documents by student ID.
 */
export function useAcademicNotes(studentId: string) {
  return useQuery({
    queryKey: ["academicNotes", "student", studentId],
    queryFn: () => fetchAcademicDocumentsByStudent(studentId),
    enabled: !!studentId,
  });
}
