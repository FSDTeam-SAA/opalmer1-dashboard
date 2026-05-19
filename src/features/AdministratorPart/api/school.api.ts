import { api } from "@/lib/api";
import type {
  CreateSchoolPayload,
  School,
  SchoolResponse,
  UpdateSchoolPayload,
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

/**
 * PUT /school/update/:id
 * Updates the administrator's assigned school details.
 */
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
