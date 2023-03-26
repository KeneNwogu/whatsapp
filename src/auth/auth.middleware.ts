import { Request, Response, NextFunction } from "express"
import { AuthService } from "./auth.service"

interface IRequest extends Request {
    user?: {
        id: string,
        username: string,
        profilePicture: string
    }
}

export class AuthMiddleware {
    private readonly authService: AuthService

    constructor() {
        this.authService = new AuthService()
    }
    async jwtMiddleware(req: IRequest, res: Response, next: NextFunction) {
        try {
            const authorization = req.headers.authorization
            if (!authorization) return res.sendStatus(401).end()
            if (authorization.split(' ').length != 2) return res.sendStatus(401).end()

            const token = authorization.split(' ')[1]
            const user = await this.authService.verifySupabaseAccessToken(token)
            req.user = user
            next()
        }
        catch(e){
            return res.sendStatus(401).end()
        }
    }
}