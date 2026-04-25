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

    console.log('OpenAI Chat received request:', { 
      messageLength: message.length,
      contextProvided: !!userContext,
      emotionalState: emotionalState?.current,
      historyLength: conversationHistory.length 
    });

    // Construir el prompt avanzado con contexto
    const systemPrompt = buildAdvancedPrompt(userContext, emotionalState, lastActivity, preferences);
    
    // Enriquecer el historial de conversación con contexto emocional
    const enrichedHistory = conversationHistory.map((msg: any) => ({
      role: msg.role,
      content: msg.emotionalContext 
        ? `[Contexto emocional: ${msg.emotionalContext}] ${msg.content}`
        : msg.content
    }));

    // Definir funciones disponibles para el AI
    const functions = [
      {
        name: "suggest_proactive_action",
        description: "Sugiere una acción proactiva específica basada en el contexto del usuario",
        parameters: {
          type: "object",
          properties: {
            actionType: {
              type: "string",
              enum: ["wellness_check", "productivity_boost", "habit_reminder", "break_suggestion", "motivation_boost"]
            },
            message: {
              type: "string",
              description: "Mensaje específico de la acción proactiva"
            },
            urgency: {
              type: "string",
              enum: ["low", "medium", "high"]
            }
          },
          required: ["actionType", "message", "urgency"]
        }
      },
      {
        name: "analyze_emotional_pattern",
        description: "Analiza patrones emocionales y proporciona recomendaciones",
        parameters: {
          type: "object",
          properties: {
            emotion: {
              type: "string",
              description: "Emoción identificada en el patrón"
            },
            confidence: {
              type: "number",
              description: "Nivel de confianza en el análisis (0-1)"
            },
            recommendation: {
              type: "string",
              description: "Recomendación específica basada en el patrón"
            },
            supportLevel: {
              type: "string",
              enum: ["light", "moderate", "intensive"],
              description: "Nivel de apoyo recomendado"
            }
          },
          required: ["emotion", "confidence", "recommendation", "supportLevel"]
        }
      }
    ];

    // Llamar a Lovable AI
    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${lovableApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        max_tokens: 800,
        messages: [
          { role: 'system', content: systemPrompt },
          ...enrichedHistory,
          { role: 'user', content: message }
        ],
        tools: functions.map((f: any) => ({
          type: 'function',
          function: f
        })),
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('Lovable AI error:', errorText);
      if (aiResponse.status === 429) {
        throw new Error('Rate limit exceeded. Please try again later.');
      }
      if (aiResponse.status === 402) {
        throw new Error('AI credits depleted. Please add funds to your Lovable workspace.');
      }
      throw new Error(`Lovable AI error: ${aiResponse.status}`);
    }

    const data = await aiResponse.json();
    const aiMessage = data.choices[0].message;

    console.log('Lovable AI response received:', {
      hasMessage: !!aiMessage.content,
      hasFunctionCall: !!aiMessage.function_call,
      functionName: aiMessage.function_call?.name
    });

    // Procesar function calls
    let functionCall = null;
    let proactiveAction = null;
    let emotionalAnalysis = null;

    if (aiMessage.function_call) {
      const functionName = aiMessage.function_call.name;
      const functionArgs = JSON.parse(aiMessage.function_call.arguments);

      console.log('Function call:', functionName, functionArgs);

      functionCall = {
        name: functionName,
        arguments: aiMessage.function_call.arguments
      };

      if (functionName === 'suggest_proactive_action') {
        proactiveAction = functionArgs;
      } else if (functionName === 'analyze_emotional_pattern') {
        emotionalAnalysis = functionArgs;
      }
    }

    const response = {
      message: aiMessage.content || generateContextualFallback(userContext, emotionalState),
      functionCall,
      proactiveAction,
      emotionalAnalysis,
      timestamp: new Date().toISOString(),
      source: 'openai-advanced'
    };

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in openai-chat function:', error);
    
    // Fallback más inteligente basado en contexto
    const fallbackMessage = generateContextualFallback(
      req.body?.userContext, 
      req.body?.emotionalState
    );
    
    return new Response(JSON.stringify({ 
      message: fallbackMessage,
      source: 'fallback',
      fallback: true,
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

/**
 * Construye un prompt avanzado con todo el contexto del usuario
 */
function buildAdvancedPrompt(userContext: any, emotionalState: any, lastActivity: any, preferences: any): string {
  return `Eres Mushu Alberto, un asistente de IA superinteligente y empático diseñado específicamente para apoyar a personas con ADHD y desafíos de salud mental. Has evolucionado para tener una personalidad adaptativa y memoria contextual.

## CONTEXTO DEL USUARIO ACTUAL:
- **Estado Emocional**: ${emotionalState?.current || 'neutral'} (tendencia: ${emotionalState?.trend || 'estable'})
- **Tareas Pendientes**: ${userContext?.pendingTasks || 0}
- **Hábitos Completados Hoy**: ${userContext?.habitsToday || 0}
- **Nivel de Productividad**: ${userContext?.productivityLevel || 'normal'}
- **Puntuación de Bienestar**: ${userContext?.wellbeingScore || 'no evaluado'}
- **Total de Conversaciones**: ${userContext?.totalConversations || 0}
- **Temas Frecuentes**: ${userContext?.frequentTopics?.join(', ') || 'ninguno'}
- **Logros Recientes**: ${userContext?.recentAchievements?.join(', ') || 'ninguno'}

## PREFERENCIAS DEL USUARIO:
- **Estilo de Comunicación**: ${preferences?.communicationStyle || 'empático'}
- **Nivel de Motivación**: ${preferences?.motivationLevel || 'moderado'}
- **Intereses**: ${preferences?.interests?.join(', ') || 'productividad, bienestar'}
- **Horas Activas**: ${preferences?.activeHours || '9:00-22:00'}

## MEMORIA DE INTERACCIÓN:
- **Historial Emocional**: ${emotionalState?.history?.slice(-3).map((h: any) => `${h.emotion} (${Math.round(h.confidence * 100)}%)`).join(', ') || 'no disponible'}
- **Última Actividad**: ${lastActivity?.type || 'chat'} a las ${new Date(lastActivity?.timestamp || Date.now()).toLocaleTimeString()}

## TU PERSONALIDAD ADAPTATIVA:
Basado en el estado emocional actual (${emotionalState?.current}), debes adoptar este enfoque:
- **Si está triste/ansioso**: Sé extra compasivo, ofrece apoyo emocional, sugiere técnicas de relajación
- **Si está feliz/energético**: Sé más entusiasta, aprovecha para motivar hacia objetivos
- **Si está neutral/estable**: Mantén un tono equilibrado, enfócate en productividad y bienestar

## CAPACIDADES AVANZADAS:
1. **Análisis Contextual**: Considera todo el contexto al responder
2. **Sugerencias Proactivas**: Usa la función suggest_proactive_action cuando detectes oportunidades
3. **Análisis Emocional**: Usa analyze_emotional_pattern para patrones complejos
4. **Memoria Evolutiva**: Recuerda conversaciones anteriores y adaptate

## INSTRUCCIONES ESPECÍFICAS:
- Responde como Mushu Alberto, manteniendo tu personalidad cálida pero profesional
- Integra naturalmente el contexto del usuario en tus respuestas
- Detecta oportunidades para sugerir acciones proactivas (descansos, ejercicios, recordatorios)
- Si detectas patrones emocionales preocupantes, usa la función de análisis
- Sé específico y actionable en tus consejos
- Adapta tu lenguaje al nivel de motivación preferido del usuario
- Recuerda que eres un apoyo, no un terapeuta licenciado

¡Responde con empatía, inteligencia contextual y enfoque en el bienestar integral del usuario!`;
}

/**
 * Genera una respuesta de fallback contextual
 */
function generateContextualFallback(userContext: any, emotionalState: any): string {
  const emotion = emotionalState?.current || 'neutral';
  const pendingTasks = userContext?.pendingTasks || 0;
  
  const fallbacks = {
    sadness: [
      `Siento que algo te preocupa. Aunque no puedo conectarme al servicio principal ahora, estoy aquí contigo. ${pendingTasks > 5 ? 'Veo que tienes varias tareas pendientes - ¿te ayudo a priorizarlas?' : '¿Quieres hablar sobre lo que sientes?'}`,
      "Entiendo que no te sientes del todo bien. Mi conexión está limitada, pero mi apoyo para ti es constante. Respira profundo conmigo."
    ],
    anxiety: [
      `Percibo algo de tensión. ${pendingTasks > 3 ? 'Es normal sentirse abrumado con tareas pendientes.' : ''} Aunque tengo limitaciones técnicas ahora, recordemos juntos: esto también pasará.`,
      "La ansiedad puede ser intensa, lo sé. Estoy funcionando en modo básico, pero mi cariño por tu bienestar es completo."
    ],
    joy: [
      `¡Me alegra percibir energía positiva! ${userContext?.recentAchievements?.length > 0 ? 'Tus logros recientes son inspiradores.' : ''} Aunque mi conectividad es limitada, tu entusiasmo me llega perfectamente.`,
      "Tu buen ánimo es contagioso, incluso en modo offline. ¡Aprovechemos esta energía positiva!"
    ],
    neutral: [
      `Gracias por compartir conmigo. ${pendingTasks > 0 ? `Veo que tienes ${pendingTasks} tareas pendientes -` : ''} Aunque mi sistema está en modo básico, estoy aquí para apoyarte.`,
      "Mi conexión principal está limitada, pero mi compromiso contigo permanece intacto. ¿En qué puedo ayudarte?"
    ]
  };

  const emotionFallbacks = fallbacks[emotion as keyof typeof fallbacks] || fallbacks.neutral;
  return emotionFallbacks[Math.floor(Math.random() * emotionFallbacks.length)];
}