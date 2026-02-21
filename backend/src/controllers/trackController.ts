import { Request, Response, NextFunction } from "express";
import { getTracksByReleaseGroup } from "../services/trackService";

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function getTracksHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = req.params.id as string;

    if (!UUID_REGEX.test(id)) {
      res.status(400).json({ error: "Invalid ID format" });
      return;
    }

    const tracks = await getTracksByReleaseGroup(id);
    res.json(tracks);
  } catch (error) {
    next(error);
  }
}
