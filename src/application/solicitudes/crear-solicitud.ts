import type {
  Solicitud,
  SolicitudRepository,
} from "../../domain/solicitudes/solicitud.js";

export class CrearSolicitud {
  constructor(private readonly repository: SolicitudRepository) {}

  execute(input: {
    message: string;
    userId: string;
    videojuegoId: string;
  }): Promise<Solicitud> {
    return this.repository.create(input);
  }
}
