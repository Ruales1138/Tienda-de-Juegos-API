import cors from "cors";
import express from "express";
import { authRouter } from "./interface/http/auth-routes.js";
import { errorHandler } from "./interface/http/error-handler.js";
import { solicitudRouter } from "./interface/http/solicitud-routes.js";
import { videojuegoRouter } from "./interface/http/videojuego-routes.js";

const frontendUrl = process.env.FRONTEND_URL ?? "http://localhost:3000";

export const app = express();

app.use(cors({ origin: frontendUrl }));
app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/videojuegos", videojuegoRouter);
app.use("/api/solicitudes", solicitudRouter);

app.get("/health", (_request, response) => {
  response.json({ status: "ok" });
});

app.use(errorHandler);
