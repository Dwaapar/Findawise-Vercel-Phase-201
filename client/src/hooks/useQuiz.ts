import { useQuery, type UseQueryOptions, type UseQueryResult } from "@tanstack/react-query";
import { fetchQuizBySlug, type EducationQuiz } from "@/lib/api";

const quizQueryKey = (slug: string | null | undefined) =>
  ["/api/education/quizzes", slug ?? null] as const;

type QuizQueryKey = ReturnType<typeof quizQueryKey>;

type UseQuizOptions<TData> = Omit<
  UseQueryOptions<EducationQuiz, Error, TData, QuizQueryKey>,
  "queryKey" | "queryFn"
>;

export function useQuiz<TData = EducationQuiz>(
  slug: string | null | undefined,
  options?: UseQuizOptions<TData>,
): UseQueryResult<TData, Error> {
  const { enabled, ...rest } = options ?? {};

  return useQuery({
    queryKey: quizQueryKey(slug),
    queryFn: () => {
      if (!slug) {
        return Promise.reject(new Error("Quiz slug is required to fetch quiz data."));
      }

      return fetchQuizBySlug(slug);
    },
    enabled: Boolean(slug) && (enabled ?? true),
    ...rest,
  });
}

export { quizQueryKey };
