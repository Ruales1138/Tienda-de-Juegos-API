export interface Videojuego {
  id: string;
  name: string;
  category: string;
  categoryName: string;
  description: string;
  platforms: string;
  price: number;
  imageUrl: string;
  imageAlt: string;
}

export interface VideojuegoRepository {
  list(): Promise<Videojuego[]>;
  findById(id: string): Promise<Videojuego | null>;
}
