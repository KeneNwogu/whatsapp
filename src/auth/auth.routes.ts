import express from "express";
import AuthController from "./auth.controller";
import ZodMiddleware from "../middlewares/zodMiddleware";
import { SocialProviderSchema } from "./auth.schema";
import { AuthMiddleware } from "./auth.middleware";

const router = express.Router()

router.post('/social/login', ZodMiddleware(SocialProviderSchema), AuthController.getSocialLoginRedirectLink)
router.get('/social/:provider/callback', AuthController.socialLoginCallbackHandler)

router.get('/profile', AuthMiddleware.jwtMiddleware, AuthController.getProfile)

export default router