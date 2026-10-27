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
}
