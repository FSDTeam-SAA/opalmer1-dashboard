import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createAdministrator,
  fetchAdministrators,
  setAdministratorState,
  updateAdministrator,
} from "../api/administrators.api";
import type {
  CreateAdministratorPayload,
  UpdateAdministratorPayload,
} from "../types/administrators.types";

export const administratorsKeys = {
  all: ["administrator", "administrators"] as const,
};

/** GET /users/administrators */
export function useAdministrators() {
  return useQuery({
    queryKey: administratorsKeys.all,
    queryFn: fetchAdministrators,
    staleTime: 30_000,
  });
}

/** POST /users/register (multipart) */
export function useCreateAdministrator() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateAdministratorPayload) =>
      createAdministrator(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: administratorsKeys.all });
    },
  });
}

/** PUT /users/:id */
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
      queryClient.invalidateQueries({ queryKey: administratorsKeys.all });
    },
  });
}

/** PUT /users/:id with { state }. Used by the row toggles. */
export function useToggleAdministratorState() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, state }: { id: string; state: "active" | "inactive" }) =>
      setAdministratorState(id, state),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: administratorsKeys.all });
    },
  });
}
