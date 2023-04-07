import { User } from "@prisma/client"
import { UserService } from "../user/user.service"
import { Request } from "express"
import { AuthMiddleware } from "../auth/auth.middleware"

const authMiddleware = new AuthMiddleware()

const userService = new UserService() 

interface IRequest extends Request{
    user: {
        id: string,
        username: string,
        profilePicture: string
    }
}

function resolverMiddlewareDecorator(middleware: Function, fn: Function) {
    return async function(...args: any[]) {
        try {
            const req = await middleware(args[1]);
            if(!req) throw new Error("Unauthorised")
            return fn(args[0], req)
        }
        
        catch{
            return null
        } 
    }
}

function requiresAuth<T extends object>(target: T, key: keyof T, descriptor: TypedPropertyDescriptor<any>){
    const originalMethod = descriptor.value;

    // Define a new function that wraps the original method and adds an extra argument
    descriptor.value = function(...args: any[]) {
        const extraArg = "Hello, world!";
        return originalMethod.call(this, ...args, extraArg);
    };

    return descriptor
}

export const resolvers = {
    message: () => 'Hello World', 

    
    async updateUserLastActiveStatus(args: any, request: IRequest){
        request = await authMiddleware.authenticateRequest(request)
        return await userService.setUserLastActiveStatus(request.user.id, request.user.username, request.user.profilePicture)
    },
    async searchUsers(args: any){
        const searchTerm = args.searchTerm
        return await userService.searchUsersByUsername(searchTerm)
    }
}