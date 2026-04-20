import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://auueiklybagilvmsrkuj.supabase.co';
const supabaseKey = 'sb_publishable_tkoY_uq533J6fPhdvWQpew_Bt_UGhhP';

export const supabase = createClient(supabaseUrl, supabaseKey);