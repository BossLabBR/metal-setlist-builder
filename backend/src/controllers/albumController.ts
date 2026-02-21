import { Request, Response, NextFunction } from "express";
import { getAlbumsByArtist } from "../services/albumService";

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function getAlbumsHandler(
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

    const albums = await getAlbumsByArtist(id);
    res.json(albums);
  } catch (error) {
    next(error);
  }
}
