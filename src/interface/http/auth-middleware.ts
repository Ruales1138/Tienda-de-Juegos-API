import type { NextFunction, Request, Response } from "express";
import type { AuthService } from "../../application/auth/auth-service.js";
import { HttpError } from "./errors.js";

export function authenticate(authService: AuthService) {
  return (request: Request, _response: Response, next: NextFunction) => {
    const authorization = request.header("Authorization");
    const [scheme, token] = authorization?.split(" ") ?? [];

    if (scheme !== "Bearer" || !token) {
      next(new HttpError(401, "Se requiere un token de autenticación."));
      return;
    }

    try {
      request.user = authService.verifyToken(token);
      next();
    } catch {
      next(new HttpError(401, "El token no es válido o ha expirado."));
    }
  };
}

export function requireRole(role: "ADMIN" | "USER") {
  return (request: Request, _response: Response, next: NextFunction) => {
    if (!request.user) {
      next(new HttpError(401, "Se requiere un token de autenticación."));
      return;
    }

    if (request.user.role !== role) {
      next(new HttpError(403, "No tienes permisos para realizar esta acción."));
      return;
    }

    next();
  };
}
