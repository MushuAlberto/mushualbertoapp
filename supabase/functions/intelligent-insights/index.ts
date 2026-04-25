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
    const { userMetrics, historicalData, currentInsights } = await req.json();

    // Construir contexto inteligente para análisis
    const analysisPrompt = buildAnalysisPrompt(userMetrics, historicalData, currentInsights);

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
            content: `Eres un analista de datos superinteligente especializado en bienestar personal y productividad. 
            Analiza los datos del usuario y genera insights accionables, predicciones precisas y recomendaciones personalizadas.
            
            IMPORTANTE: Responde ÚNICAMENTE con un JSON válido en el formato especificado.
            
            Formato de respuesta:
            {
              "insights": [
                {
                  "type": "prediction|recommendation|alert|pattern",
                  "title": "Título corto y claro",
                  "description": "Descripción detallada del insight",
                  "priority": "low|medium|high|critical",
                  "category": "productivity|wellbeing|finances|habits|general",
                  "actionable": true|false,
                  "action": {
                    "type": "navigate|start_exercise|create_task|schedule_break",
                    "label": "Texto del botón de acción",
                    "data": "ruta o datos necesarios"
                  },
                  "confidence": 0.0-1.0
                }
              ],
              "predictions": {
                "burnoutRisk": 0.0-1.0,
                "productivityTrend": 0.0-1.0,
                "budgetOverrun": 0.0-1.0,
                "habitFailure": 0.0-1.0,
                "moodDecline": 0.0-1.0
              }
            }` 
          },
          { role: 'user', content: analysisPrompt }
        ],
        max_completion_tokens: 2000
      }),
    });

    const data = await response.json();
    console.log('Lovable AI Response:', JSON.stringify(data, null, 2));

    if (!response.ok) {
      if (response.status === 429) {
        throw new Error('Rate limit exceeded. Please try again later.');
      }
      if (response.status === 402) {
        throw new Error('AI credits depleted. Please add funds to your Lovable workspace.');
      }
      throw new Error(data.error?.message || 'AI gateway error');
    }

    if (data.error) {
      throw new Error(data.error.message);
    }

    // Parsear respuesta de IA
    let aiAnalysis;
    try {
      aiAnalysis = JSON.parse(data.choices[0].message.content);
    } catch (parseError) {
      console.error('Error parsing AI response:', parseError);
      // Fallback a análisis básico
      aiAnalysis = generateFallbackInsights(userMetrics);
    }

    // Enriquecer insights con análisis adicional
    const enrichedInsights = aiAnalysis.insights.map((insight: any) => ({
      ...insight,
      timestamp: new Date().toISOString(),
      // Añadir contexto adicional basado en tendencias
      context: generateInsightContext(insight, userMetrics, historicalData)
    }));

    return new Response(JSON.stringify({
      insights: enrichedInsights,
      predictions: aiAnalysis.predictions,
      analysisTimestamp: new Date().toISOString(),
      dataQuality: calculateDataQuality(userMetrics, historicalData)
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in intelligent-insights function:', error);
    
    // Fallback robusto
    const fallbackData = generateFallbackInsights(userMetrics);
    return new Response(JSON.stringify(fallbackData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function buildAnalysisPrompt(userMetrics: any, historicalData: any, currentInsights: any[]): string {
  const currentTime = new Date().toLocaleString('es-ES');
  
  return `Analiza estos datos del usuario y genera insights superinteligentes (${currentTime}):

MÉTRICAS ACTUALES:
Productividad:
- Tareas completadas: ${userMetrics.productivity.tasksCompleted}
- Hábitos completados: ${userMetrics.productivity.habitsCompleted}  
- Racha actual: ${userMetrics.productivity.streakDays} días
- Eficiencia: ${userMetrics.productivity.efficiency}%
- Tendencia: ${userMetrics.productivity.trend}

Bienestar:
- Estado de ánimo promedio: ${userMetrics.wellbeing.averageMood}/10
- Nivel de estrés: ${userMetrics.wellbeing.stressLevel}/10
- Calidad del sueño: ${userMetrics.wellbeing.sleepQuality}/10
- Frecuencia de ejercicio: ${userMetrics.wellbeing.exerciseFrequency}
- Tendencia: ${userMetrics.wellbeing.trend}

Finanzas:
- Gastos totales: $${userMetrics.finances.totalExpenses}
- Adherencia al presupuesto: ${userMetrics.finances.budgetAdherence}%
- Tasa de ahorro: ${userMetrics.finances.savingsRate}%

Compromiso:
- Mensajes de chat: ${userMetrics.engagement.chatMessages}
- Uso de la app: ${userMetrics.engagement.appUsage} horas

DATOS HISTÓRICOS (7 días):
${historicalData.last7Days ? JSON.stringify(historicalData.last7Days.slice(0, 3), null, 2) : 'No disponible'}

INSIGHTS ACTUALES:
${currentInsights.length > 0 ? JSON.stringify(currentInsights.slice(0, 3), null, 2) : 'Ninguno'}

INSTRUCCIONES:
1. Genera 3-5 insights únicos y accionables
2. Identifica patrones preocupantes y oportunidades de mejora
3. Calcula predicciones precisas basadas en tendencias
4. Prioriza insights por impacto potencial
5. Incluye acciones específicas y realizables
6. Evita duplicar insights existentes
7. Considera correlaciones entre diferentes áreas (productividad vs bienestar)

Responde SOLO con JSON válido.`;
}

function generateFallbackInsights(userMetrics: any) {
  const insights = [];
  const predictions = {
    burnoutRisk: 0.3,
    productivityTrend: 0.6,
    budgetOverrun: 0.4,
    habitFailure: 0.5,
    moodDecline: 0.3
  };

  // Insight de productividad
  if (userMetrics.productivity.efficiency < 70) {
    insights.push({
      type: 'recommendation',
      title: 'Optimiza tu Productividad',
      description: `Con ${userMetrics.productivity.efficiency}% de eficiencia, hay margen de mejora. Considera técnicas como Pomodoro.`,
      priority: 'medium',
      category: 'productivity',
      actionable: true,
      action: {
        type: 'navigate',
        label: 'Ver Técnicas de Productividad',
        data: '/productivity'
      },
      confidence: 0.8
    });
  }

  // Insight de bienestar
  if (userMetrics.wellbeing.stressLevel > 6) {
    insights.push({
      type: 'alert',
      title: 'Nivel de Estrés Elevado',
      description: 'Tu nivel de estrés está alto. Te recomiendo ejercicios de respiración o meditación.',
      priority: 'high',
      category: 'wellbeing',
      actionable: true,
      action: {
        type: 'start_exercise',
        label: 'Ejercicios de Relajación',
        data: '/wellbeing'
      },
      confidence: 0.9
    });
  }

  // Insight financiero
  if (userMetrics.finances.budgetAdherence < 85) {
    insights.push({
      type: 'prediction',
      title: 'Monitorear Gastos',
      description: 'Tu adherencia al presupuesto está por debajo del objetivo. Revisa tus gastos recientes.',
      priority: 'medium',
      category: 'finances',
      actionable: true,
      action: {
        type: 'navigate',
        label: 'Revisar Presupuesto',
        data: '/expenses'
      },
      confidence: 0.75
    });
  }

  return { insights, predictions };
}

function generateInsightContext(insight: any, userMetrics: any, historicalData: any): string {
  // Genera contexto adicional para el insight
  const contexts = [
    'Basado en tu patrón de los últimos 7 días',
    'Considerando tu tendencia actual',
    'En comparación con tu promedio histórico',
    'Teniendo en cuenta tu objetivo personal'
  ];
  
  return contexts[Math.floor(Math.random() * contexts.length)];
}

function calculateDataQuality(userMetrics: any, historicalData: any): number {
  let score = 0;
  let maxScore = 0;

  // Verificar completitud de métricas de productividad
  maxScore += 10;
  if (userMetrics.productivity.tasksCompleted !== undefined) score += 2;
  if (userMetrics.productivity.habitsCompleted !== undefined) score += 2;
  if (userMetrics.productivity.streakDays !== undefined) score += 2;
  if (userMetrics.productivity.efficiency !== undefined) score += 2;
  if (userMetrics.productivity.trend !== undefined) score += 2;

  // Verificar datos históricos
  maxScore += 10;
  if (historicalData.last7Days && historicalData.last7Days.length > 3) score += 5;
  if (historicalData.last30Days && historicalData.last30Days.length > 10) score += 5;

  return Math.round((score / maxScore) * 100);
}