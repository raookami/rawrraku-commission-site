// src/supabase.js
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://bojisfomzhqqxvlkkksn.supabase.co';
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJvamlzZm9temhxcXh2bGtra3NuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAxMTcxNjAsImV4cCI6MjA5NTY5MzE2MH0.g8hsfDIX0PiY3Z6Z-ajPfRCWRu9DOhuHfItsZdDGF5Q';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
