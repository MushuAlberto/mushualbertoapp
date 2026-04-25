
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const lovableApiKey = Deno.env.get('LOVABLE_API_KEY');

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

Texto a analizar:
`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text } = await req.json();

    if (!text) {
      throw new Error('No text provided for analysis');
    }

    console.log('Analyzing emotion for text:', text.substring(0, 100));

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${lovableApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { 
            role: 'user', 
            content: EMOTION_ANALYSIS_PROMPT + text 
          }
        ],
        max_tokens: 300,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Lovable AI error:', errorText);
      if (response.status === 429) {
        throw new Error('Rate limit exceeded. Please try again later.');
      }
      if (response.status === 402) {
        throw new Error('AI credits depleted. Please add funds to your Lovable workspace.');
      }
      throw new Error(`Lovable AI error: ${response.status}`);
    }

    const data = await response.json();
    const analysisText = data.choices[0].message.content;

    // Parse the JSON response
    let analysis;
    try {
      analysis = JSON.parse(analysisText);
    } catch (parseError) {
      console.error('Failed to parse AI response:', analysisText);
      // Fallback analysis
      analysis = {
        emotion: "Neutro",
        emoji: "😐",
        confidence: 0.5,
        summary: "Análisis no disponible"
      };
    }

    console.log('Emotion analysis completed:', analysis);

    return new Response(JSON.stringify(analysis), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in analyze-emotion function:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'Internal server error' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
