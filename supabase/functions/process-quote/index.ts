import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } }
    )

    const { data: { user } } = await supabaseClient.auth.getUser()
    if (!user) throw new Error('Non authentifié')

    const { quote_id, action } = await req.json()
    
    // Vérifier les permissions
    const { data: quote, error } = await supabaseClient
      .from('quote_requests')
      .select('*')
      .eq('id', quote_id)
      .single()

    if (error) throw error

    // Seul l'admin ou le propriétaire peut modifier
    if (user.id !== quote.user_id && user.role !== 'admin') {
      throw new Error('Permission refusée')
    }

    // Traitement selon l'action
    let updateData = {}
    switch(action) {
      case 'approve':
        updateData = { status: 'processing' }
        break
      case 'complete':
        updateData = { status: 'completed' }
        break
      case 'reject':
        updateData = { status: 'rejected' }
        break
      default:
        throw new Error('Action non supportée')
    }

    // Mettre à jour le devis
    const { error: updateError } = await supabaseClient
      .from('quote_requests')
      .update(updateData)
      .eq('id', quote_id)

    if (updateError) throw updateError

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }
})