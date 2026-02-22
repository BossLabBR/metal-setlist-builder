import { Request, Response } from "express";

export function apiReference() {
  return (_req: Request, res: Response) => {
    res.setHeader("Content-Type", "text/html");
    res.send("<html><body>Scalar API Reference</body></html>");
  };
}
