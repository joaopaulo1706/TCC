//Criado dia 04/08/2025. Chatgpt ajudou a fazer e disse para criar esse arquivo.
// supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://sxwoiuqwiavwjnazxvag.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN4d29pdXF3aWF2d2puYXp4dmFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEzNzIyNTAsImV4cCI6MjA2Njk0ODI1MH0.-RrHI8IJSnxHgpM4lU0KqB3-yg2wttmUkowYKl4w630'

export const supabase = createClient(supabaseUrl, supabaseKey);
