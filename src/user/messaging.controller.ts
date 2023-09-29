import { Request, Response } from "express";
import { UserService } from "./user.service";
import { MessageService } from "./messaging.service";
import { BadRequestError } from "../errors/bad-request-error";
import { NotAuthorizedError } from "../errors/not-authorized-error";
import { NotFoundError } from "../errors/not-found-error";

export class MessageController{
    // TODO: separate to Message controller
    static async getUserChats(req: Request, res: Response){
        const rooms = await MessageService.getAllUserRooms(req.user.id)
        return res.json({ rooms })
    }

    static async createPrivateRoom(req: Request, res: Response){
        let { receiverId, initializeWithMessage } = req.body
        console.log(req.body)
        let senderId = req.user.id

        if(receiverId === senderId) throw new BadRequestError("can not message yourself")
        if(!await UserService.getUserById(receiverId)) throw new NotFoundError("no user with id was found")

        let room = await MessageService.createPrivateRoom(senderId, receiverId)
        if(initializeWithMessage){
            await MessageService.sendMessage(room.id, senderId, initializeWithMessage)
        }

        return res.json({ room })
    }

    static async sendMessage(req: Request, res: Response){
        let roomId = req.params.roomId
        let { message } = req.body

        if(!await MessageService.getRoomById(roomId)) throw new BadRequestError("Invalid room id")

        if(!await MessageService.isRoomMember(roomId, req.user.id))
            throw new NotAuthorizedError("user is not a member of this room")

        const roomMessage = await MessageService.sendMessage(roomId, req.user.id, message)
        return res.json({ message: roomMessage })
    }

    static async getRoom(req: Request, res: Response){
        let roomId = req.params.roomId

        const room = await MessageService.getRoomById(roomId)
        if(!room) throw new BadRequestError("Invalid room id")

        if(!await MessageService.isRoomMember(roomId, req.user.id))
            throw new NotAuthorizedError("user is not a member of this room")

        const messages = await MessageService.getMessagesForRoom(room.id)
        return res.json({ room, messages })
    }
}