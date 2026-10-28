import type { AuthTokenPayload } from "../../domain/auth/token.js";

declare global {
  namespace Express {
    interface Request {
      user?: AuthTokenPayload;
    }
  }
}

export {};
