import apiClient from '../index';

export interface AiConversation {
  id: string;
  title: string | null;
  classroomId: string | null;
  updatedAt: string;
  createdAt: string;
}

export interface AiMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
}

export type AiStreamEventType =
  | { type: 'conversation'; payload: AiConversation }
  | { type: 'user_message'; payload: AiMessage }
  | { type: 'content'; payload: { delta: string } }
  | { type: 'tool'; payload: { name: string; status: 'start' | 'end' } }
  | { type: 'final'; payload: AiMessage }
  | { type: 'error'; payload: { message: string } };

export interface AiConversationsResponse {
  conversations: AiConversation[];
}

export interface AiConversationResponse {
  conversation: AiConversation;
  messages: AiMessage[];
}

export interface StreamChatInput {
  message: string;
  conversationId?: string;
}

export const aiService = {
  async getConversations(): Promise<AiConversationsResponse> {
    const response = await apiClient.get<AiConversationsResponse>(
      '/api/v1/ai/conversations',
    );

    return response.data;
  },

  async getConversation(id: string): Promise<AiConversationResponse> {
    const response = await apiClient.get<AiConversationResponse>(
      `/api/v1/ai/conversations/${id}`,
    );

    return response.data;
  },

  async deleteConversation(id: string): Promise<void> {
    await apiClient.delete(`/api/v1/ai/conversations/${id}`);
  },
};

export async function* streamChat(
  input: StreamChatInput,
  signal?: AbortSignal,
): AsyncGenerator<AiStreamEventType> {
  const response = await fetch('/api/v1/ai/chat/stream', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(input),
    signal,
  });

  if (!response.ok || !response.body) {
    throw new Error(`Stream failed: ${response.status}`);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();

    if (done) {
      break;
    }

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() ?? '';

    for (const line of lines) {
      if (!line.startsWith('data:')) {
        continue;
      }

      const raw = line.slice(5).trim();

      if (!raw || raw === '[DONE]') {
        continue;
      }

      try {
        yield JSON.parse(raw) as AiStreamEventType;
      } catch {
        // Ignore malformed SSE payloads and keep consuming the stream.
      }
    }
  }
}
