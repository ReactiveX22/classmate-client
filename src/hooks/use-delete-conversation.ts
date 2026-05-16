import { useRouter } from "next/navigation";
import { handleApiError } from "@/lib/api";
import { aiService } from "@/lib/api/services/ai.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useDeleteConversation = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => aiService.deleteConversation(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({
        queryKey: ["ai", "conversations"],
        exact: true,
      });

      queryClient.removeQueries({
        queryKey: ["ai", "conversations", id],
      });

      queryClient.setQueryData(
        ["ai", "conversations"],
        (currentData: { conversations: { id: string }[] } | undefined) => {
          if (!currentData) return currentData;
          return {
            conversations: currentData.conversations.filter(
              (c) => c.id !== id,
            ),
          };
        },
      );

      router.push("/dashboard/ai");

      toast.success("Conversation deleted successfully!");
    },
    onError: (error) => {
      const errorMessage = handleApiError(error);
      toast.error(`Failed to delete conversation: ${errorMessage}`);
    },
  });
};
