import { prisma } from "../db/db.client";

export class MessageService {

    // create private room between two users
    static async createPrivateRoom(userA: string, userB: string){
        const privateRoom = await this.checkPrivateRoomExistsBetweenUsers([userA, userB])
        if(!privateRoom){
            return await prisma.room.create({ data: { users: { 
                connect: [{ id: userA}, {id: userB}]}, 
                group: false
            }})
        }

        return privateRoom
    }

    // static async createGroupRoom()

    static async createGroupChat(){}

    static async getRoomById(roomId: string){
        return await prisma.room.findUnique({ where: { id: roomId }})
    }

    static async isRoomMember(roomId: string, userId: string){
        return await prisma.room.findFirst({ where: { id: roomId, users: { some: { id: userId }}}})
    }

    static async getAllUserRooms(userId: string){
        return await prisma.room.findMany({ where: { users: { some: { id: userId }}}, select: { 
            id: true,
            messages: { orderBy: { createdAt: 'desc'}, take: 1 }}})
    }

    static async getMessagesForRoom(roomId: string){
        return await prisma.message.findMany({ where: { roomId }})
    }

    static async sendMessage(roomId: string, senderId: string, message: string){
        // const room = await this.createPrivateRoom(senderId, receiverId)
        return await prisma.message.create({ data: { roomId: roomId, userId: senderId, message }})
    }

    static async checkPrivateRoomExistsBetweenUsers(userList: string[]){
        return await prisma.room.findFirst({ where: { group: false, users: { every: { id: { in: userList }}}}})
    }
}