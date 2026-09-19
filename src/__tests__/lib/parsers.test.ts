import { describe, it, expect } from "vitest";
import { getSortingStateParser, getFiltersStateParser } from "@/lib/parsers";

describe("getSortingStateParser", () => {
  const parser = getSortingStateParser();

  describe("parse", () => {
    it("parses valid sorting JSON", () => {
      const input = JSON.stringify([
        { id: "name", desc: false },
        { id: "date", desc: true },
      ]);
      expect(parser.parse(input)).toEqual([
        { id: "name", desc: false },
        { id: "date", desc: true },
      ]);
    });

    it("returns null for invalid JSON", () => {
      expect(parser.parse("not-json")).toBeNull();
    });

    it("returns null for JSON with invalid schema", () => {
      expect(parser.parse(JSON.stringify([{ id: 123 }]))).toBeNull();
    });

    it("returns null for empty array items with missing fields", () => {
      expect(parser.parse(JSON.stringify([{ id: "name" }]))).toBeNull();
    });

    it("filters out invalid keys when columnIds provided", () => {
      const strictParser = getSortingStateParser(["name", "date"]);
      const input = JSON.stringify([
        { id: "name", desc: false },
        { id: "unknown", desc: true },
      ]);
      expect(strictParser.parse(input)).toBeNull();
    });

    it("allows valid keys when columnIds provided", () => {
      const strictParser = getSortingStateParser(["name", "date"]);
      const input = JSON.stringify([{ id: "name", desc: false }]);
      expect(strictParser.parse(input)).toEqual([
        { id: "name", desc: false },
      ]);
    });

    it("accepts Set as columnIds", () => {
      const strictParser = getSortingStateParser(new Set(["name", "date"]));
      const input = JSON.stringify([{ id: "name", desc: false }]);
      expect(strictParser.parse(input)).toEqual([
        { id: "name", desc: false },
      ]);
    });
  });

  describe("serialize", () => {
    it("serializes sorting state to JSON string", () => {
      const value = [{ id: "name", desc: false }];
      expect(parser.serialize(value)).toBe(JSON.stringify(value));
    });
  });

  describe("eq", () => {
    it("returns true for equal sorting arrays", () => {
      const a = [
        { id: "name", desc: false },
        { id: "date", desc: true },
      ];
      const b = [
        { id: "name", desc: false },
        { id: "date", desc: true },
      ];
      expect(parser.eq(a, b)).toBe(true);
    });

    it("returns false for different sorting arrays", () => {
      const a = [{ id: "name", desc: false }];
      const b = [{ id: "name", desc: true }];
      expect(parser.eq(a, b)).toBe(false);
    });

    it("returns false for different lengths", () => {
      const a = [{ id: "name", desc: false }];
      const b = [
        { id: "name", desc: false },
        { id: "date", desc: true },
      ];
      expect(parser.eq(a, b)).toBe(false);
    });
  });
});

describe("getFiltersStateParser", () => {
  const parser = getFiltersStateParser();

  describe("parse", () => {
    it("parses valid filter JSON", () => {
      const input = JSON.stringify([
        {
          id: "name",
          value: "test",
          variant: "text",
          operator: "iLike",
          filterId: "name",
        },
      ]);
      expect(parser.parse(input)).toEqual([
        {
          id: "name",
          value: "test",
          variant: "text",
          operator: "iLike",
          filterId: "name",
        },
      ]);
    });

    it("parses filter with array value", () => {
      const input = JSON.stringify([
        {
          id: "status",
          value: ["active", "pending"],
          variant: "multiSelect",
          operator: "inArray",
          filterId: "status",
        },
      ]);
      expect(parser.parse(input)).toEqual([
        {
          id: "status",
          value: ["active", "pending"],
          variant: "multiSelect",
          operator: "inArray",
          filterId: "status",
        },
      ]);
    });

    it("returns null for invalid JSON", () => {
      expect(parser.parse("not-json")).toBeNull();
    });

    it("returns null for invalid variant", () => {
      const input = JSON.stringify([
        {
          id: "name",
          value: "test",
          variant: "invalidVariant",
          operator: "iLike",
          filterId: "name",
        },
      ]);
      expect(parser.parse(input)).toBeNull();
    });

    it("returns null for invalid operator", () => {
      const input = JSON.stringify([
        {
          id: "name",
          value: "test",
          variant: "text",
          operator: "invalidOp",
          filterId: "name",
        },
      ]);
      expect(parser.parse(input)).toBeNull();
    });

    it("returns null for missing required fields", () => {
      expect(
        parser.parse(JSON.stringify([{ id: "name" }])),
      ).toBeNull();
    });

    it("filters out invalid keys when columnIds provided", () => {
      const strictParser = getFiltersStateParser(["name"]);
      const input = JSON.stringify([
        {
          id: "unknown",
          value: "test",
          variant: "text",
          operator: "iLike",
          filterId: "unknown",
        },
      ]);
      expect(strictParser.parse(input)).toBeNull();
    });

    it("allows valid keys when columnIds provided", () => {
      const strictParser = getFiltersStateParser(["name"]);
      const input = JSON.stringify([
        {
          id: "name",
          value: "test",
          variant: "text",
          operator: "iLike",
          filterId: "name",
        },
      ]);
      expect(strictParser.parse(input)).toHaveLength(1);
    });
  });

  describe("serialize", () => {
    it("serializes filter state to JSON string", () => {
      const value = [
        {
          id: "name",
          value: "test",
          variant: "text",
          operator: "iLike",
          filterId: "name",
        },
      ];
      expect(parser.serialize(value)).toBe(JSON.stringify(value));
    });
  });

  describe("eq", () => {
    const filterA = {
      id: "name",
      value: "test",
      variant: "text" as const,
      operator: "iLike" as const,
      filterId: "name",
    };
    const filterB = {
      ...filterA,
      value: "other",
    };

    it("returns true for equal filter arrays", () => {
      expect(parser.eq([filterA], [filterA])).toBe(true);
    });

    it("returns false for different filter values", () => {
      expect(parser.eq([filterA], [filterB])).toBe(false);
    });

    it("returns false for different lengths", () => {
      expect(parser.eq([filterA], [filterA, filterB])).toBe(false);
    });

    it("returns true for empty arrays", () => {
      expect(parser.eq([], [])).toBe(true);
    });
  });
});
