import { api } from "@/lib/api";
import type { SchoolsResponse, School } from "../types/school.types";

/**
 * GET /school
 * Fetches the list of all schools.
 */
export async function fetchSchools(): Promise<School[]> {
  const { data } = await api.get<SchoolsResponse>("/school");
  return data.data;
}
