import { Router } from "express";
import { getAlbumsHandler } from "../controllers/albumController";

const router = Router();

router.get("/artists/:id/albums", getAlbumsHandler);

export default router;
