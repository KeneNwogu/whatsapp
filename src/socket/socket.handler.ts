import { Server, Socket } from "socket.io"
import { prisma } from "../db/db.client"

export class SocketHandler {
    private readonly io: Server;
    private readonly socket: Socket;

    constructor(io: Server, socket: Socket){
        this.io = io
        this.socket = socket
    }

    handleInitialConversation(){
        // check if user to message exists in a private room with current user
        // const room = prisma.room.f({})
    }

    subscribeToUser(){
        
    }
}