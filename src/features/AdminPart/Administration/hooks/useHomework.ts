import { useQuery } from "@tanstack/react-query";
import { fetchHomeworkByUser } from "../api/homework.api";

/**
 * useHomework
 * Query hook for homework by user ID.
 */
export function useHomework(userId: string, classId?: string) {
  return useQuery({
    queryKey: ["homework", "user", userId, classId],
    queryFn: () => fetchHomeworkByUser(userId, classId),
    enabled: !!userId && !!classId,
  });
}
