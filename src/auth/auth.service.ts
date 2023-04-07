import { createClient } from "@supabase/supabase-js";
import SupabaseClient from "@supabase/supabase-js/dist/module/SupabaseClient";
import dotenv from "dotenv"

dotenv.config()

export class AuthService {
    private static readonly supabaseUrl = process.env.SUPABASE_URL;
    private static readonly supabaseKey = process.env.SUPABASE_KEY;

    static supabaseClient: SupabaseClient

    constructor(){
        if(!AuthService.supabaseUrl) throw new Error("Supabase url must be defined")
        if(!AuthService.supabaseKey) throw new Error("Supabase key must be defined")

        AuthService.supabaseClient = createClient(AuthService.supabaseUrl, AuthService.supabaseKey);
    }

    async verifySupabaseAccessToken(token: string){
        const { data, error } = await AuthService.supabaseClient.auth.getUser(token);
        if (error) throw new Error(error.message)
        return { id: data.user.id, username: data.user.user_metadata?.username, profilePicture: data.user.user_metadata?.avatar_url }
    }
}