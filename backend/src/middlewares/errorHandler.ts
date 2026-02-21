import { Request, Response, NextFunction } from "express";
import { AxiosError } from "axios";

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if ((err as AxiosError).isAxiosError) {
    const axiosErr = err as AxiosError;
    const status = axiosErr.response?.status;

    if (status === 404) {
      res.status(404).json({ error: "Resource not found on MusicBrainz" });
      return;
    }

    res.status(502).json({ error: "MusicBrainz temporarily unavailable" });
    return;
  }

  if ("statusCode" in err) {
    const statusCode = (err as Error & { statusCode: number }).statusCode;
    res.status(statusCode).json({ error: err.message });
    return;
  }

  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal server error" });
}
