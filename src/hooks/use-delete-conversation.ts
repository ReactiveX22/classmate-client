import { useMutation, useQueryClient } from '@tanstack/react-query';
import { aiService } from '@/lib/api/services/ai.service';
import { toast } from 'sonner';
import { handleApiError } from '@/lib/api';

export const useDeleteConversation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => aiService.deleteConversation(id),
    onSuccess: () => {
      // Invalidate AI conversations to refresh the list
      queryClient.invalidateQueries({
        queryKey: ['ai', 'conversations'],
        refetchType: 'all',
      });

      toast.success('Conversation deleted successfully!');
    },
    onError: (error) => {
      const errorMessage = handleApiError(error);
      toast.error(`Failed to delete conversation: ${errorMessage}`);
    },
  });
};
