import express from "express";
// import AuthController from "../auth/auth.middleware";
import ZodMiddleware from "../middlewares/zodMiddleware";
import { AuthMiddleware } from "../auth/auth.middleware";
import { MessageController } from "./messaging.controller";
import { CreateRoomSchema, SendMessageSchema } from "./schemas";


const router = express.Router()



// router.get('/rooms', AuthMiddleware.jwtMiddleware, UserController.getUserChats)
router.get('/', AuthMiddleware.jwtMiddleware, MessageController.getUserChats)
router.post('/', AuthMiddleware.jwtMiddleware, ZodMiddleware(CreateRoomSchema), 
MessageController.createPrivateRoom)
router.get('/:roomId', AuthMiddleware.jwtMiddleware, MessageController.getRoom)
router.post('/:roomId/messages', AuthMiddleware.jwtMiddleware, ZodMiddleware(SendMessageSchema), 
MessageController.sendMessage)

export default router