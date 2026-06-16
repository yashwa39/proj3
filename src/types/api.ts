import type { ID } from "./utils";

export interface APIResponse<T> {
  ok: boolean;
  data?: T;
  error?: ErrorResponse;
  requestId?: string;
}

export interface ErrorResponse {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

export interface FormData {
  whatIfQuery?: string;
  ecoHackDescription?: string;
  ecoHackCategory?: "Transport" | "Energy" | "Diet" | "Shopping" | "Other";
  ecoHackSavingsKg?: number;
}

export interface AuthSession {
  userId: ID;
  token: string;
  expiresAt: string;
}
