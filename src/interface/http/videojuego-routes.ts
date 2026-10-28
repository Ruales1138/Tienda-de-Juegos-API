import { Router } from "express";
import { createVideojuegoSchema, updateVideojuegoSchema } from "../../application/videojuegos/schemas.js";
import { PrismaVideojuegoRepository } from "../../infrastructure/repositories/prisma-videojuego-repository.js";
import { authenticate, requireRole } from "./auth-middleware.js";
import { HttpError, isPrismaForeignKeyError, isPrismaNotFoundError, isPrismaUniqueConstraintError } from "./errors.js";
import { authService } from "./auth-routes.js";

const videojuegos = new PrismaVideojuegoRepository();
export const videojuegoRouter = Router();

videojuegoRouter.get("/", async (request, response, next) => {
  const page = parsePositiveInteger(request.query.page, 1);
  const limit = parsePositiveInteger(request.query.limit, 10);

  if (page < 1 || limit < 1 || limit > 50) {
    next(new HttpError(400, "La paginación no es válida."));
    return;
  }

  try {
    const [data, total] = await Promise.all([
      videojuegos.list({ skip: (page - 1) * limit, take: limit }),
      videojuegos.count(),
    ]);
    response.json({
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
      data,
    });
  } catch (error) {
    next(error);
  }
});

videojuegoRouter.get("/:id", async (request, response, next) => {
  const id = getParam(request.params.id);
  if (!id || !isUuid(id)) {
    next(new HttpError(400, "El id del videojuego no es válido."));
    return;
  }

  try {
    const videojuego = await videojuegos.findById(id);
    if (!videojuego) {
      next(new HttpError(404, "El videojuego no existe."));
      return;
    }
    response.json({ data: videojuego });
  } catch (error) {
    next(error);
  }
});

videojuegoRouter.post("/", authenticate(authService), requireRole("ADMIN"), async (request, response, next) => {
  const parsed = createVideojuegoSchema.safeParse(request.body);
  if (!parsed.success) {
    next(new HttpError(400, "Los datos del videojuego no son válidos."));
    return;
  }
  try {
    response.status(201).json({ data: await videojuegos.create(parsed.data) });
  } catch (error) {
    next(mapVideojuegoError(error));
  }
});

videojuegoRouter.put("/:id", authenticate(authService), requireRole("ADMIN"), async (request, response, next) => {
  const id = getParam(request.params.id);
  if (!id || !isUuid(id)) {
    next(new HttpError(400, "El id del videojuego no es válido."));
    return;
  }
  const parsed = updateVideojuegoSchema.safeParse(request.body);
  if (!parsed.success) {
    next(new HttpError(400, "Los datos del videojuego no son válidos."));
    return;
  }
  try {
    response.json({ data: await videojuegos.update(id, parsed.data) });
  } catch (error) {
    next(mapVideojuegoError(error));
  }
});

videojuegoRouter.delete("/:id", authenticate(authService), requireRole("ADMIN"), async (request, response, next) => {
  const id = getParam(request.params.id);
  if (!id || !isUuid(id)) {
    next(new HttpError(400, "El id del videojuego no es válido."));
    return;
  }
  try {
    await videojuegos.delete(id);
    response.status(204).send();
  } catch (error) {
    next(mapVideojuegoError(error));
  }
});

function parsePositiveInteger(value: unknown, fallback: number): number {
  if (value === undefined) return fallback;
  const parsed = Number(value);
  return Number.isInteger(parsed) ? parsed : 0;
}

function isUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

function getParam(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function mapVideojuegoError(error: unknown): HttpError | unknown {
  if (isPrismaUniqueConstraintError(error)) return new HttpError(409, "Ya existe un videojuego con ese nombre.");
  if (isPrismaNotFoundError(error)) return new HttpError(404, "El videojuego no existe.");
  if (isPrismaForeignKeyError(error)) return new HttpError(409, "No se puede eliminar un videojuego con solicitudes.");
  return error;
}
