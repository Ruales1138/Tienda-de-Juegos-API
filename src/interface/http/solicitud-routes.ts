import { Router } from "express";
import { createSolicitudSchema } from "../../application/solicitudes/schemas.js";
import { PrismaSolicitudRepository } from "../../infrastructure/repositories/prisma-solicitud-repository.js";
import { authenticate, requireRole } from "./auth-middleware.js";
import { authService } from "./auth-routes.js";
import { HttpError, isPrismaForeignKeyError } from "./errors.js";

const solicitudes = new PrismaSolicitudRepository();
export const solicitudRouter = Router();

solicitudRouter.post("/", authenticate(authService), async (request, response, next) => {
  const parsed = createSolicitudSchema.safeParse(request.body);
  if (!parsed.success) {
    next(new HttpError(400, "Los datos de la solicitud no son válidos."));
    return;
  }

  try {
    const userId = request.user?.id;
    if (!userId) {
      next(new HttpError(401, "Se requiere un token de autenticación."));
      return;
    }
    const data = await solicitudes.create({ ...parsed.data, userId });
    response.status(201).json({ data });
  } catch (error) {
    if (isPrismaForeignKeyError(error)) {
      next(new HttpError(404, "El videojuego no existe."));
      return;
    }
    next(error);
  }
});

solicitudRouter.get("/mias", authenticate(authService), async (request, response, next) => {
  try {
    const userId = request.user?.id;
    if (!userId) {
      next(new HttpError(401, "Se requiere un token de autenticación."));
      return;
    }
    response.json({ data: await solicitudes.listByUser(userId) });
  } catch (error) {
    next(error);
  }
});

solicitudRouter.get("/", authenticate(authService), requireRole("ADMIN"), async (_request, response, next) => {
  try {
    response.json({ data: await solicitudes.listAll() });
  } catch (error) {
    next(error);
  }
});
