import { createClient } from "@supabase/supabase-js";
import SupabaseClient from "@supabase/supabase-js/dist/module/SupabaseClient";
import dotenv from "dotenv"
import jwt from 'jsonwebtoken';
import { prisma } from "../db/db.client";
import { UserService } from "../user/user.service";

dotenv.config()

export const socialLoginConfig: {
    [key: string]: {
        clientId: string,
        clientSecret: string,
        authorizeUrl: string,
        tokenUrl: string,
        userInfo: {
            url: string,
            email: (data: any) => string,
            profile: (data: any) => { firstName: string, lastName: string }
        },
        scopes: string[],
    }
} = {
    'google': {
        clientId: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        authorizeUrl: 'https://accounts.google.com/o/oauth2/auth',
        tokenUrl: 'https://accounts.google.com/o/oauth2/token',
        userInfo: {
            url: 'https://www.googleapis.com/oauth2/v3/userinfo',
            email: (data: any) => data.email,
            profile: (data: any) => { return { firstName: data['given_name'], lastName: data['family_name']} }
        },
        scopes: ['email', 'profile'],
    }
}

export class AuthService {
    private static readonly supabaseUrl = process.env.SUPABASE_URL;
    private static readonly supabaseKey = process.env.SUPABASE_KEY;

    private static readonly googleClientID = process.env.GOOGLE_CLIENT_ID
    private static readonly googleClientSecret = process.env.GOOGLE_CLIENT_SECRET

    static supabaseClient: SupabaseClient 

    constructor(){
        // if(!AuthService.supabaseUrl) throw new Error("Supabase url must be defined")
        // if(!AuthService.supabaseKey) throw new Error("Supabase key must be defined")

        if(!AuthService.googleClientID) throw new Error("you must supply a google client id")
        if(!AuthService.googleClientSecret) throw new Error("you must supply a google client secret")

        // AuthService.supabaseClient = createClient(AuthService.supabaseUrl, AuthService.supabaseKey);
    }

    async verifySupabaseAccessToken(token: string){
        const { data, error } = await AuthService.supabaseClient.auth.getUser(token);
        if (error) throw new Error(error.message)
        return { id: data.user.id, username: data.user.user_metadata?.username, profilePicture: data.user.user_metadata?.avatar_url }
    }

    static async createUser(email: string, firstName: string, lastName: string){
        return await prisma.user.create({ data: {
            email,
            firstName,
            lastName
        }})
    }

    static async createAuthJWT(id: string, email: string): Promise<string>{
        return new Promise((resolve, reject) => {
            jwt.sign({ id, email }, process.env.JWT_TOKEN_SECRET!, { expiresIn: '6h'}, 
                (error, token) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(token as string);
                    }
                }
            )
        })
    }

    static async verifyAuthJWT(token: string){
        try{
            const decodedToken: { id: string, email: string } = await new Promise((resolve, reject) => {
                jwt.verify(token, process.env.JWT_TOKEN_SECRET!, 
                    (error, data) => {
                        if (error) {
                            reject(error);
                        } else {
                            resolve(data as { id: string, email: string });
                        }
                    }
                )
            })
            return await UserService.getUserById(decodedToken.id)
        }
        
        catch(err){
            throw err
        }
    }
}