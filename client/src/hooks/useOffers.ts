import { useQuery, type UseQueryOptions, type UseQueryResult } from "@tanstack/react-query";
import { fetchOffers, type OfferFeed, type OffersQueryParams } from "@/lib/api";

const offersQueryKey = (params?: OffersQueryParams) =>
  ["/api/offer-engine/offers", params ?? {}] as const;

type OffersQueryKey = ReturnType<typeof offersQueryKey>;

type UseOffersOptions<TData> = Omit<
  UseQueryOptions<OfferFeed[], Error, TData, OffersQueryKey>,
  "queryKey" | "queryFn"
>;

export function useOffers<TData = OfferFeed[]>(
  params?: OffersQueryParams,
  options?: UseOffersOptions<TData>,
): UseQueryResult<TData, Error> {
  return useQuery({
    queryKey: offersQueryKey(params),
    queryFn: () => fetchOffers(params),
    ...options,
  });
}

export { offersQueryKey };
