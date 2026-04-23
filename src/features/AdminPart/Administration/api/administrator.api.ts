import { api } from "@/lib/api";
import type {
  Administrator,
  AdministratorResponse,
  AdministratorsResponse,
  CreateAdministratorPayload,
  UpdateAdministratorPayload,
  AdministratorDetailsResponse,
  AdministratorDetailsData,
} from "../types/administrator.types";

/**
 * GET /users/administrators
 * Lists all users with role="administrator".
 * Backend: user.controller.ts → getAllAdministrators
 */
export async function fetchAdministrators(): Promise<Administrator[]> {
  const { data } = await api.get<AdministratorsResponse>(
    "/users/administrators",
  );
  return data.data;
}

/**
 * POST /users/register (role=administrator)
 * Creates a new administrator. Uses multipart/form-data to allow avatar upload.
 * Backend: user.controller.ts → registerUser
 */
export async function createAdministrator(
  payload: CreateAdministratorPayload,
): Promise<Administrator> {
  const form = new FormData();
  form.append("username", payload.username);
  form.append("Id", payload.Id);
  form.append("password", payload.password);
  form.append("role", payload.role);
  if (payload.type) form.append("type", payload.type);
  if (payload.phoneNumber) form.append("phoneNumber", payload.phoneNumber);
  if (payload.email) form.append("email", payload.email);
  if (payload.gender) form.append("gender", payload.gender);
  if (payload.image) form.append("image", payload.image);

  const { data } = await api.post<AdministratorResponse>(
    "/users/register",
    form,
    { headers: { "Content-Type": "multipart/form-data" } },
  );
  return data.data;
}

/**
 * PUT /users/:id
 * Updates a user (used for administrators). Restricted fields
 * (password, role, refreshToken) are stripped server-side.
 * Backend: user.controller.ts → updateUser
 */
export async function updateAdministrator(
  id: string,
  payload: UpdateAdministratorPayload,
): Promise<Administrator> {
  const { data } = await api.put<AdministratorResponse>(
    `/users/${id}`,
    payload,
  );
  return data.data;
}

/**
 * Convenience wrapper for toggling an administrator's active state.
 * Internally calls PUT /users/:id with { state }.
 */
export async function setAdministratorState(
  id: string,
  state: "active" | "inactive",
): Promise<Administrator> {
  return updateAdministrator(id, { state });
}

/**
 * GET /users/administrators/:id
 * Fetches detailed profile of an administrator including their school and students.
 */
export async function fetchAdministratorDetails(
  id: string,
): Promise<AdministratorDetailsData> {
  const { data } = await api.get<AdministratorDetailsResponse>(
    `/users/administrators/${id}`,
  );
  return data.data;
}
