import type { UserRole } from "@prisma/client";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface AuthUserRepository {
  findByEmail(email: string): Promise<AuthUserRecord | null>;
  create(input: {
    name: string;
    email: string;
    passwordHash: string;
  }): Promise<AuthUser>;
}

export interface AuthUserRecord extends AuthUser {
  passwordHash: string;
}
