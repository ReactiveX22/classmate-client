import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { AiMessageList } from "@/components/ai/ai-message-list";
import type { AiMessage } from "@/lib/api/services/ai.service";

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock("@/lib/utils", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/utils")>();
  return {
    ...actual,
    copyToClipboard: vi.fn(),
  };
});

describe("AiMessageList", () => {
  const defaultProps = {
    messages: [] as AiMessage[],
    streamingContent: "",
    streamingReasoning: "",
    isStreaming: false,
    error: null,
    onRetry: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows empty state when no messages and not streaming", () => {
    render(<AiMessageList {...defaultProps} />);

    expect(
      screen.getByText(
        /ask a question about this classroom to start an ai conversation/i,
      ),
    ).toBeInTheDocument();
  });

  it("renders user messages", () => {
    const messages: AiMessage[] = [
      {
        id: "msg1",
        role: "user",
        content: "What is the homework for today?",
        createdAt: new Date().toISOString(),
      },
    ];

    render(<AiMessageList {...defaultProps} messages={messages} />);

    expect(
      screen.getByText("What is the homework for today?"),
    ).toBeInTheDocument();
  });

  it("renders assistant messages", () => {
    const messages: AiMessage[] = [
      {
        id: "msg1",
        role: "assistant",
        content: "The homework is to complete Chapter 5 exercises.",
        createdAt: new Date().toISOString(),
      },
    ];

    render(<AiMessageList {...defaultProps} messages={messages} />);

    expect(
      screen.getByText("The homework is to complete Chapter 5 exercises."),
    ).toBeInTheDocument();
  });

  it("renders multiple messages in order", () => {
    const messages: AiMessage[] = [
      {
        id: "msg1",
        role: "user",
        content: "Hello",
        createdAt: new Date().toISOString(),
      },
      {
        id: "msg2",
        role: "assistant",
        content: "Hi there!",
        createdAt: new Date().toISOString(),
      },
    ];

    render(<AiMessageList {...defaultProps} messages={messages} />);

    const allText = screen.getAllByText(/(Hello|Hi there!)/);
    expect(allText).toHaveLength(2);
  });

  it("does not show empty state when streaming with no messages", () => {
    render(<AiMessageList {...defaultProps} isStreaming={true} />);

    expect(
      screen.queryByText(
        /ask a question about this classroom to start an ai conversation/i,
      ),
    ).not.toBeInTheDocument();
  });

  it("shows error banner when error is provided with messages", () => {
    const onRetry = vi.fn();
    const messages: AiMessage[] = [
      {
        id: "msg1",
        role: "user",
        content: "Hello",
        createdAt: new Date().toISOString(),
      },
    ];

    render(
      <AiMessageList
        {...defaultProps}
        messages={messages}
        error={{ message: "Something went wrong" }}
        onRetry={onRetry}
      />,
    );

    expect(screen.getByText("AI response failed")).toBeInTheDocument();
    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
  });

  it("renders copy buttons for messages", () => {
    const messages: AiMessage[] = [
      {
        id: "msg1",
        role: "assistant",
        content: "Test response",
        createdAt: new Date().toISOString(),
      },
    ];

    render(<AiMessageList {...defaultProps} messages={messages} />);

    const copyButtons = screen.getAllByLabelText("Copy message");
    expect(copyButtons.length).toBeGreaterThan(0);
  });
});
