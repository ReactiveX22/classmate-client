import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { AiInputBar } from "@/components/ai/ai-input-bar";

describe("AiInputBar", () => {
  const defaultProps = {
    isStreaming: false,
    onSend: vi.fn(),
    onStop: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the input area with placeholder", () => {
    render(<AiInputBar {...defaultProps} />);

    expect(screen.getByPlaceholderText("Ask anything")).toBeInTheDocument();
  });

  it("renders the disclaimer text", () => {
    render(<AiInputBar {...defaultProps} />);

    expect(
      screen.getByText("AI-generated content may not be accurate."),
    ).toBeInTheDocument();
  });

  it("disables input when streaming", () => {
    render(<AiInputBar {...defaultProps} isStreaming={true} />);

    const textarea = screen.getByPlaceholderText("Ask anything");
    expect(textarea).toBeDisabled();
  });

  it("disables input when retrying", () => {
    render(<AiInputBar {...defaultProps} isRetrying={true} />);

    const textarea = screen.getByPlaceholderText("Ask anything");
    expect(textarea).toBeDisabled();
  });

  it("calls onStop when stop button is clicked during streaming", () => {
    const onStop = vi.fn();
    render(<AiInputBar {...defaultProps} isStreaming={true} onStop={onStop} />);

    const buttons = screen.getAllByRole("button");
    const stopButton = buttons[buttons.length - 1];
    fireEvent.click(stopButton);

    expect(onStop).toHaveBeenCalledTimes(1);
  });

  it("does not call onSend when message is empty", async () => {
    const onSend = vi.fn();
    render(<AiInputBar {...defaultProps} onSend={onSend} />);

    const textarea = screen.getByPlaceholderText("Ask anything");
    fireEvent.change(textarea, { target: { value: "  " } });

    const buttons = screen.getAllByRole("button");
    const sendButton = buttons[buttons.length - 1];
    fireEvent.click(sendButton);

    expect(onSend).not.toHaveBeenCalled();
  });
});
