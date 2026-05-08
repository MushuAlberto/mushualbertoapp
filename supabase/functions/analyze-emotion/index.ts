import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openRouterApiKey = Deno.env.get('OPENROUTER_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const EMOTION_ANALYSIS_PROMPT = `
Analiza el siguiente texto y devuelve ÚNICAMENTE un objeto JSON válido con esta estructura exacta:
{
  "emotion": "string", // Una de: "Feliz", "Triste", "Ansioso", "Enojado", "Neutro", "Esperanzado", "Confundido"
  "emoji": "string", // Un emoji que represente la emoción
  "confidence": number, // Del 0 al 1, qué tan seguro estás del análisis
  "summary": "string" // Resumen en 1-2 oraciones del contenido emocional
}
`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text } = await req.json();

    if (!text) throw new Error('No text provided');

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openRouterApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemma-2-9b-it:free',
        messages: [
          { role: 'system', content: EMOTION_ANALYSIS_PROMPT },
          { role: 'user', content: text }
        ],
      }),
    });

    if (!response.ok) throw new Error(`OpenRouter error: ${response.status}`);

    const data = await response.json();
    const content = data.choices[0].message.content;
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    const analysis = jsonMatch ? JSON.parse(jsonMatch[0]) : { emotion: "Neutro", emoji: "😐", confidence: 0.5 };

    return new Response(JSON.stringify(analysis), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in analyze-emotion:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
