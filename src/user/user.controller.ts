import { Request, Response } from "express";
import { UserService } from "./user.service";
import { MessageService } from "./messaging.service";

export class UserController{
    static async getAllUsers(req: Request, res: Response){
        const users = await UserService.getAllUsers()
        return res.json({ users })
    }
}