import { useQuery } from "@tanstack/react-query";
import { aiConversationsQueryOptions } from "@/lib/queryOptions/aiQueryOptions";

export const useAiConversations = () => useQuery(aiConversationsQueryOptions());
