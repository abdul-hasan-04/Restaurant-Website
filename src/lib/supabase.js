import { createClient } from "@supabase/supabase-js";

const supabaseUrlKey = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrlKey, supabaseAnonKey, {
    auth : {
        persistSession : true,
        autoRefreshToken : true
    },
    realtime : {
        params : {
            eventsPerSecond : 10
        }
    }
})


export default supabase