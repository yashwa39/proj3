import DOMPurify from "dompurify";

/**
 * When rendering user-generated HTML, sanitize it first.
 * For this app we store/display plain text, but keeping this utility
 * prevents accidental unsafe HTML rendering if requirements expand.
 */
export function sanitizeUserHtml(unsafeHtml: string) {
  return DOMPurify.sanitize(unsafeHtml, { USE_PROFILES: { html: true } });
}

export function toPlainText(input: string) {
  // Ensure even accidental HTML is handled safely and consistently.
  const sanitized = sanitizeUserHtml(input);
  return sanitized
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 500);
}
