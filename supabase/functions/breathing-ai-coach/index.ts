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
    const { 
      emotionalState, 
      stressLevel, 
      currentMood, 
      breathingHistory, 
      userPreferences,
      timeOfDay,
      requestType 
    } = await req.json();

    console.log('Breathing AI Coach request:', { requestType, emotionalState, stressLevel });

    let prompt = '';
    
    if (requestType === 'personalized_session') {
      prompt = `
Eres un experto en técnicas de respiración y mindfulness. Crea una sesión personalizada de respiración.

ESTADO ACTUAL DEL USUARIO:
- Estado emocional: ${emotionalState || 'neutral'}
- Nivel de estrés (1-10): ${stressLevel || 5}
- Estado ánimo actual: ${currentMood || 'neutro'}
- Hora del día: ${timeOfDay || 'no especificada'}
- Historial de respiración: ${JSON.stringify(breathingHistory?.slice(0, 5) || [])}
- Preferencias: ${JSON.stringify(userPreferences || {})}

CREA UNA SESIÓN PERSONALIZADA con el siguiente formato JSON:
{
  "sessionName": "nombre descriptivo de la sesión",
  "duration": número_en_minutos,
  "difficulty": "principiante|intermedio|avanzado",
  "techniques": [
    {
      "name": "nombre de la técnica",
      "description": "descripción clara y motivadora",
      "pattern": {
        "inhale": segundos_de_inhalación,
        "hold": segundos_de_retención,
        "exhale": segundos_de_exhalación,
        "pause": segundos_de_pausa
      },
      "cycles": número_de_ciclos,
      "instructions": ["paso 1", "paso 2", "paso 3"],
      "benefits": ["beneficio 1", "beneficio 2"],
      "mindfulnessPrompts": ["prompt 1", "prompt 2"]
    }
  ],
  "progressionTips": ["consejo 1", "consejo 2"],
  "adaptation": {
    "beginner": "adaptación para principiantes",
    "advanced": "adaptación para avanzados"
  },
  "emotionalGuidance": ["guía emocional específica"],
  "postSessionReflection": ["pregunta de reflexión 1", "pregunta de reflexión 2"]
}

Personaliza cada aspecto basándote en el estado emocional y nivel de estrés del usuario.
`;
    } else if (requestType === 'analyze_progress') {
      prompt = `
Analiza el progreso del usuario en ejercicios de respiración y proporciona insights.

DATOS DEL USUARIO:
- Historial de sesiones: ${JSON.stringify(breathingHistory || [])}
- Estado emocional promedio: ${emotionalState || 'neutral'}
- Nivel de estrés promedio: ${stressLevel || 5}

FORMATO DE RESPUESTA JSON:
{
  "progressScore": número_del_1_al_100,
  "improvements": ["mejora observada 1", "mejora observada 2"],
  "patterns": {
    "mostEffectiveTechniques": ["técnica 1", "técnica 2"],
    "optimalTimes": ["horario óptimo 1", "horario óptimo 2"],
    "consistencyLevel": "bajo|medio|alto"
  },
  "recommendations": ["recomendación 1", "recomendación 2"],
  "nextGoals": ["meta 1", "meta 2"],
  "motivationalMessage": "mensaje motivacional personalizado"
}
`;
    } else {
      // Default: technique recommendation
      prompt = `
Recomienda las mejores técnicas de respiración para el estado actual del usuario.

ESTADO DEL USUARIO:
- Emocional: ${emotionalState || 'neutral'}
- Estrés: ${stressLevel || 5}/10
- Ánimo: ${currentMood || 'neutro'}

FORMATO JSON:
{
  "recommendations": [
    {
      "name": "nombre de técnica",
      "reason": "por qué es ideal para este estado",
      "urgency": "baja|media|alta",
      "expectedBenefit": "beneficio esperado"
    }
  ],
  "immediateAction": {
    "technique": "técnica de emergencia",
    "quickSteps": ["paso rápido 1", "paso rápido 2"]
  }
}
`;
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
          { 
            role: 'system', 
            content: 'Eres un experto en técnicas de respiración, mindfulness y bienestar. Respondes únicamente con JSON válido.' 
          },
          { role: 'user', content: prompt }
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
    console.log('Breathing AI Coach response generated');

    let aiResult;
    try {
      aiResult = JSON.parse(data.choices[0].message.content);
    } catch (parseError) {
      console.error('JSON parsing error:', parseError);
      console.log('Raw response:', data.choices[0].message.content);
      
      // Fallback response based on request type
      if (requestType === 'personalized_session') {
        aiResult = {
          sessionName: "Sesión de Respiración Personalizada",
          duration: 10,
          difficulty: "intermedio",
          techniques: [{
            name: "4-7-8 Respiración",
            description: "Técnica relajante para reducir el estrés",
            pattern: { inhale: 4, hold: 7, exhale: 8, pause: 2 },
            cycles: 4,
            instructions: ["Siéntate cómodamente", "Inhala por la nariz", "Retén el aire", "Exhala por la boca"],
            benefits: ["Reduce ansiedad", "Mejora el sueño"],
            mindfulnessPrompts: ["Nota la sensación del aire", "Observa tu cuerpo relajándose"]
          }],
          progressionTips: ["Practica diariamente", "Aumenta gradualmente los ciclos"],
          adaptation: {
            beginner: "Comienza con 3 ciclos",
            advanced: "Aumenta a 8 ciclos"
          },
          emotionalGuidance: ["Permite que las emociones fluyan"],
          postSessionReflection: ["¿Cómo te sientes ahora?", "¿Qué notas en tu cuerpo?"]
        };
      } else if (requestType === 'analyze_progress') {
        aiResult = {
          progressScore: 75,
          improvements: ["Mayor consistencia en la práctica"],
          patterns: {
            mostEffectiveTechniques: ["4-7-8", "Respiración profunda"],
            optimalTimes: ["Mañana", "Antes de dormir"],
            consistencyLevel: "medio"
          },
          recommendations: ["Mantén la práctica diaria"],
          nextGoals: ["Aumentar duración de sesiones"],
          motivationalMessage: "¡Excelente progreso! Sigue así."
        };
      } else {
        aiResult = {
          recommendations: [{
            name: "Respiración 4-4-4",
            reason: "Ideal para el equilibrio emocional",
            urgency: "media",
            expectedBenefit: "Calma y concentración"
          }],
          immediateAction: {
            technique: "Respiración profunda",
            quickSteps: ["Inhala 4 segundos", "Exhala 6 segundos"]
          }
        };
      }
    }

    return new Response(JSON.stringify(aiResult), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in breathing-ai-coach function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      fallback: {
        sessionName: "Sesión Básica de Respiración",
        techniques: [{
          name: "Respiración consciente",
          pattern: { inhale: 4, hold: 4, exhale: 4, pause: 2 }
        }]
      }
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});