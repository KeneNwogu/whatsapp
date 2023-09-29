import express from "express";
// import AuthController from "../auth/auth.middleware";
import ZodMiddleware from "../middlewares/zodMiddleware";
import { AuthMiddleware } from "../auth/auth.middleware";
import { MessageController } from "./messaging.controller";


const router = express.Router()



// router.get('/rooms', AuthMiddleware.jwtMiddleware, UserController.getUserChats)
router.get('/', AuthMiddleware.jwtMiddleware, MessageController.getUserChats)
router.post('/', AuthMiddleware.jwtMiddleware, MessageController.createPrivateRoom)
router.post('/:roomId/messages', AuthMiddleware.jwtMiddleware, MessageController.sendMessage)

export default router