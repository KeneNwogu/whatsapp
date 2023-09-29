import express from "express";
// import AuthController from "../auth/auth.middleware";
import ZodMiddleware from "../middlewares/zodMiddleware";
import { AuthMiddleware } from "../auth/auth.middleware";
import { UserController } from "./user.controller";


const router = express.Router()

// router.get('/rooms', AuthMiddleware.jwtMiddleware, UserController.getUserChats)
router.get('/', AuthMiddleware.jwtMiddleware, UserController.getAllUsers)

export default router