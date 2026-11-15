import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createSchool,
  deleteSchool,
  fetchSchools,
  updateSchool,
} from "../api/school.api";
import type {
  CreateSchoolPayload,
  UpdateSchoolPayload,
} from "../types/school.types";

export const schoolKeys = {
  all: ["schools"] as const,
};

export function useSchools() {
  return useQuery({
    queryKey: schoolKeys.all,
    queryFn: fetchSchools,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
}

export function useCreateSchool() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateSchoolPayload) => createSchool(payload),
    onSuccess: () => {
      return Promise.all([
        queryClient.invalidateQueries({ queryKey: schoolKeys.all }),
        queryClient.invalidateQueries({ queryKey: ["school-districts"] }),
      ]);
    },
  });
}

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
      return Promise.all([
        queryClient.invalidateQueries({ queryKey: schoolKeys.all }),
        queryClient.invalidateQueries({ queryKey: ["school-districts"] }),
      ]);
    },
  });
}

export function useDeleteSchool() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteSchool(id),
    onSuccess: () => {
      return queryClient.invalidateQueries({ queryKey: schoolKeys.all });
    },
  });
}
