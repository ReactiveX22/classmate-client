import { useMutation, useQueryClient } from '@tanstack/react-query';
import { aiService } from '@/lib/api/services/ai.service';
import { toast } from 'sonner';
import { handleApiError } from '@/lib/api';

export const useRenameConversation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, title }: { id: string; title: string }) =>
      aiService.updateConversation(id, { title }),
    onSuccess: () => {
      // Invalidate AI conversations to refresh the list
      queryClient.invalidateQueries({
        queryKey: ['ai', 'conversations'],
      });

      toast.success('Conversation renamed successfully!');
    },
    onError: (error) => {
      const errorMessage = handleApiError(error);
      toast.error(`Failed to rename conversation: ${errorMessage}`);
    },
  });
};
