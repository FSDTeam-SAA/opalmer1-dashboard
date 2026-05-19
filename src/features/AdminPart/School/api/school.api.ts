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
  const formData = new FormData();

  Object.entries(payload).forEach(([key, value]) => {
    if (value === undefined || value === null) return;

    if (
      key === "logo" &&
      typeof File !== "undefined" &&
      value instanceof File
    ) {
      formData.append("logo", value);
      return;
    }

    formData.append(key, String(value));
  });

  const { data } = await api.post<SchoolResponse>("/school/create", formData);
  return data.data;
}
