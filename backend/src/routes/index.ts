import { Router } from "express";
import healthRoutes from "./healthRoutes";
import artistRoutes from "./artistRoutes";
import albumRoutes from "./albumRoutes";
import trackRoutes from "./trackRoutes";
import docsRoutes from "./docsRoutes";

const router = Router();

router.use(healthRoutes);
router.use("/api", artistRoutes);
router.use("/api", albumRoutes);
router.use("/api", trackRoutes);
router.use(docsRoutes);

export default router;
