import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createStudent,
  fetchMyStudents,
  fetchStudentDetails,
  setStudentState,
  updateStudent,
} from "../api/students.api";
import type {
  CreateStudentPayload,
  UpdateStudentPayload,
} from "../types/students.types";

export const studentsKeys = {
  all: ["administrator", "students", "my-school"] as const,
  detail: (id: string) => ["administrator", "students", "detail", id] as const,
};

/** GET /users/my-students — students of the authenticated administrator's school. */
export function useMyStudents() {
  return useQuery({
    queryKey: studentsKeys.all,
    queryFn: fetchMyStudents,
    staleTime: 30_000,
  });
}

/** POST /users/register (multipart, type=student) */
export function useCreateStudent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateStudentPayload) => createStudent(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: studentsKeys.all });
    },
  });
}

/** PUT /users/:id — update student profile fields. */
export function useUpdateStudent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateStudentPayload;
    }) => updateStudent(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: studentsKeys.all });
    },
  });
}

/** PUT /users/:id with { state }. Used by the row toggle. */
export function useToggleStudentState() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, state }: { id: string; state: "active" | "inactive" }) =>
      setStudentState(id, state),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: studentsKeys.all });
    },
  });
}

/** GET /users/:id — fetch detailed student profile */
export function useStudentDetails(id: string) {
  return useQuery({
    queryKey: studentsKeys.detail(id),
    queryFn: () => fetchStudentDetails(id),
    enabled: !!id,
  });
}
