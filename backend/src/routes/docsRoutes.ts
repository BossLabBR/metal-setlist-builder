import { Router, Request, Response } from "express";
import { apiReference } from "@scalar/express-api-reference";
import openApiSpec from "../docs/openapi";

const router = Router();

router.get("/api/docs/openapi.json", (_req: Request, res: Response) => {
  res.json(openApiSpec);
});

router.get(
  "/api/docs",
  apiReference({
    content: openApiSpec,
    theme: "moon",
  })
);

export default router;
