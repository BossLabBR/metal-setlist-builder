import { Request, Response, NextFunction } from "express";
import { searchArtists } from "../services/artistService";

export async function searchArtistsHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const query = req.query.q as string | undefined;

    if (!query || query.trim() === "") {
      res
        .status(400)
        .json({ error: "Query parameter 'q' is required" });
      return;
    }

    const results = await searchArtists(query.trim());
    res.json(results);
  } catch (error) {
    next(error);
  }
}
