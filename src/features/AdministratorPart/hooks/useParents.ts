import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchParents,
  updateParent,
  setParentState,
  createParent,
} from "../api/parents.api";
import type {
  UpdateParentPayload,
  CreateParentPayload,
} from "../types/parents.types";

export function useParents() {
  return useQuery({
    queryKey: ["parents"],
    queryFn: fetchParents,
  });
}

export function useCreateParent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateParentPayload) => createParent(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["parents"] });
    },
  });
}

export function useUpdateParent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateParentPayload;
    }) => updateParent(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["parents"] });
    },
  });
}

export function useToggleParentState() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, state }: { id: string; state: "active" | "inactive" }) =>
      setParentState(id, state),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["parents"] });
    },
  });
}
