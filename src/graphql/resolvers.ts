import { User } from "@prisma/client"
import { UserService } from "../user/user.service"
import { Request } from "express"

const userService = new UserService() 

interface IRequest extends Request{
    user: User
}


export const resolvers = {
    message: () => 'Hello World', 
    async updateUserLastActiveStatus(args: any, request: IRequest){
        console.log(request.headers.authorization)
        // console.log(request.headers.get('Authorization'))
        // console.log(request)
        // console.log(request.user)
    },
    async searchUsers(args: any){
        const searchTerm = args.searchTerm
        return await userService.searchUsersByUsername(searchTerm)
    }
}