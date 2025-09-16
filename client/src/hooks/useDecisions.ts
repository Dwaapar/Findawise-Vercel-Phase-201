import { useQuery, type UseQueryOptions, type UseQueryResult } from "@tanstack/react-query";
import { fetchDecisions, type AutonomicDecision, type DecisionsQueryParams } from "@/lib/api";

const decisionsQueryKey = (params?: DecisionsQueryParams) =>
  ["/api/empire-brain/decisions", params ?? {}] as const;

type DecisionsQueryKey = ReturnType<typeof decisionsQueryKey>;

type UseDecisionsOptions<TData> = Omit<
  UseQueryOptions<AutonomicDecision[], Error, TData, DecisionsQueryKey>,
  "queryKey" | "queryFn"
>;

export function useDecisions<TData = AutonomicDecision[]>(
  params?: DecisionsQueryParams,
  options?: UseDecisionsOptions<TData>,
): UseQueryResult<TData, Error> {
  return useQuery({
    queryKey: decisionsQueryKey(params),
    queryFn: () => fetchDecisions(params),
    ...options,
  });
}

export { decisionsQueryKey };
