import type {
  Videojuego,
  VideojuegoRepository,
} from "../../domain/videojuegos/videojuego.js";

export class ListarVideojuegos {
  constructor(private readonly repository: VideojuegoRepository) {}

  execute(input: { skip: number; take: number }): Promise<Videojuego[]> {
    return this.repository.list(input);
  }
}
