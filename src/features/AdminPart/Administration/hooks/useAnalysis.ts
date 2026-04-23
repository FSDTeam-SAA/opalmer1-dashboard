import { useQuery } from "@tanstack/react-query";
import { fetchAnalysis } from "../api/analysis.api";

/**
 * useAnalysis
 * Query hook for student subject analysis.
 */
export function useAnalysis(classId: string, studentId: string) {
  return useQuery({
    queryKey: ["analysis", classId, studentId],
    queryFn: () => fetchAnalysis(classId, studentId),
    enabled: !!classId && !!studentId,
  });
}
