import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: 'contato@webcontato.com.br',
      password: '705j20I4JzBa',
      email_confirm: true,
      user_metadata: {
        nome: 'administrador',
        usuario: 'administrador',
        telefone: '5511985840220',
        role: 'admin',
        limite_diario: 0,
      },
    });

    if (authError) throw authError;

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Usuário admin criado com sucesso!',
        user_id: authData.user.id 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('Erro ao criar admin:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
