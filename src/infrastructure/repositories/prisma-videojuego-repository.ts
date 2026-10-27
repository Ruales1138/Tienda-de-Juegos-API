import type { Videojuego, VideojuegoRepository } from "../../domain/videojuegos/videojuego.js";
import { prisma } from "../database/prisma.js";

export class PrismaVideojuegoRepository implements VideojuegoRepository {
  async list(): Promise<Videojuego[]> {
    return prisma.videojuego.findMany({
      orderBy: { createdAt: "asc" },
      select: {
        id: true,
        name: true,
        category: true,
        categoryName: true,
        description: true,
        platforms: true,
        price: true,
        imageUrl: true,
        imageAlt: true,
      },
    });
  }

  async findById(id: string): Promise<Videojuego | null> {
    return prisma.videojuego.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        category: true,
        categoryName: true,
        description: true,
        platforms: true,
        price: true,
        imageUrl: true,
        imageAlt: true,
      },
    });
  }
}
