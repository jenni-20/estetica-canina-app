import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://auueiklybagilvmsrkuj.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF1dWVpa2x5YmFnaWx2bXNya3VqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYxODk5ODgsImV4cCI6MjA5MTc2NTk4OH0.aE7TJ-jFSf0usxnHPz48WiQbyIZcYdUzmgjqzGVQhWw';

export const supabase = createClient(supabaseUrl, supabaseKey);