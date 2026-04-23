import { api } from "@/lib/api";
import {
  AcademicDocumentResponse,
  AcademicDocumentData,
} from "../types/academic-note.types";

/**
 * GET /academicDocument/student/:studentId
 * Fetches all academic documents for a specific student.
 */
export async function fetchAcademicDocumentsByStudent(
  studentId: string,
): Promise<AcademicDocumentData[]> {
  const { data } = await api.get<AcademicDocumentResponse>(
    `/academicDocument/student/${studentId}`,
  );
  return data.data;
}
