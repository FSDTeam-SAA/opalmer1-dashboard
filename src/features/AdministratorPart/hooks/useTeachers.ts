import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createTeacher,
  fetchMyTeachers,
  setTeacherState,
  updateTeacher,
} from "../api/teachers.api";
import type {
  CreateTeacherPayload,
  UpdateTeacherPayload,
} from "../types/teachers.types";

export const teachersKeys = {
  all: ["administrator", "teachers", "my-school"] as const,
};

/** GET /users/my-teachers — teachers of the authenticated administrator's school. */
export function useMyTeachers() {
  return useQuery({
    queryKey: teachersKeys.all,
    queryFn: fetchMyTeachers,
    staleTime: 30_000,
  });
}

/** POST /users/register (multipart, type=teacher) */
export function useCreateTeacher() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateTeacherPayload) => createTeacher(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: teachersKeys.all });
    },
  });
}

/** PUT /users/:id — update teacher profile fields. */
export function useUpdateTeacher() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateTeacherPayload;
    }) => updateTeacher(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: teachersKeys.all });
    },
  });
}

/** PUT /users/:id with { state }. Used by the row toggle. */
export function useToggleTeacherState() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, state }: { id: string; state: "active" | "inactive" }) =>
      setTeacherState(id, state),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: teachersKeys.all });
    },
  });
}
