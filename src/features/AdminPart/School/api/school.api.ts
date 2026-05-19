import { api } from "@/lib/api";
import type {
  CreateSchoolPayload,
  SchoolResponse,
  SchoolsResponse,
  School,
  UpdateSchoolPayload,
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
  const formData = buildSchoolFormData(payload);

  const { data } = await api.post<SchoolResponse>("/school/create", formData);
  return data.data;
}

export async function updateSchool(
  id: string,
  payload: UpdateSchoolPayload,
): Promise<School> {
  const formData = buildSchoolFormData(payload);

  const { data } = await api.put<SchoolResponse>(
    `/school/update/${id}`,
    formData,
  );
  return data.data;
}

export async function deleteSchool(id: string): Promise<School> {
  const { data } = await api.delete<SchoolResponse>(`/school/delete/${id}`);
  return data.data;
}

function buildSchoolFormData(
  payload: CreateSchoolPayload | UpdateSchoolPayload,
) {
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

  return formData;
}
