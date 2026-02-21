import express from "express";
import cors from "cors";
import routes from "./routes";
import { errorHandler } from "./middlewares/errorHandler";
import { config } from "./config";

export function createApp() {
  const app = express();

  app.use(cors({ origin: config.cors.origin }));
  app.use(express.json());
  app.use(routes);
  app.use(errorHandler);

  return app;
}
