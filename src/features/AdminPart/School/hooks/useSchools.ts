import { useQuery } from "@tanstack/react-query";
import { fetchSchools } from "../api/school.api";

export function useSchools() {
  return useQuery({
    queryKey: ["schools"],
    queryFn: fetchSchools,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
}
