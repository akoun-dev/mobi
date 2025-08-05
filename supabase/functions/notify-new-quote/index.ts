// Note: Ce fichier utilise des APIs Deno spécifiques
// Les erreurs TypeScript sont normales dans cet environnement

// @ts-expect-error: Import Deno
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
// @ts-expect-error: Import ESM
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  try {
    // @ts-expect-error: Environnement Deno
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    // @ts-expect-error: Environnement Deno
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    
    const supabaseClient = createClient(supabaseUrl, supabaseKey, {
      global: { headers: { Authorization: req.headers.get('Authorization')! } }
    })

    const { record: quote } = await req.json()

    const { data: admins, error } = await supabaseClient
      .from('profiles')
      .select('user_id, email')
      .eq('role', 'admin')

    if (error) throw error

    return new Response(
      JSON.stringify({ 
        success: true,
        quote_id: quote.id,
        notified_admins: admins?.length || 0
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
})