import bcrypt from "bcrypt";
import jwt, { type SignOptions } from "jsonwebtoken";
import { UserRole } from "@prisma/client";
import type { AuthTokenPayload } from "../../domain/auth/token.js";
import type { AuthUser, AuthUserRepository } from "../../domain/auth/user.js";
import type { LoginInput, RegisterInput } from "./schemas.js";

export class InvalidCredentialsError extends Error {
  constructor() {
    super("Correo o contraseña inválidos.");
    this.name = "InvalidCredentialsError";
  }
}

export class AuthConfigurationError extends Error {
  constructor() {
    super("La autenticación no está configurada correctamente.");
    this.name = "AuthConfigurationError";
  }
}

export class AuthService {
  constructor(
    private readonly users: AuthUserRepository,
    private readonly jwtSecret = process.env.JWT_SECRET,
    private readonly jwtExpiresIn = process.env.JWT_EXPIRES_IN ?? "1d",
  ) {}

  async register(input: RegisterInput): Promise<AuthUser> {
    const passwordHash = await bcrypt.hash(input.password, 12);
    return this.users.create({
      name: input.name,
      email: input.email,
      passwordHash,
    });
  }

  async login(input: LoginInput): Promise<{ token: string; user: AuthUser }> {
    const user = await this.users.findByEmail(input.email);
    const passwordMatches = user
      ? await bcrypt.compare(input.password, user.passwordHash)
      : false;

    if (!user || !passwordMatches) {
      throw new InvalidCredentialsError();
    }

    const payload: AuthTokenPayload = { id: user.id, role: user.role };
    const token = jwt.sign(payload, this.getSecret(), {
      expiresIn: this.jwtExpiresIn as SignOptions["expiresIn"],
    });

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }

  verifyToken(token: string): AuthTokenPayload {
    const payload = jwt.verify(token, this.getSecret());

    if (
      typeof payload !== "object" ||
      payload === null ||
      typeof payload.id !== "string" ||
      (payload.role !== UserRole.ADMIN && payload.role !== UserRole.USER)
    ) {
      throw new InvalidCredentialsError();
    }

    return { id: payload.id, role: payload.role };
  }

  private getSecret(): string {
    if (!this.jwtSecret) {
      throw new AuthConfigurationError();
    }
    return this.jwtSecret;
  }
}
