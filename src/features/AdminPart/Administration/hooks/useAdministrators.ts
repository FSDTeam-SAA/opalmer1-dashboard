import { useQuery } from "@tanstack/react-query";
import { fetchAdministrators } from "../api/administrator.api";

export function useAdministrators() {
  return useQuery({
    queryKey: ["administrators"],
    queryFn: fetchAdministrators,
  });
}
