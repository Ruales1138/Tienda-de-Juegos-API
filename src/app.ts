import cors from "cors";
import express from "express";

const frontendUrl = process.env.FRONTEND_URL ?? "http://localhost:3000";

export const app = express();

app.use(cors({ origin: frontendUrl }));
app.use(express.json());

app.get("/health", (_request, response) => {
  response.json({ status: "ok" });
});
