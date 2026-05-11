import { aiConversationsQueryOptions } from '@/lib/queryOptions/aiQueryOptions';
import { useQueries } from '@tanstack/react-query';

export function useAiConversationsForClassrooms(classroomIds: string[]) {
  const results = useQueries({
    queries: classroomIds.map((classroomId) =>
      aiConversationsQueryOptions(classroomId),
    ),
  });

  const conversations = results.flatMap(
    (result) => result.data?.conversations ?? [],
  );

  return {
    conversations,
    isLoading: results.some((result) => result.isLoading),
    isError: results.some((result) => result.isError),
  };
}
