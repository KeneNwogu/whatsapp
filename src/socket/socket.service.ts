import { Server } from "socket.io";
import { AuthService } from "../auth/auth.service";


export class SocketService {
    authService: AuthService;
    constructor(){
        this.authService = new AuthService()
    }
    static async createSocketServer(){
        return new Server({
            cors: {
                origin: '*'
            }
        })
    }

    async registerMiddlewares(io: Server){
        io.use((socket, next) => {
            const token = socket.handshake.auth.token;
            // ...
            try{
                this.authService.verifySupabaseAccessToken(token)
            }
            catch(e: any){
                next(e)
            }
        });
    }
}
