import { z } from "zod";

const loginResultSchema = z.object({
  ok: z.boolean(),
  user: z.object({ email: z.string().email() }),
});

export async function login(email: string, password: string) {
  // Mocked service boundary for now; replace with real API call.
  await new Promise((r) => setTimeout(r, 200));
  return loginResultSchema.parse({ ok: true, user: { email } });
}

export async function logout() {
  await new Promise((r) => setTimeout(r, 100));
  return { ok: true } as const;
}
