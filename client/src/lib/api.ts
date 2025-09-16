import { OfferFeed } from "@shared/offerEngineTables";
import { EducationQuiz } from "@shared/educationTables";
import { autonomicDecisions } from "@shared/empireBrainTables";

export type AutonomicDecision = typeof autonomicDecisions.$inferSelect;
export type { OfferFeed, EducationQuiz };

type Primitive = string | number | boolean | Date;
type QueryValue = Primitive | Primitive[] | undefined | null;

type ApiSuccess<T> = {
  success: true;
  data: T;
  message?: string;
};

type ApiError = {
  success: false;
  error?: string;
  message?: string;
};

type ApiResponse<T> = ApiSuccess<T> | ApiError;

function serializeQueryValue(value: Primitive): string {
  if (value instanceof Date) {
    return value.toISOString();
  }

  return String(value);
}

function buildQueryString(params?: Record<string, QueryValue>): string {
  if (!params) {
    return "";
  }

  const searchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null) {
      continue;
    }

    if (Array.isArray(value)) {
      if (value.length === 0) {
        continue;
      }

      const joined = value.map(serializeQueryValue).join(",");
      searchParams.set(key, joined);
      continue;
    }

    searchParams.set(key, serializeQueryValue(value));
  }

  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : "";
}

async function fetchJson<T>(input: string, init?: RequestInit): Promise<T> {
  const response = await fetch(input, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    ...init,
  });

  if (!response.ok) {
    const errorMessage = (await response.text()) || response.statusText;
    throw new Error(errorMessage);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

function ensureSuccess<T>(response: ApiResponse<T>, fallbackMessage: string): T {
  if (!response.success) {
    throw new Error(response.error ?? response.message ?? fallbackMessage);
  }

  return response.data;
}

export interface OffersQueryParams {
  merchant?: string;
  category?: string;
  emotion?: string;
  region?: string;
  priceMin?: number;
  priceMax?: number;
  isActive?: boolean;
  isExpired?: boolean;
  tags?: string[];
  limit?: number;
  offset?: number;
  sortBy?: "relevance" | "price" | "ctr" | "conversion" | "revenue" | "updated";
  sortOrder?: "asc" | "desc";
}

export async function fetchOffers(params?: OffersQueryParams): Promise<OfferFeed[]> {
  const query = buildQueryString({
    merchant: params?.merchant,
    category: params?.category,
    emotion: params?.emotion,
    region: params?.region,
    priceMin: params?.priceMin,
    priceMax: params?.priceMax,
    isActive: params?.isActive,
    isExpired: params?.isExpired,
    tags: params?.tags,
    limit: params?.limit,
    offset: params?.offset,
    sortBy: params?.sortBy,
    sortOrder: params?.sortOrder,
  });

  return fetchJson<OfferFeed[]>(`/api/offer-engine/offers${query}`);
}

export async function fetchOfferBySlug(slug: string): Promise<OfferFeed> {
  return fetchJson<OfferFeed>(`/api/offer-engine/offers/${encodeURIComponent(slug)}`);
}

export interface QuizQueryParams {
  category?: string;
  type?: string;
  difficulty?: string;
}

export async function fetchQuizzes(params?: QuizQueryParams): Promise<EducationQuiz[]> {
  const query = buildQueryString({
    category: params?.category,
    type: params?.type,
    difficulty: params?.difficulty,
  });

  const response = await fetchJson<ApiResponse<EducationQuiz[]>>(`/api/education/quizzes${query}`);
  return ensureSuccess(response, "Failed to fetch quizzes");
}

export async function fetchQuizBySlug(slug: string): Promise<EducationQuiz> {
  const response = await fetchJson<ApiResponse<EducationQuiz>>(
    `/api/education/quizzes/${encodeURIComponent(slug)}`,
  );

  return ensureSuccess(response, "Failed to fetch quiz");
}

export interface DecisionsQueryParams {
  decisionType?: string;
  status?: string;
  limit?: number;
  startDate?: string | Date;
  endDate?: string | Date;
}

export async function fetchDecisions(params?: DecisionsQueryParams): Promise<AutonomicDecision[]> {
  const query = buildQueryString({
    decisionType: params?.decisionType,
    status: params?.status,
    limit: params?.limit,
    startDate: params?.startDate,
    endDate: params?.endDate,
  });

  const response = await fetchJson<ApiResponse<AutonomicDecision[]>>(
    `/api/empire-brain/decisions${query}`,
  );

  return ensureSuccess(response, "Failed to fetch decisions");
}

export async function fetchDecision(decisionId: string): Promise<AutonomicDecision> {
  const response = await fetchJson<ApiResponse<AutonomicDecision>>(
    `/api/empire-brain/decisions/${encodeURIComponent(decisionId)}`,
  );

  return ensureSuccess(response, "Failed to fetch decision");
}
