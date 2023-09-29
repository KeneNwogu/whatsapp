import { prisma } from "../db/db.client";
import { getCurrentDate } from "../helpers/utils";

export class UserService {
    static async getAllUsers() {
        return await prisma.user.findMany()
    }

    static async getUserById(id: string) {
        return await prisma.user.findUnique({ where: { id }})
    }

    static async getUserByEmail(email: string){
        return await prisma.user.findUnique({ where: { email }})
    }

    static async updateUser(userId: string, user: { lastActive?: Date, isActive: boolean }) {
        return await prisma.user.update({ where: { id: userId }, data: user })
    }

    async searchUsersByUsername(searchTerm: string){
        // const users = await prisma.user.findMany({
        //     where: {
        //         username: {
        //             contains: searchTerm,
        //             mode: 'insensitive',
        //         }
        //     }
        // })

        // return users
    }
}