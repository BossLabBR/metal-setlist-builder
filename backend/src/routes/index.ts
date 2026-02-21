import { Router } from "express";
import healthRoutes from "./healthRoutes";
import artistRoutes from "./artistRoutes";
import albumRoutes from "./albumRoutes";
import trackRoutes from "./trackRoutes";

const router = Router();

router.use(healthRoutes);
router.use("/api", artistRoutes);
router.use("/api", albumRoutes);
router.use("/api", trackRoutes);

export default router;
