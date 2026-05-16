import { useMutation, useQueryClient } from '@tanstack/react-query';
import { aiService } from '@/lib/api/services/ai.service';
import { toast } from 'sonner';
import { handleApiError } from '@/lib/api';

export const useRenameConversation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, title }: { id: string; title: string }) =>
      aiService.updateConversation(id, { title }),
    onSuccess: (data, { id, title }) => {
      queryClient.invalidateQueries({
        queryKey: ['ai', 'conversations'],
      });

      queryClient.setQueryData(
        ['ai', 'conversations'],
        (currentData: { conversations: { id: string; title: string }[] } | undefined) => {
          if (!currentData) return currentData;
          return {
            conversations: currentData.conversations.map((c) =>
              c.id === id ? { ...c, title } : c,
            ),
          };
        },
      );

      toast.success('Conversation renamed successfully!');
    },
    onError: (error) => {
      const errorMessage = handleApiError(error);
      toast.error(`Failed to rename conversation: ${errorMessage}`);
    },
  });
};
