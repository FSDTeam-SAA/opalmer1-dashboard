import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createAdministrator,
  fetchAdministrators,
  fetchAdministratorDetails,
  setAdministratorState,
  updateAdministrator,
} from "../api/administrator.api";
import type {
  CreateAdministratorPayload,
  UpdateAdministratorPayload,
} from "../types/administrator.types";

export const ADMIN_QUERY_KEYS = {
  all: ["administrators"] as const,
  detail: (id: string) => ["administrators", "detail", id] as const,
};

/**
 * useAdministrators
 * Query hook for the administrators list.
 * Endpoint: GET /users/administrators
 */
export function useAdministrators() {
  return useQuery({
    queryKey: ADMIN_QUERY_KEYS.all,
    queryFn: fetchAdministrators,
  });
}

/**
 * useCreateAdministrator
 * Mutation hook for creating a new administrator.
 * Endpoint: POST /users/register (multipart/form-data)
 */
export function useCreateAdministrator() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateAdministratorPayload) =>
      createAdministrator(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_QUERY_KEYS.all });
    },
  });
}

/**
 * useUpdateAdministrator
 * Mutation hook for updating an administrator's profile fields.
 * Endpoint: PUT /users/:id
 */
export function useUpdateAdministrator() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateAdministratorPayload;
    }) => updateAdministrator(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_QUERY_KEYS.all });
    },
  });
}

/**
 * useToggleAdministratorState
 * Mutation hook for flipping an administrator's active state.
 * Endpoint: PUT /users/:id with { state }
 */
export function useToggleAdministratorState() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, state }: { id: string; state: "active" | "inactive" }) =>
      setAdministratorState(id, state),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_QUERY_KEYS.all });
    },
  });
}

/**
 * useAdministratorDetails
 * Query hook for a specific administrator's details.
 * Endpoint: GET /users/administrators/:id
 */
export function useAdministratorDetails(id: string) {
  return useQuery({
    queryKey: ADMIN_QUERY_KEYS.detail(id),
    queryFn: () => fetchAdministratorDetails(id),
    enabled: !!id,
  });
}
