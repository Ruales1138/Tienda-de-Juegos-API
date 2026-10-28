import { z } from "zod";

export const solicitudParamsSchema = z.object({
  id: z.string().uuid(),
});

export const createSolicitudSchema = z.object({
  message: z.string().trim().min(10).max(1000),
  videojuegoId: z.string().uuid(),
});

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
});
