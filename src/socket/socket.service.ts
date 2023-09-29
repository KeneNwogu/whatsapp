import { Application } from "express";
import { Server, Socket } from "socket.io";
import { AuthService } from "../auth/auth.service";
import { Server as HttpServer } from "http";
import { User } from "@prisma/client";
import { NotAuthorizedError } from "../errors/not-authorized-error";
import { MessageService } from "../user/messaging.service";

interface UserContext extends User {}

interface ExtendedSocket extends Socket {
    user: UserContext
}

export class SocketService {
    // private readonly authService: AuthService;
    io: Server;

    constructor(expressServer: HttpServer){
        this.io = SocketService.createSocketServer(expressServer);
        SocketService.registerMiddlewares(this.io);
        this.io.on('connection', this.handleConnection);
    }


    static createSocketServer(expressServer: HttpServer){
        return new Server(expressServer, {
            cors: {
                origin: '*'
            }
        })
    }

    static async registerMiddlewares(io: Server){
        io.use(async (socket: Socket, next) => {
            const token = socket.handshake.auth.token;
            // ...
            try{
                let user_socket = <ExtendedSocket> socket
                const user = await AuthService.verifyAuthJWT(token)
                if(user) user_socket.user = user as User
                else throw new NotAuthorizedError("invalid auth token")
            }
            catch(e: any){
                next(e)
            }
        });
    }

    async handleConnection(socket: Socket){
        // join users to all rides they are in
        const userRooms = await MessageService.getAllUserRooms(socket.handshake.auth.user.id)
        userRooms.map(room => { 
            socket.join(room.id); 
        })

        socket.on('messageSent', ({ roomId, message }) => {
            socket.to(roomId).emit('messageBroadcast', message)
        })
    }

    broadcastMessage(rideId: string, message: any){
        this.io.to(rideId).emit('messageBroadcast', message)
    }
}
