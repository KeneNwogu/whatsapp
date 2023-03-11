import { createClient } from "@supabase/supabase-js";
import SupabaseClient from "@supabase/supabase-js/dist/module/SupabaseClient";


export class AuthService {
    private static readonly supabaseUrl = 'https://your-supabase-url.com';
    private static readonly supabaseKey = 'your-supabase-key';

    static supabaseClient: SupabaseClient = createClient(AuthService.supabaseUrl, AuthService.supabaseKey);

    async verifySupabaseAccessToken(token: string){
        const { data, error } = await AuthService.supabaseClient.auth.getUser(token);
        if (error) throw new Error(error.message)
        return { id: data.user.id, username: data.user.user_metadata.username }
    }
}