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
3. Ejecuta el servidor en desarrollo:

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
