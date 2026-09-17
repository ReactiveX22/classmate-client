import { describe, it, expect } from "vitest";
import { cn, formatDate, getInitials } from "@/lib/utils";

describe("cn", () => {
  it("merges class names", () => {
    const result = cn("foo", "bar");
    expect(result).toBe("foo bar");
  });

  it("deduplicates tailwind classes", () => {
    const result = cn("px-4 py-2", "px-8");
    expect(result).toBe("py-2 px-8");
  });

  it("handles conditional classes", () => {
    const result = cn("base", false && "hidden", "extra");
    expect(result).toBe("base extra");
  });

  it("handles empty input", () => {
    const result = cn();
    expect(result).toBe("");
  });
});

describe("formatDate", () => {
  it("formats a date string", () => {
    const result = formatDate("2024-01-15");
    expect(result).toBe("January 15, 2024");
  });

  it("formats a Date object", () => {
    const result = formatDate(new Date("2024-06-20"));
    expect(result).toBe("June 20, 2024");
  });

  it("returns empty string for undefined", () => {
    const result = formatDate(undefined);
    expect(result).toBe("");
  });

  it("formats with custom options", () => {
    const result = formatDate("2024-03-10", {
      month: "short",
      day: "numeric",
      year: undefined,
    });
    expect(result).toBe("Mar 10");
  });

  it("returns empty string for invalid date", () => {
    const result = formatDate("not-a-date");
    expect(result).toBe("");
  });
});

describe("getInitials", () => {
  it("returns first letters of first and last name", () => {
    expect(getInitials("John Doe")).toBe("JD");
  });

  it("returns first letter for single name", () => {
    expect(getInitials("John")).toBe("J");
  });

  it("returns uppercase initials", () => {
    expect(getInitials("mary smith")).toBe("MS");
  });

  it("returns empty string for undefined", () => {
    expect(getInitials(undefined)).toBe("");
  });

  it("returns empty string for empty string", () => {
    expect(getInitials("")).toBe("");
  });

  it("handles names with more than two parts", () => {
    expect(getInitials("John Michael Doe")).toBe("JM");
  });
});
