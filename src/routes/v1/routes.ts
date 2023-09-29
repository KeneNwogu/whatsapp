import express from 'express'
import authRoutes from '../../auth/auth.routes'
import userRoutes from '../../user/user.routes'
const router = express.Router()

/**
 * GET v1/status
 */
router.get("/status", (_, res) => res.send("OK"));

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/rooms");

export default router