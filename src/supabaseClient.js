
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://eohfuctwbrympsxwomee.supabase.co'
const supabaseKey = 'sb_publishable_UIOI231QXBj10UqwJflq3g_1UzfO45i'

export const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
        // Use implicit flow instead of PKCE to avoid code verifier storage issues
        // This allows email verification links to work even when opened in different browser contexts
        flowType: 'implicit'
    }
})
