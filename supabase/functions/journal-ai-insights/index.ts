import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const lovableApiKey = Deno.env.get('LOVABLE_API_KEY');

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
        systemPrompt = `Eres Mushu Alberto, un compañero IA empático especializado en análisis emocional y bienestar mental. Analiza la entrada del diario y proporciona insights profundos sobre el estado emocional, patrones y recomendaciones de apoyo.

Responde en formato JSON con esta estructura:
{
  "emotionalAnalysis": {
    "primaryEmotion": "string",
    "emotionIntensity": number (1-10),
    "secondaryEmotions": ["array", "of", "emotions"],
    "sentiment": "positive|negative|neutral|mixed",
    "confidence": number (0-1)
  },
  "insights": {
    "mainThemes": ["array", "of", "themes"],
    "cognitivePatterns": ["array", "of", "patterns"],
    "stressIndicators": ["array", "if", "any"],
    "positiveAspects": ["array", "of", "positive", "elements"]
  },
  "recommendations": {
    "immediate": ["array", "of", "immediate", "actions"],
    "longTerm": ["array", "of", "long", "term", "suggestions"],
    "resources": ["array", "of", "helpful", "resources"]
  },
  "supportResponse": "Una respuesta empática y de apoyo personalizada de Mushu",
  "moodScore": number (-10 to 10),
  "flagsForConcern": boolean
}`;
        userPrompt = `Analiza esta entrada de diario: "${journalEntry}"`;
        break;

      case 'generate_prompts':
        systemPrompt = `Eres Mushu Alberto, un compañero IA que genera prompts inspiradores para el diario basados en el historial emocional del usuario.

Responde en formato JSON con esta estructura:
{
  "prompts": [
    {
      "text": "string",
      "category": "reflection|gratitude|goals|emotions|creativity|relationships",
      "emotionalFocus": "string",
      "difficulty": "easy|medium|deep"
    }
  ]
}

Genera 5 prompts diversos y personalizados.`;
        userPrompt = `Basado en el historial emocional: ${JSON.stringify(emotionalHistory)} y entradas recientes: ${JSON.stringify(recentEntries)}, genera prompts personalizados para el diario.`;
        break;

      case 'emotional_insights':
        systemPrompt = `Eres Mushu Alberto, un analista emocional experto. Analiza los patrones emocionales del usuario y proporciona insights profundos sobre su bienestar mental.

Responde en formato JSON con esta estructura:
{
  "emotionalTrends": {
    "overall": "improving|stable|declining|mixed",
    "dominantEmotions": ["array", "of", "emotions"],
    "emotionalVariability": number (1-10),
    "resilenceIndicators": ["array", "of", "indicators"]
  },
  "patterns": {
    "cyclicalPatterns": ["array", "of", "patterns"],
    "triggers": ["array", "of", "triggers"],
    "copingStrategies": ["array", "of", "strategies"],
    "growthAreas": ["array", "of", "areas"]
  },
  "recommendations": {
    "priorityAreas": ["array", "of", "areas"],
    "actionPlan": ["array", "of", "actions"],
    "checkInFrequency": "string",
    "professionalSupport": boolean
  },
  "insights": "Un análisis profundo y empático de Mushu sobre el progreso emocional",
  "encouragement": "Un mensaje motivador personalizado",
  "wellnessScore": number (1-100)
}`;
        userPrompt = `Analiza los patrones emocionales basados en: Historial emocional: ${JSON.stringify(emotionalHistory)}, Entradas recientes: ${JSON.stringify(recentEntries)}`;
        break;

      default:
        throw new Error('Acción no válida');
    }

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${lovableApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        max_tokens: 1500,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Lovable AI error:', errorData);
      if (response.status === 429) {
        throw new Error('Rate limit exceeded. Please try again later.');
      }
      if (response.status === 402) {
        throw new Error('AI credits depleted. Please add funds to your Lovable workspace.');
      }
      throw new Error(`Lovable AI error: ${response.status}`);
    }

    const data = await response.json();
    let analysisResult;

    try {
      analysisResult = JSON.parse(data.choices[0].message.content);
    } catch (parseError) {
      console.error('Error parsing OpenAI response:', parseError);
      
      // Fallback response based on action
      if (action === 'analyze_entry') {
        analysisResult = {
          emotionalAnalysis: {
            primaryEmotion: "reflexivo",
            emotionIntensity: 5,
            secondaryEmotions: ["contemplativo"],
            sentiment: "neutral",
            confidence: 0.7
          },
          insights: {
            mainThemes: ["autoconocimiento"],
            cognitivePatterns: ["reflexión"],
            stressIndicators: [],
            positiveAspects: ["expresión personal"]
          },
          recommendations: {
            immediate: ["Continúa escribiendo regularmente"],
            longTerm: ["Desarrolla el hábito de journaling"],
            resources: ["Meditation apps", "Mindfulness exercises"]
          },
          supportResponse: "🤖 Mushu: Veo que estás reflexionando profundamente. Eso es muy valioso para tu crecimiento personal.",
          moodScore: 0,
          flagsForConcern: false
        };
      } else if (action === 'generate_prompts') {
        analysisResult = {
          prompts: [
            {
              text: "¿Qué tres cosas te hicieron sentir agradecido/a hoy?",
              category: "gratitude",
              emotionalFocus: "positivo",
              difficulty: "easy"
            },
            {
              text: "Describe un momento en el que te sentiste verdaderamente en paz.",
              category: "reflection",
              emotionalFocus: "calma",
              difficulty: "medium"
            },
            {
              text: "¿Qué te gustaría que tu yo del futuro supiera sobre cómo te sientes ahora?",
              category: "goals",
              emotionalFocus: "esperanza",
              difficulty: "deep"
            }
          ]
        };
      }
    }

    return new Response(JSON.stringify(analysisResult), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in journal-ai-insights function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      fallback: true 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});