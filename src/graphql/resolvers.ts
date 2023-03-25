import { User } from "@prisma/client"
import { UserService } from "../user/user.service"
import { Request } from "express"

const userService = new UserService() 

interface IRequest extends Request{
    user: {
        id: string,
        username: string,
        profilePicture: string
    }
}


export const resolvers = {
    message: () => 'Hello World', 
    async updateUserLastActiveStatus(args: any, request: IRequest){
        return await userService.setUserLastActiveStatus(request.user.id, request.user.username, request.user.profilePicture)
    },
    async searchUsers(args: any){
        const searchTerm = args.searchTerm
        return await userService.searchUsersByUsername(searchTerm)
    }
}