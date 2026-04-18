import { api } from "@/lib/api";
import type {
  Administrator,
  AdministratorResponse,
  AdministratorsResponse,
  CreateAdministratorPayload,
  UpdateAdministratorPayload,
} from "../types/administrators.types";

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
 * Creates a new administrator. Multipart/form-data so an avatar can be uploaded.
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
 * Updates a user. Restricted fields (password, role, refreshToken) are stripped server-side.
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

/** Convenience wrapper for toggling the active state. */
export async function setAdministratorState(
  id: string,
  state: "active" | "inactive",
): Promise<Administrator> {
  return updateAdministrator(id, { state });
}
