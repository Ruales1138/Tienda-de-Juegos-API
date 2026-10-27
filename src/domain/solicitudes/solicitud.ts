export interface Solicitud {
  id: string;
  message: string;
  userId: string;
  videojuegoId: string;
  createdAt: Date;
}

export interface SolicitudRepository {
  create(input: {
    message: string;
    userId: string;
    videojuegoId: string;
  }): Promise<Solicitud>;
}
