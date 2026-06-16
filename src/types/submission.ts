import type { ID } from "./utils";
import type { FormData } from "./api";

export interface Submission {
  id: ID;
  userId: ID;
  createdAt: string;
  updatedAt: string;
  data: FormData;
}
