import { createClient } from '@supabase/supabase-js'

const cleanUrl = (import.meta.env.VITE_SUPABASE_URL || '').replace(/^"(.*)"$/, '$1').replace(/^'(.*)'$/, '$1').trim()
const cleanKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').replace(/^"(.*)"$/, '$1').replace(/^'(.*)'$/, '$1').trim()

if (!cleanUrl || !cleanKey) {
  console.error('Missing Supabase environment variables! Check your VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.')
}

export const supabase = createClient(cleanUrl, cleanKey)
