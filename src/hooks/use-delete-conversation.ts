import { handleApiError } from "@/lib/api";
import { aiService } from "@/lib/api/services/ai.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useDeleteConversation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => aiService.deleteConversation(id),
    onSuccess: (_, id) => {
      // Invalidate ONLY the AI conversations list to refresh it
      queryClient.invalidateQueries({
        queryKey: ["ai", "conversations"],
        exact: true,
      });

      // Remove the specific conversation from the cache so it's not refetched (avoids 404)
      queryClient.removeQueries({
        queryKey: ["ai", "conversations", id],
      });

      toast.success("Conversation deleted successfully!");
    },
    onError: (error) => {
      const errorMessage = handleApiError(error);
      toast.error(`Failed to delete conversation: ${errorMessage}`);
    },
  });
};
