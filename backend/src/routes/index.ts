import { Router } from "express";
import healthRoutes from "./healthRoutes";
import artistRoutes from "./artistRoutes";

const router = Router();

router.use(healthRoutes);
router.use("/api", artistRoutes);

export default router;
