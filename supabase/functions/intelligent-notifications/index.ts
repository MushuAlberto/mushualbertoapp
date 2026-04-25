import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

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
      userProfile = {},
      recentActivities = [],
      notificationType = 'general', // 'reminder', 'motivation', 'wellbeing', 'achievement'
      context = {}
    } = await req.json();

    console.log('Generating intelligent notification:', { notificationType, userProfile });

    const systemPrompt = `Eres un asistente de notificaciones inteligente especializado en ADHD.
Tu trabajo es crear notificaciones personalizadas, motivadoras y efectivas para personas con ADHD.

Características de notificaciones efectivas para ADHD:
- Breves y directas (máximo 2-3 líneas)
- Positivas y motivadoras
- Específicas y accionables
- Con emojis relevantes
- Evitar sobrecarga de información
- Usar lenguaje amigable y cercano

Tipos de notificación:
- reminder: Recordatorios de tareas/hábitos
- motivation: Mensajes motivacionales
- wellbeing: Recordatorios de bienestar (respiración, pausas)
- achievement: Celebración de logros
- general: Mensajes generales personalizados`;

    let userPrompt = '';

    switch (notificationType) {
      case 'reminder':
        userPrompt = `Crea un recordatorio motivador para: ${context.task || 'completar tareas pendientes'}.
Hazlo breve, positivo y con un emoji apropiado.`;
        break;
      
      case 'motivation':
        userPrompt = `El usuario ha estado activo recientemente: ${recentActivities.slice(0, 3).map(a => a.type).join(', ')}.
Crea un mensaje motivacional breve que reconozca su esfuerzo y lo anime a continuar.`;
        break;
      
      case 'wellbeing':
        userPrompt = `Crea un recordatorio de bienestar personalizado.
Sugerencias: ejercicios de respiración, pausa activa, hidratación, o movimiento.
Debe ser breve, amigable y con un emoji apropiado.`;
        break;
      
      case 'achievement':
        userPrompt = `El usuario acaba de: ${context.achievement || 'completar una tarea'}.
Crea un mensaje de celebración breve y entusiasta con emojis.`;
        break;
      
      default:
        userPrompt = `Crea una notificación personalizada y motivadora basada en el perfil del usuario.
Contexto adicional: ${JSON.stringify(context)}`;
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.8,
        max_tokens: 150,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    const notificationContent = data.choices[0].message.content.trim();

    // Generate optimal timing suggestion
    const currentHour = new Date().getHours();
    let optimalTiming = 'now';
    
    if (notificationType === 'wellbeing') {
      // Wellbeing notifications better in mid-morning or mid-afternoon
      if (currentHour < 10) optimalTiming = '10:00';
      else if (currentHour < 15) optimalTiming = '15:00';
      else optimalTiming = 'tomorrow 10:00';
    } else if (notificationType === 'reminder') {
      // Reminders better at start of day or after lunch
      if (currentHour < 9) optimalTiming = '09:00';
      else if (currentHour < 14) optimalTiming = '14:00';
      else optimalTiming = 'tomorrow 09:00';
    }

    const result = {
      notification: {
        title: notificationType === 'achievement' ? '🎉 ¡Logro Desbloqueado!' : 
               notificationType === 'wellbeing' ? '💚 Momento de Bienestar' :
               notificationType === 'motivation' ? '⭐ ¡Sigue Así!' :
               '🔔 Recordatorio',
        body: notificationContent,
        timestamp: new Date().toISOString(),
        type: notificationType,
        priority: notificationType === 'achievement' ? 'high' : 
                 notificationType === 'reminder' ? 'medium' : 'low'
      },
      optimalTiming,
      suggestions: {
        frequency: notificationType === 'wellbeing' ? 'every 2 hours' :
                   notificationType === 'motivation' ? 'daily' :
                   notificationType === 'reminder' ? 'as needed' : 'flexible'
      }
    };

    console.log('Generated notification:', result);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in intelligent-notifications function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      notification: {
        title: '🔔 Recordatorio',
        body: '¡Recuerda tomarte un momento para ti! 💙',
        timestamp: new Date().toISOString(),
        type: 'general',
        priority: 'low'
      }
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
