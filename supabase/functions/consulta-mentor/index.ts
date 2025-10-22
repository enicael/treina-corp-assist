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
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) {
      throw new Error('Usuário não autenticado');
    }

    const { pergunta, telefone } = await req.json();

    if (!pergunta) {
      throw new Error('Pergunta é obrigatória');
    }

    // Verificar limite diário
    const today = new Date().toISOString().split('T')[0];
    
    const { data: profile } = await supabaseClient
      .from('profiles')
      .select('limite_diario')
      .eq('id', user.id)
      .single();

    const { data: usage } = await supabaseClient
      .from('daily_usage')
      .select('contagem')
      .eq('user_id', user.id)
      .eq('data', today)
      .single();

    const limite = profile?.limite_diario || 5;
    const usado = usage?.contagem || 0;

    if (limite > 0 && usado >= limite) {
      throw new Error('Limite diário de consultas atingido');
    }

    // Buscar configuração da API
    const { data: apiConfig } = await supabaseClient
      .from('api_configurations')
      .select('*')
      .limit(1)
      .single();

    if (!apiConfig) {
      throw new Error('Configuração da API não encontrada. Configure a URL da API no painel administrativo.');
    }

    // Fazer requisição à API externa
    const headers: any = {
      'Content-Type': 'application/json',
    };

    if (apiConfig.chave_autenticacao) {
      headers['Authorization'] = apiConfig.chave_autenticacao;
    }

    const requestBody = {
      id_usuario: user.id,
      telefone_usuario: telefone,
      mensagem: pergunta,
    };

    // Log detalhado da requisição para debugging
    console.log('Enviando requisição para API externa:', {
      url: apiConfig.url_base,
      body: requestBody,
      hasAuth: !!apiConfig.chave_autenticacao,
      authLength: apiConfig.chave_autenticacao?.length || 0
    });

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), apiConfig.timeout_segundos * 1000);

    let resposta: string;

    try {
      const apiResponse = await fetch(apiConfig.url_base, {
        method: 'POST',
        headers,
        body: JSON.stringify(requestBody),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (!apiResponse.ok) {
        console.error(`API retornou status ${apiResponse.status}`);
        const errorText = await apiResponse.text();
        console.error('Resposta de erro da API:', errorText);
        throw new Error(`API retornou erro: ${apiResponse.status}`);
      }

      const apiData = await apiResponse.json();
      console.log('API Response:', JSON.stringify(apiData));
      
      resposta = apiData.resposta || apiData.message || 'Resposta recebida da API';
    } catch (error: any) {
      console.error('Erro ao chamar API externa:', error);
      
      if (error.name === 'AbortError') {
        throw new Error('Timeout ao aguardar resposta da API');
      }

      // Se a API falhar, usar resposta de fallback
      resposta = 'Desculpe, houve um problema ao processar sua consulta. Por favor, tente novamente mais tarde ou entre em contato com o suporte.';
    }

    // Salvar consulta no histórico
    const { error: insertError } = await supabaseClient
      .from('consultas')
      .insert({
        user_id: user.id,
        pergunta,
        resposta,
      });

    if (insertError) {
      console.error('Erro ao salvar consulta:', insertError);
    }

    // Atualizar ou criar registro de uso diário
    const { data: existingUsage } = await supabaseClient
      .from('daily_usage')
      .select('id, contagem')
      .eq('user_id', user.id)
      .eq('data', today)
      .single();

    if (existingUsage) {
      await supabaseClient
        .from('daily_usage')
        .update({ contagem: existingUsage.contagem + 1 })
        .eq('id', existingUsage.id);
    } else {
      await supabaseClient
        .from('daily_usage')
        .insert({
          user_id: user.id,
          data: today,
          contagem: 1,
        });
    }

    return new Response(
      JSON.stringify({ resposta }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('Erro na função consulta-mentor:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
