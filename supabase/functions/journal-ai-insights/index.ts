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
    const { action, journalEntry, recentEntries = [], emotionalHistory = [] } = await req.json();

    let systemPrompt = '';
    let userPrompt = '';

    switch (action) {
      case 'analyze_entry':
        systemPrompt = `Eres un experto en bienestar. Analiza la entrada de diario y devuelve ÚNICAMENTE un objeto JSON válido.
        ESTRUCTURA JSON:
        {
          "emotionalAnalysis": { "primaryEmotion": "string", "emotionIntensity": 1-10, "sentiment": "string" },
          "insights": { "mainThemes": [], "cognitivePatterns": [], "positiveAspects": [] },
          "recommendations": { "immediate": [], "longTerm": [] },
          "supportResponse": "string",
          "moodScore": -10 to 10
        }`;
        userPrompt = `Analiza: "${journalEntry}"`;
        break;

      case 'generate_prompts':
        systemPrompt = `Genera 5 prompts para diario en JSON. ESTRUCTURA: { "prompts": [{ "text": "", "category": "" }] }`;
        userPrompt = `Basado en: ${JSON.stringify(emotionalHistory)}`;
        break;

      default:
        throw new Error('Acción no válida');
    }

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openRouterApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemma-2-9b-it:free',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        response_format: { type: "json_object" }
      }),
    });

    if (!response.ok) throw new Error(`OpenRouter error: ${response.status}`);

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    // Cleanup if model adds markdown blocks
    const jsonStr = content.includes('```json') 
      ? content.split('```json')[1].split('```')[0] 
      : content;

    return new Response(jsonStr, {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in journal-ai-insights:', error);
    return new Response(JSON.stringify({ error: error.message, fallback: true }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});