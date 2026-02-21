import { Router } from "express";
import healthRoutes from "./healthRoutes";
import artistRoutes from "./artistRoutes";
import albumRoutes from "./albumRoutes";

const router = Router();

router.use(healthRoutes);
router.use("/api", artistRoutes);
router.use("/api", albumRoutes);

export default router;
