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
  list(input: { skip: number; take: number }): Promise<Videojuego[]>;
  count(): Promise<number>;
  findById(id: string): Promise<Videojuego | null>;
  create(input: VideojuegoInput): Promise<Videojuego>;
  update(id: string, input: Partial<VideojuegoInput>): Promise<Videojuego>;
  delete(id: string): Promise<void>;
}

export interface VideojuegoInput {
  name: string;
  category: string;
  categoryName: string;
  description: string;
  platforms: string;
  price: number;
  imageUrl: string;
  imageAlt: string;
}
