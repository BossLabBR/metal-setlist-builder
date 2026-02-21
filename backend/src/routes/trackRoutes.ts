import { Router } from "express";
import { getTracksHandler } from "../controllers/trackController";

const router = Router();

router.get("/albums/:id/tracks", getTracksHandler);

export default router;
