import express from 'express'
import authRoutes from '../../auth/auth.routes'

const router = express.Router()

/**
 * GET v1/status
 */
router.get("/status", (_, res) => res.send("OK"));

router.use("/auth", authRoutes);

export default router