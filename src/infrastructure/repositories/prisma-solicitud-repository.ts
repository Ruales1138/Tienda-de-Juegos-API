import type {
  Solicitud,
  SolicitudRepository,
} from "../../domain/solicitudes/solicitud.js";
import { prisma } from "../database/prisma.js";

export class PrismaSolicitudRepository implements SolicitudRepository {
  async create(input: {
    message: string;
    userId: string;
    videojuegoId: string;
  }): Promise<Solicitud> {
    return prisma.solicitud.create({
      data: input,
      select: {
        id: true,
        message: true,
        userId: true,
        videojuegoId: true,
        createdAt: true,
      },
    });
  }

  listByUser(userId: string): Promise<Solicitud[]> {
    return prisma.solicitud.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      select: solicitudFields,
    });
  }

  listAll(): Promise<Solicitud[]> {
    return prisma.solicitud.findMany({
      orderBy: { createdAt: "desc" },
      select: solicitudFields,
    });
  }
}

const solicitudFields = {
  id: true,
  message: true,
  userId: true,
  videojuegoId: true,
  createdAt: true,
} as const;
