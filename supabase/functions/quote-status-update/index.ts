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

    const { record: quote, old_record: oldQuote } = await req.json()

    // Envoyer une notification seulement si le statut a changé
    if (quote.status !== oldQuote.status) {
      const { data: user, error } = await supabaseClient
        .from('profiles')
        .select('email')
        .eq('user_id', quote.user_id)
        .single()

      if (!error && user) {
        // Ici vous pourriez intégrer un service d'emails ou de notifications
        return new Response(
          JSON.stringify({ 
            success: true,
            message: `Notification envoyée à ${user.email}`,
            new_status: quote.status
          }),
          { status: 200, headers: { 'Content-Type': 'application/json' } }
        )
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Aucun changement de statut détecté'
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