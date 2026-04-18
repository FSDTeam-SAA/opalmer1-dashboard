import { api } from "@/lib/api";
import type {
  CreateSchoolPayload,
  School,
  SchoolResponse,
} from "../types/school.types";

/**
 * GET /school/my-school
 * Returns the school owned by the authenticated administrator.
 * Backend: school.controller.ts → getMySchool (protected)
 */
export async function fetchMySchool(): Promise<School> {
  const { data } = await api.get<SchoolResponse>("/school/my-school");
  return data.data;
}

/**
 * POST /school/create
 * Creates a school owned by the authenticated administrator.
 * Backend: school.controller.ts → createSchool
 *  - Requires role==="administrator".
 *  - `name` is unique; `code` is unique when provided.
 */
export async function createSchool(
  payload: CreateSchoolPayload,
): Promise<School> {
  const { data } = await api.post<SchoolResponse>("/school/create", payload);
  return data.data;
}
