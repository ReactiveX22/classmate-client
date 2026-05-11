import { queryOptions } from '@tanstack/react-query';
import { aiService } from '../api/services/ai.service';

export const aiConversationsQueryOptions = () =>
  queryOptions({
    queryKey: ['ai', 'conversations'],
    queryFn: () => aiService.getConversations(),
    staleTime: 30_000,
  });

export const aiConversationQueryOptions = (id: string) =>
  queryOptions({
    queryKey: ['ai', 'conversations', id],
    queryFn: () => aiService.getConversation(id),
    enabled: !!id,
  });
