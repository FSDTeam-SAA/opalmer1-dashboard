import { useQuery } from "@tanstack/react-query";
import { fetchHomeworkByUser } from "../api/homework.api";

/**
 * useHomework
 * Query hook for homework by user ID.
 */
export function useHomework(userId: string) {
  return useQuery({
    queryKey: ["homework", "user", userId],
    queryFn: () => fetchHomeworkByUser(userId),
    enabled: !!userId,
  });
}
