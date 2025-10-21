import { serve } from 'std/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = Deno.env.get('SUPABASE_URL')
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_KEY')
const supabase = createClient(supabaseUrl || '', supabaseKey || '')

serve(async (req) => {
  try {
    const body = await req.json()
    const { email, password, role = 'user', department } = body
    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error) return new Response(JSON.stringify({ error: error.message }), { status: 400 })

    await supabase.from('users').insert([{ auth_id: data.user?.id, email, role, department }])
    return new Response(JSON.stringify({ user: data.user }), { status: 201 })
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 })
  }
})
