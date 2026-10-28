import { Router } from "express";
import { AuthService } from "../../application/auth/auth-service.js";
import {
  loginSchema,
  registerSchema,
} from "../../application/auth/schemas.js";
import { PrismaUserRepository } from "../../infrastructure/repositories/prisma-user-repository.js";
import { authenticate } from "./auth-middleware.js";
import { HttpError, isPrismaUniqueConstraintError } from "./errors.js";

const users = new PrismaUserRepository();
const authService = new AuthService(users);

export const authRouter = Router();

authRouter.post("/register", async (request, response, next) => {
  const parsed = registerSchema.safeParse(request.body);

  if (!parsed.success) {
    next(new HttpError(400, "Los datos de registro no son válidos."));
    return;
  }

  try {
    const user = await authService.register(parsed.data);
    response.status(201).json({ user });
  } catch (error) {
    if (isPrismaUniqueConstraintError(error)) {
      next(new HttpError(409, "Ya existe una cuenta con ese correo."));
      return;
    }
    next(error);
  }
});

authRouter.post("/login", async (request, response, next) => {
  const parsed = loginSchema.safeParse(request.body);

  if (!parsed.success) {
    next(new HttpError(400, "Los datos de inicio de sesión no son válidos."));
    return;
  }

  try {
    const result = await authService.login(parsed.data);
    response.json(result);
  } catch (error) {
    if (error instanceof Error && error.name === "InvalidCredentialsError") {
      next(new HttpError(401, "Correo o contraseña inválidos."));
      return;
    }
    next(error);
  }
});

authRouter.get("/me", authenticate(authService), (request, response) => {
  response.json({ user: request.user });
});

export { authService };
