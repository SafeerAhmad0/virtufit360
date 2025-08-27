import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gtfdenahectwmikokxmc.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd0ZmRlbmFoZWN0d21pa29reG1jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA3ODExOTAsImV4cCI6MjA2NjM1NzE5MH0.3M_d5bq1mzSk23rJGUJLpfOxT5_FgDPMihRoqHTvlt8';

export const supabase = createClient(supabaseUrl, supabaseKey);