
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://eohfuctwbrympsxwomee.supabase.co'
const supabaseKey = 'sb_publishable_UIOI231QXBj10UqwJflq3g_1UzfO45i'

export const supabase = createClient(supabaseUrl, supabaseKey)
