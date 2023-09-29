import { number, object, string, array, z } from "zod";

export const CreateRoomSchema = object({
    receiverId: string({ required_error: "receiver id is required" }),
    initializeWithMessage: string().optional()
}).strict(); 

export const SendMessageSchema = object({
    message: string({ required_error: "message is required" })
})