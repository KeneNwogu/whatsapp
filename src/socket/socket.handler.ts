import { Server, Socket } from "socket.io"
import { prisma } from "../db/db.client"

export class SocketHandler {
    constructor(io: Server, socket: Socket){

    }

    handleInitialConversation(){
        // check if user to message exists in a private room with current user
        const room = prisma.room.find({})
    }
}