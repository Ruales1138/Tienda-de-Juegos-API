import type { ErrorRequestHandler } from "express";
import { AuthConfigurationError } from "../../application/auth/auth-service.js";
import { HttpError } from "./errors.js";

export const errorHandler: ErrorRequestHandler = (
  error,
  _request,
  response,
  _next,
) => {
  if (error instanceof HttpError) {
    response.status(error.statusCode).json({ error: error.message });
    return;
  }

  if (error instanceof AuthConfigurationError) {
    response.status(500).json({ error: "El servidor no está configurado correctamente." });
    return;
  }

  console.error(error);
  response.status(500).json({ error: "Ocurrió un error interno." });
};
