import { describe, expect, it } from "vitest";

import { sanitizeUserHtml, toPlainText } from "@/lib/sanitize";

describe("sanitizeUserHtml", () => {
  it("passes safe plain text through unchanged", () => {
    expect(sanitizeUserHtml("Hello world")).toBe("Hello world");
  });

  it("removes script tags", () => {
    const result = sanitizeUserHtml('<script>alert("xss")</script>Hello');
    expect(result).not.toContain("<script>");
    expect(result).not.toContain("alert");
  });

  it("removes on* event handlers", () => {
    const result = sanitizeUserHtml('<img src="x" onerror="alert(1)">');
    expect(result).not.toContain("onerror");
    expect(result).not.toContain("alert");
  });

  it("removes iframe tags", () => {
    const result = sanitizeUserHtml('<iframe src="evil.com"></iframe>');
    expect(result).not.toContain("iframe");
  });

  it("allows safe bold tags", () => {
    const result = sanitizeUserHtml("<b>bold</b>");
    expect(result).toContain("bold");
  });

  it("returns empty string for empty input", () => {
    expect(sanitizeUserHtml("")).toBe("");
  });
});

describe("toPlainText", () => {
  it("strips HTML tags", () => {
    expect(toPlainText("<p>Hello <b>world</b></p>")).toBe("Hello world");
  });

  it("collapses multiple spaces", () => {
    expect(toPlainText("foo   bar   baz")).toBe("foo bar baz");
  });

  it("trims leading and trailing whitespace", () => {
    expect(toPlainText("  hello  ")).toBe("hello");
  });

  it("truncates to 500 characters", () => {
    const result = toPlainText("a".repeat(600));
    expect(result.length).toBe(500);
  });

  it("returns empty string for empty input", () => {
    expect(toPlainText("")).toBe("");
  });

  it("strips script injections to safe text", () => {
    const result = toPlainText('<script>alert("xss")</script>Safe');
    expect(result).not.toContain("script");
    expect(result).not.toContain("alert");
  });
});
