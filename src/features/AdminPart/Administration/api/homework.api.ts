import { api } from "@/lib/api";
import { HomeworkResponse, HomeworkData } from "../types/homework.types";

/**
 * GET /homework/user/:userId
 * Fetches all homework assigned to a specific user.
 */
export async function fetchHomeworkByUser(
  userId: string,
): Promise<HomeworkData[]> {
  const { data } = await api.get<HomeworkResponse>(`/homework/user/${userId}`);
  return data.data;
}
