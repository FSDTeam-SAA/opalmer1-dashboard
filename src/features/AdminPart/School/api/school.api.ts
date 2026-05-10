import { api } from "@/lib/api";
import type {
  CreateSchoolPayload,
  SchoolResponse,
  SchoolsResponse,
  School,
} from "../types/school.types";

/**
 * GET /school
 * Fetches the list of all schools.
 */
export async function fetchSchools(): Promise<School[]> {
  const { data } = await api.get<SchoolsResponse>("/school");
  return data.data;
}

/**
 * POST /school/create
 * Creates a school. Platform admin only.
 */
export async function createSchool(
  payload: CreateSchoolPayload,
): Promise<School> {
  const { data } = await api.post<SchoolResponse>("/school/create", payload);
  return data.data;
}
