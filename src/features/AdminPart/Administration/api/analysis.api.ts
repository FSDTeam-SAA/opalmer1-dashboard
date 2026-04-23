import { api } from "@/lib/api";
import { AnalysisResponse, AnalysisData } from "../types/analysis.types";

/**
 * GET /analysis/:classId/:studentId
 * Fetches attendance/progress analysis for a student in a specific class.
 */
export async function fetchAnalysis(
  classId: string,
  studentId: string,
): Promise<AnalysisData> {
  const { data } = await api.get<AnalysisResponse>(
    `/analysis/${classId}/${studentId}`,
  );
  return data.data;
}
