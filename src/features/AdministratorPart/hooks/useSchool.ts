import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createSchool, fetchMySchool, updateSchool } from "../api/school.api";
import type {
  CreateSchoolPayload,
  UpdateSchoolPayload,
} from "../types/school.types";

export const schoolKeys = {
  mine: ["administrator", "school", "mine"] as const,
};

/**
 * GET /school/my-school — the school owned by the authenticated administrator.
 *
 * The backend wraps a 404 ("School not found") inside a 500 in some paths,
 * so consumers should treat any error here as "no school yet" rather than
 * relying on the HTTP status alone.
 */
export function useMySchool() {
  return useQuery({
    queryKey: schoolKeys.mine,
    queryFn: fetchMySchool,
    staleTime: 5 * 60_000,
    retry: false,
  });
}

/** POST /school/create — creates the administrator's school. */
export function useCreateSchool() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateSchoolPayload) => createSchool(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: schoolKeys.mine });
    },
  });
}

/** PUT /school/update/:id - updates the administrator's assigned school. */
export function useUpdateSchool() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateSchoolPayload;
    }) => updateSchool(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: schoolKeys.mine });
    },
  });
}
