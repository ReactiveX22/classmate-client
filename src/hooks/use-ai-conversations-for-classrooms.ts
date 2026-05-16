import { useAiConversations } from "./use-ai-conversations";

export function useAiConversationsForClassrooms(classroomIds: string[]) {
  const { data, isLoading, isError } = useAiConversations();

  const conversations = (data?.conversations ?? []).filter(
    (conv) => !conv.classroomId || classroomIds.includes(conv.classroomId),
  );

  return {
    conversations,
    isLoading,
    isError,
  };
}
