import type { ID } from "./utils";

export interface User {
  id: ID;
  handle: string;
  name?: string;
  email?: string;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}
