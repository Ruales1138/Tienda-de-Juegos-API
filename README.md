# Tienda de Juegos API

API REST de Pixel Forge para la siguiente entrega. El backend se construye con
Node.js, Express, TypeScript, Prisma y PostgreSQL, siguiendo una separación por
capas: `domain`, `application`, `infrastructure` e `interface`.

## Requisitos

- Node.js 20 o superior.
- PostgreSQL 16 o superior.

## Configuración local

1. Instala las dependencias:

   ```bash
   npm install
   ```

2. Copia `.env.example` como `.env` y completa sus valores.
3. Genera el cliente y aplica las migraciones:

   ```bash
   npm run prisma:generate
   npm run prisma:migrate
   npm run prisma:seed
   ```

4. Ejecuta el servidor en desarrollo:

   ```bash
   npm run dev
   ```

La API queda disponible en `http://localhost:4000`. El endpoint
`GET /health` permite comprobar que el servidor está activo.

## Variables de entorno

| Variable | Descripción |
| --- | --- |
| `DATABASE_URL` | URL de conexión a PostgreSQL |
| `JWT_SECRET` | Clave privada para firmar tokens |
| `JWT_EXPIRES_IN` | Tiempo de expiración de los tokens |
| `PORT` | Puerto local de la API |
| `FRONTEND_URL` | URL permitida para CORS |

## Datos de prueba del seed

El seed carga los tres videojuegos de Pixel Forge y dos usuarios:

| Rol | Email | Contraseña |
| --- | --- | --- |
| Admin | `admin@pixelforge.test` | `PixelForgeAdmin2026!` |
| Usuario | `usuario@pixelforge.test` | `PixelForgeUser2026!` |

## Autenticación

La API expone:

- `POST /api/auth/register` para crear una cuenta.
- `POST /api/auth/login` para recibir un JWT.
- `GET /api/auth/me` como ejemplo de ruta protegida.

El token se firma con `JWT_SECRET`, expira según `JWT_EXPIRES_IN` y solo
contiene el `id` y el `role` del usuario. Las contraseñas se almacenan con
bcrypt y nunca se incluyen en las respuestas.

El middleware centralizado lee `Authorization: Bearer <token>` y distingue:

- `401` si falta el token, es inválido o expiró.
- `403` si el token es válido, pero el rol no tiene permiso.
