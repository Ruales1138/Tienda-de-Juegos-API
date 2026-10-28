import type {
  AuthUser,
  AuthUserRecord,
  AuthUserRepository,
} from "../../domain/auth/user.js";
import { prisma } from "../database/prisma.js";

const userFields = {
  id: true,
  name: true,
  email: true,
  passwordHash: true,
  role: true,
} as const;

export class PrismaUserRepository implements AuthUserRepository {
  async findByEmail(email: string): Promise<AuthUserRecord | null> {
    return prisma.user.findUnique({
      where: { email },
      select: userFields,
    });
  }

  async create(input: {
    name: string;
    email: string;
    passwordHash: string;
  }): Promise<AuthUser> {
    return prisma.user.create({
      data: input,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });
  }
}
