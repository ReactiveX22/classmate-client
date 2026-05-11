import { useQuery } from '@tanstack/react-query';
import { aiConversationQueryOptions } from '@/lib/queryOptions/aiQueryOptions';

export const useAiConversation = (id: string) =>
  useQuery(aiConversationQueryOptions(id));
