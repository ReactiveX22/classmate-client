import { queryOptions } from '@tanstack/react-query';
import { aiService } from '../api/services/ai.service';

export const aiConversationsQueryOptions = (classroomId: string) =>
  queryOptions({
    queryKey: ['ai', 'conversations', classroomId],
    queryFn: () => aiService.getConversations(classroomId),
    staleTime: 30_000,
    enabled: !!classroomId,
  });

export const aiConversationQueryOptions = (id: string) =>
  queryOptions({
    queryKey: ['ai', 'conversations', id],
    queryFn: () => aiService.getConversation(id),
    enabled: !!id,
  });
