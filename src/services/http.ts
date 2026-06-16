import { z } from "zod";

export class HttpError extends Error {
  public readonly status: number;
  public readonly code: string;
  public readonly requestId?: string;

  constructor(opts: {
    status: number;
    code: string;
    message: string;
    requestId?: string;
  }) {
    super(opts.message);
    this.status = opts.status;
    this.code = opts.code;
    this.requestId = opts.requestId;
  }
}

type RequestInterceptor = (init: RequestInit) => RequestInit | Promise<RequestInit>;
type ResponseInterceptor = (res: Response) => Response | Promise<Response>;

const requestInterceptors: RequestInterceptor[] = [];
const responseInterceptors: ResponseInterceptor[] = [];

export function addRequestInterceptor(fn: RequestInterceptor) {
  requestInterceptors.push(fn);
}

export function addResponseInterceptor(fn: ResponseInterceptor) {
  responseInterceptors.push(fn);
}

async function applyRequestInterceptors(init: RequestInit) {
  let next = init;
  for (const fn of requestInterceptors) next = await fn(next);
  return next;
}

async function applyResponseInterceptors(res: Response) {
  let next = res;
  for (const fn of responseInterceptors) next = await fn(next);
  return next;
}

export async function httpJson<TSchema extends z.ZodTypeAny>(opts: {
  url: string;
  init?: RequestInit;
  schema: TSchema;
  retries?: number;
}): Promise<z.infer<TSchema>> {
  const retries = opts.retries ?? 0;

  const baseInit: RequestInit = {
    ...opts.init,
    headers: {
      Accept: "application/json",
      ...(opts.init?.headers ?? {}),
    },
  };

  const init = await applyRequestInterceptors(baseInit);

  let lastError: unknown;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res0 = await fetch(opts.url, init);
      const res = await applyResponseInterceptors(res0);

      const requestId = res.headers.get("x-request-id") ?? undefined;
      if (!res.ok) {
        throw new HttpError({
          status: res.status,
          code: "HTTP_ERROR",
          message: `Request failed with status ${res.status}`,
          requestId,
        });
      }

      const json = (await res.json()) as unknown;
      const parsed = opts.schema.safeParse(json);
      if (!parsed.success) {
        throw new HttpError({
          status: 500,
          code: "INVALID_RESPONSE",
          message: "Server returned an invalid response.",
          requestId,
        });
      }
      return parsed.data;
    } catch (err) {
      lastError = err;
      if (attempt < retries) continue;
      throw lastError;
    }
  }

  // Unreachable, but TS doesn't know.
  throw lastError;
}
