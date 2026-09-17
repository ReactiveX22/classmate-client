import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { TagBadge } from "@/components/notices/tag-badge";

describe("TagBadge", () => {
  it("renders the tag text", () => {
    render(<TagBadge tag="urgent" />);
    expect(screen.getByText("urgent")).toBeInTheDocument();
  });

  it("renders with capitalization", () => {
    render(<TagBadge tag="announcement" />);
    const badge = screen.getByText("announcement");
    expect(badge).toHaveClass("capitalize");
  });

  it("applies custom className", () => {
    render(<TagBadge tag="test" className="custom-class" />);
    const badge = screen.getByText("test");
    expect(badge.className).toContain("custom-class");
  });

  it("renders secondary variant badge", () => {
    render(<TagBadge tag="important" />);
    const badge = screen.getByText("important");
    expect(badge).toBeInTheDocument();
  });

  it("renders default color for unknown tags", () => {
    render(<TagBadge tag="custom-tag" />);
    expect(screen.getByText("custom-tag")).toBeInTheDocument();
  });
});
