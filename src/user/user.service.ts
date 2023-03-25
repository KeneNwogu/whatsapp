import { prisma } from "../db/db.client";
import { getCurrentDate } from "../helpers/utils";

export class UserService {
    async getUsers() {

    }

    async getUserByUsername() {

    }

    async setUserLastActiveStatus(supabaseId: string, username: string, profilePicture: string) {
        const user = await prisma.user.upsert({
            where: {
                supabaseId
            },
            update: {
                lastActive: getCurrentDate()
            },
            create: {
                supabaseId,
                username,
                profilePicture
            },
        })

        return user
    }

    async searchUsersByUsername(searchTerm: string){
        const users = await prisma.user.findMany({
            where: {
                username: {
                    contains: searchTerm,
                    mode: 'insensitive',
                }
            }
        })

        return users
    }
}