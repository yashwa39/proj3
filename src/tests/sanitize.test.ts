import { describe, expect, it } from "vitest";

import { toPlainText } from "@/lib/sanitize";

describe("sanitize", () => {
  it("toPlainText strips tags and collapses whitespace", () => {
    const out = toPlainText("  <b>Hello</b>\n\n<script>alert(1)</script> world  ");
    expect(out).toContain("Hello");
    // DOMPurify removes scripts entirely (including contents).
    expect(out).not.toContain("alert(1)");
    expect(out).toContain("world");
    expect(out.includes("<b>")).toBe(false);
    expect(out.includes("<script>")).toBe(false);
  });
});
