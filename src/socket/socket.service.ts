import { Application } from "express";
import { Server, Socket } from "socket.io";
import { AuthService } from "../auth/auth.service";
import { Server as HttpServer } from "http";

interface UserContext {
    id: string
    username: string
}

interface ExtendedSocket extends Socket {
    user: UserContext
}

export class SocketService {
    private readonly authService: AuthService;
    constructor(){
        this.authService = new AuthService()
    }
    static createSocketServer(expressServer: HttpServer){
        return new Server(expressServer, {
            cors: {
                origin: '*'
            }
        })
    }

    async registerMiddlewares(io: Server){
        io.use(async (socket: Socket, next) => {
            const token = socket.handshake.auth.token;
            // ...
            try{
                let user_socket = <ExtendedSocket> socket
                const user = await this.authService.verifySupabaseAccessToken(token)
                user_socket.user = user
            }
            catch(e: any){
                next(e)
            }
        });
    }
}
