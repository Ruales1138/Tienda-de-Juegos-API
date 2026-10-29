import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, UserRole } from "@prisma/client";
import bcrypt from "bcrypt";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});
const prisma = new PrismaClient({ adapter });

const juegos = [
  {
    name: "Horizonte Perdido",
    category: "aventura",
    categoryName: "Aventura",
    description:
      "Una expedición por ruinas antiguas donde cada decisión cambia el camino.",
    platforms: "PC, PlayStation 5",
    price: 149900,
    imageUrl:
      "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=900&q=80",
    imageAlt: "Control retro sobre una consola de videojuegos",
  },
  {
    name: "Neon Circuit",
    category: "accion",
    categoryName: "Acción",
    description:
      "Compite a toda velocidad en una ciudad futurista llena de desafíos.",
    platforms: "PC, Xbox Series",
    price: 119900,
    imageUrl:
      "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=900&q=80",
    imageAlt: "Persona jugando videojuegos frente a una pantalla",
  },
  {
    name: "Reinos de Ceniza",
    category: "rol",
    categoryName: "Rol",
    description:
      "Forma tu equipo, explora un reino en guerra y decide su futuro.",
    platforms: "PC, Nintendo Switch",
    price: 169900,
    imageUrl:
      "https://images.unsplash.com/photo-1593305841991-05c297ba4575?auto=format&fit=crop&w=900&q=80",
    imageAlt: "Escritorio con monitor y accesorios para videojuegos",
  },
];

async function main() {
  const adminPassword = await bcrypt.hash("PixelForgeAdmin2026!", 12);
  const userPassword = await bcrypt.hash("PixelForgeUser2026!", 12);

  await prisma.user.upsert({
    where: { email: "admin@pixelforge.test" },
    update: { name: "Admin Pixel Forge", passwordHash: adminPassword, role: UserRole.ADMIN },
    create: {
      name: "Admin Pixel Forge",
      email: "admin@pixelforge.test",
      passwordHash: adminPassword,
      role: UserRole.ADMIN,
    },
  });

  await prisma.user.upsert({
    where: { email: "usuario@pixelforge.test" },
    update: { name: "Usuario Pixel Forge", passwordHash: userPassword, role: UserRole.USER },
    create: {
      name: "Usuario Pixel Forge",
      email: "usuario@pixelforge.test",
      passwordHash: userPassword,
      role: UserRole.USER,
    },
  });

  for (const juego of juegos) {
    await prisma.videojuego.upsert({
      where: { name: juego.name },
      update: juego,
      create: juego,
    });
  }
}

main()
  .then(async () => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exitCode = 1;
  });
