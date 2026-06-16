import { z } from "zod";

import { httpJson } from "@/services/http";

export async function getJson<TSchema extends z.ZodTypeAny>(
  url: string,
  schema: TSchema,
) {
  return httpJson({ url, schema, retries: 1 });
}
