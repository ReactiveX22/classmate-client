import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { AiErrorBanner } from "@/components/ai/ai-error-banner";

describe("AiErrorBanner", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the default error message", () => {
    const onRetry = vi.fn();
    render(<AiErrorBanner onRetry={onRetry} />);

    expect(screen.getByText("AI response failed")).toBeInTheDocument();
    expect(
      screen.getByText(
        "The AI was unable to generate a response. You can retry to try again.",
      ),
    ).toBeInTheDocument();
  });

  it("renders a custom error message", () => {
    const onRetry = vi.fn();
    render(<AiErrorBanner message="Rate limit exceeded" onRetry={onRetry} />);

    expect(screen.getByText("Rate limit exceeded")).toBeInTheDocument();
  });

  it("calls onRetry when retry button is clicked", () => {
    const onRetry = vi.fn();
    render(<AiErrorBanner onRetry={onRetry} />);

    const retryButton = screen.getByRole("button", { name: /retry/i });
    fireEvent.click(retryButton);

    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it("renders the retry button with refresh icon", () => {
    const onRetry = vi.fn();
    render(<AiErrorBanner onRetry={onRetry} />);

    expect(screen.getByRole("button", { name: /retry/i })).toBeInTheDocument();
  });
});
