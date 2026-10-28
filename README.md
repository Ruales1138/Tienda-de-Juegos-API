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

## Endpoints del catálogo e interacciones

Catálogo de videojuegos:

- `GET /api/videojuegos?page=1&limit=10` es público y responde con
  `pagination` y `data`.
- `GET /api/videojuegos/:id` es público.
- `POST /api/videojuegos` requiere rol `ADMIN`.
- `PUT /api/videojuegos/:id` requiere rol `ADMIN`.
- `DELETE /api/videojuegos/:id` requiere rol `ADMIN`.

Solicitudes:

- `POST /api/solicitudes` requiere autenticación. El usuario se toma del JWT,
  nunca del body.
- `GET /api/solicitudes/mias` devuelve únicamente las solicitudes del usuario
  autenticado.
- `GET /api/solicitudes` requiere rol `ADMIN` y devuelve todas las solicitudes.

Los bodies, ids y parámetros de paginación inválidos responden `400`; los
recursos inexistentes responden `404`; y los conflictos de unicidad o
relaciones responden `409`.
