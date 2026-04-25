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
      type, 
      userData, 
      recentActivity,
      currentSparkles,
      purchasedRewards 
    } = await req.json();

    console.log('Gamification AI request:', { type, currentSparkles });

    let systemPrompt = '';
    let userPrompt = '';

    if (type === 'profile-analysis') {
      systemPrompt = `Eres un experto en TDAH y gamificación adaptativa. Analiza el perfil del usuario para proporcionar insights sobre su estilo de motivación ADHD.

Considera:
- Patrones de completación de tareas
- Frecuencia de uso de recompensas
- Nivel actual de sparkles
- Actividad reciente
- Estilo de trabajo ADHD (hiperfoco, dopamina baja, etc.)

Proporciona un análisis conciso y práctico.`;

      userPrompt = `Usuario TDAH:
- Sparkles actuales: ${currentSparkles}
- Tareas completadas: ${recentActivity?.completedTasks || 0}
- Hábitos activos: ${recentActivity?.activeHabits || 0}
- Recompensas compradas: ${purchasedRewards?.length || 0}
- Última actividad: ${recentActivity?.lastActivity || 'hace varios días'}

Analiza su perfil ADHD y estilo de motivación.`;

    } else if (type === 'reward-recommendations') {
      systemPrompt = `Eres un experto en TDAH y sistemas de recompensas adaptativas. Recomienda 3-5 recompensas ESPECÍFICAS que sean más útiles para este usuario según su perfil ADHD.

Las recompensas deben ser:
- Específicas y prácticas
- Adaptadas al estilo ADHD del usuario
- Variadas en categorías (descansos, herramientas, autocuidado, motivación)
- Con costos razonables (10-80 sparkles)

Formato de respuesta esperado (JSON):
{
  "recommendations": [
    {
      "name": "Nombre de la recompensa",
      "description": "Descripción específica de cómo ayuda",
      "cost": número_sparkles,
      "category": "break|flexibility|tools|support|motivation|health|emotional|mindfulness",
      "reason": "Por qué es ideal para este usuario",
      "icon": "emoji apropiado"
    }
  ]
}`;

      userPrompt = `Usuario TDAH:
- Sparkles: ${currentSparkles}
- Nivel de actividad: ${recentActivity?.activityLevel || 'medio'}
- Desafíos principales: ${recentActivity?.challenges || 'gestión del tiempo, procrastinación'}
- Recompensas ya compradas: ${purchasedRewards?.map((r: any) => r.name).join(', ') || 'ninguna'}

Recomienda 3-5 recompensas específicas y útiles.`;

    } else if (type === 'achievement-suggestions') {
      systemPrompt = `Eres un experto en TDAH y logros adaptativos. Sugiere 3-5 logros personalizados que sean:
- Alcanzables pero desafiantes
- Adaptados al estilo ADHD
- Específicos y medibles
- Motivadores y celebratorios

Formato JSON:
{
  "achievements": [
    {
      "title": "Título del logro",
      "description": "Qué hay que hacer",
      "reward": número_sparkles,
      "difficulty": "easy|medium|hard",
      "category": "productivity|wellbeing|consistency|growth",
      "icon": "emoji"
    }
  ]
}`;

      userPrompt = `Usuario TDAH:
- Nivel actual: ${userData?.level || 'principiante'}
- Racha actual: ${userData?.streak || 0} días
- Fortalezas: ${userData?.strengths || 'motivación inicial, creatividad'}
- Áreas de mejora: ${userData?.improvements || 'consistencia, seguimiento'}

Sugiere logros personalizados alcanzables.`;

    } else if (type === 'motivation-strategy') {
      systemPrompt = `Eres un coach TDAH especializado en motivación adaptativa. Proporciona una estrategia de motivación personalizada de 3-5 puntos prácticos.

Considera:
- Necesidades de dopamina
- Fatiga ejecutiva
- Sensibilidad al rechazo (RSD)
- Perfeccionismo
- Hiperfoco vs distracción

Respuesta concisa y accionable.`;

      userPrompt = `Usuario TDAH:
- Estado actual: ${userData?.currentState || 'con baja motivación'}
- Sparkles: ${currentSparkles}
- Desafíos: ${userData?.currentChallenges || 'dificultad para empezar tareas'}
- Contexto: ${userData?.context || 'final del día laboral'}

Proporciona estrategia de motivación práctica.`;
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
        max_tokens: 800,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Lovable AI error:', response.status, errorText);
      if (response.status === 429) {
        throw new Error('Rate limit exceeded. Please try again later.');
      }
      if (response.status === 402) {
        throw new Error('AI credits depleted. Please add funds to your Lovable workspace.');
      }
      throw new Error(`Lovable AI error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    console.log('AI response generated:', aiResponse.substring(0, 100));

    // Try to parse JSON response for structured requests
    let parsedResponse = aiResponse;
    if (type === 'reward-recommendations' || type === 'achievement-suggestions') {
      try {
        // Extract JSON from markdown code blocks if present
        const jsonMatch = aiResponse.match(/```json\n([\s\S]*?)\n```/) || 
                         aiResponse.match(/```\n([\s\S]*?)\n```/) ||
                         [null, aiResponse];
        parsedResponse = JSON.parse(jsonMatch[1] || aiResponse);
      } catch (e) {
        console.error('Failed to parse JSON response:', e);
        // Return as text if parsing fails
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        data: parsedResponse,
        type 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Error in gamification-ai function:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error',
        success: false 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});
