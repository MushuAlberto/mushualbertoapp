import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openRouterApiKey = Deno.env.get('OPENROUTER_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      message, 
      conversationHistory = [], 
      userContext, 
      emotionalState, 
      lastActivity, 
      preferences 
    } = await req.json();

    if (!message) {
      throw new Error('No message provided');
    }

    console.log('OpenRouter Chat received request:', { 
      messageLength: message.length,
      emotionalState: emotionalState?.current,
      historyLength: conversationHistory.length 
    });

    const systemPrompt = buildAdvancedPrompt(userContext, emotionalState, lastActivity, preferences);
    
    const enrichedHistory = conversationHistory.map((msg: any) => ({
      role: msg.role,
      content: msg.emotionalContext 
        ? `[Contexto emocional: ${msg.emotionalContext}] ${msg.content}`
        : msg.content
    }));

    // OpenRouter Call with Gemma
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openRouterApiKey}`,
        'HTTP-Referer': 'https://mushu-alberto.vercel.app', // Opcional pero recomendado por OpenRouter
        'X-Title': 'Mushu Alberto App',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemma-2-9b-it:free', // Usando la versión free estable de Gemma 2
        max_tokens: 1000,
        messages: [
          { role: 'system', content: systemPrompt },
          ...enrichedHistory,
          { role: 'user', content: message }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenRouter error:', errorText);
      throw new Error(`OpenRouter error: ${response.status}`);
    }

    const data = await response.json();
    const aiMessage = data.choices[0].message;

    return new Response(JSON.stringify({
      message: aiMessage.content,
      timestamp: new Date().toISOString(),
      source: 'openrouter-gemma'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in openrouter-chat function:', error);
    
    return new Response(JSON.stringify({ 
      message: "Lo siento, tuve un pequeño problema técnico al conectarme con mis neuronas de OpenRouter. ¿Podemos intentarlo de nuevo?",
      source: 'fallback',
      fallback: true,
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function buildAdvancedPrompt(userContext: any, emotionalState: any, lastActivity: any, preferences: any): string {
  return `Eres Mushu, un asistente de IA superinteligente y empático diseñado para apoyar el bienestar y la productividad.
  
  CONTEXTO ACTUAL:
  - Emoción: ${emotionalState?.current || 'neutral'}
  - Tareas: ${userContext?.pendingTasks || 0}
  - Estilo: ${preferences?.communicationStyle || 'empático'}
  
  INSTRUCCIONES:
  - Responde de forma cálida, breve y directa.
  - Usa emojis para ser visual.
  - Si el usuario está estresado, sé compasivo.
  - Si está motivado, sé entusiasta.
  - Tu nombre es Mushu.`;
}