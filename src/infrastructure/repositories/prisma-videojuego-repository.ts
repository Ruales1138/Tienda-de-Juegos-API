import type {
  Videojuego,
  VideojuegoInput,
  VideojuegoRepository,
} from "../../domain/videojuegos/videojuego.js";
import { prisma } from "../database/prisma.js";

export class PrismaVideojuegoRepository implements VideojuegoRepository {
  async list(input: { skip: number; take: number }): Promise<Videojuego[]> {
    return prisma.videojuego.findMany({
      skip: input.skip,
      take: input.take,
      orderBy: { createdAt: "asc" },
      select: videojuegoFields,
    });
  }

  count(): Promise<number> {
    return prisma.videojuego.count();
  }

  async findById(id: string): Promise<Videojuego | null> {
    return prisma.videojuego.findUnique({
      where: { id },
      select: videojuegoFields,
    });
  }

  create(input: VideojuegoInput): Promise<Videojuego> {
    return prisma.videojuego.create({ data: input, select: videojuegoFields });
  }

  update(id: string, input: Partial<VideojuegoInput>): Promise<Videojuego> {
    return prisma.videojuego.update({
      where: { id },
      data: input,
      select: videojuegoFields,
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.videojuego.delete({ where: { id } });
  }
}

const videojuegoFields = {
  id: true,
  name: true,
  category: true,
  categoryName: true,
  description: true,
  platforms: true,
  price: true,
  imageUrl: true,
  imageAlt: true,
} as const;
