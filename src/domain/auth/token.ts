import type { UserRole } from "@prisma/client";

export interface AuthTokenPayload {
  id: string;
  role: UserRole;
}
