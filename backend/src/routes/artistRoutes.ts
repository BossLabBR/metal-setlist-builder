import { Router } from "express";
import { searchArtistsHandler } from "../controllers/artistController";

const router = Router();

router.get("/artists/search", searchArtistsHandler);

export default router;
