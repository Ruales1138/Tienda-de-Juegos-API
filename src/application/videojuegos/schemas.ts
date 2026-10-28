import { z } from "zod";

const videojuegoFields = {
  name: z.string().trim().min(2).max(120),
  category: z.string().trim().min(2).max(40),
  categoryName: z.string().trim().min(2).max(40),
  description: z.string().trim().min(10).max(500),
  platforms: z.string().trim().min(2).max(120),
  price: z.coerce.number().int().positive(),
  imageUrl: z.string().url().max(500),
  imageAlt: z.string().trim().min(2).max(200),
};

export const createVideojuegoSchema = z.object(videojuegoFields);
export const updateVideojuegoSchema = createVideojuegoSchema.partial().refine(
  (value) => Object.keys(value).length > 0,
  { message: "Debe enviarse al menos un campo para actualizar." },
);
