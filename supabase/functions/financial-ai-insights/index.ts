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
      transactions, 
      categories, 
      budget,
      currentBalance,
      monthlyIncome,
      financialGoals,
      requestType,
      timeRange
    } = await req.json();

    console.log('Financial AI Insights request:', { requestType, transactionCount: transactions?.length });

    let prompt = '';
    
    if (requestType === 'spending_analysis') {
      prompt = `
Eres un asesor financiero experto especializado en análisis de gastos para personas con ADHD. 
Analiza los patrones de gasto y proporciona insights inteligentes y accionables.

DATOS FINANCIEROS:
- Transacciones recientes: ${JSON.stringify(transactions?.slice(0, 20) || [])}
- Categorías de gasto: ${JSON.stringify(categories || {})}
- Presupuesto mensual: $${budget || 0}
- Balance actual: $${currentBalance || 0}
- Ingresos mensuales: $${monthlyIncome || 0}
- Metas financieras: ${JSON.stringify(financialGoals || [])}
- Período de análisis: ${timeRange || '30 días'}

ANÁLISIS REQUERIDO:
1. Patrones de gasto impulsivo (común en ADHD)
2. Categorías donde se excede el presupuesto
3. Tendencias y variaciones semanales/mensuales
4. Predicciones para el próximo mes
5. Recomendaciones específicas para ADHD

FORMATO DE RESPUESTA JSON:
{
  "insights": [
    {
      "type": "pattern|alert|recommendation|prediction",
      "title": "Título del insight",
      "description": "Descripción detallada",
      "category": "spending|budget|saving|income",
      "priority": "low|medium|high|critical",
      "amount": número_impacto_financiero,
      "actionable": true|false,
      "action": {
        "type": "set_alert|create_budget|review_category|schedule_review",
        "label": "Texto del botón",
        "data": {}
      },
      "confidence": 0.0-1.0
    }
  ],
  "spendingPatterns": {
    "impulsiveSpending": {
      "frequency": "bajo|medio|alto",
      "totalAmount": número,
      "commonTriggers": ["trigger1", "trigger2"],
      "peakTimes": ["hora/día de mayor gasto impulsivo"]
    },
    "categoryBreakdown": {
      "categoria": {
        "spent": número_gastado,
        "budgeted": número_presupuestado,
        "variance": porcentaje_variación,
        "trend": "increasing|stable|decreasing"
      }
    },
    "monthlyProjection": {
      "estimatedSpending": número,
      "budgetOverrun": número,
      "savingsPotential": número
    }
  },
  "recommendations": [
    {
      "title": "Recomendación específica",
      "description": "Cómo implementarla paso a paso",
      "expectedSaving": número,
      "difficulty": "fácil|medio|difícil",
      "timeToImplement": "inmediato|1-7días|1mes",
      "adhdFriendly": true|false
    }
  ],
  "alerts": [
    {
      "type": "overspending|unusual_pattern|goal_deviation",
      "message": "Mensaje de alerta",
      "severity": "info|warning|critical"
    }
  ]
}

Responde ÚNICAMENTE con JSON válido. Enfócate en insights prácticos para personas con ADHD.`;

    } else if (requestType === 'budget_optimization') {
      prompt = `
Optimiza el presupuesto basándote en los patrones de gasto reales del usuario.

DATOS:
- Transacciones: ${JSON.stringify(transactions?.slice(0, 15) || [])}
- Presupuesto actual: ${JSON.stringify(budget || {})}
- Ingresos: $${monthlyIncome || 0}

FORMATO JSON:
{
  "optimizedBudget": {
    "categoria": {
      "current": número_actual,
      "recommended": número_recomendado,
      "reason": "razón del cambio"
    }
  },
  "budgetingTips": [
    {
      "tip": "Consejo específico",
      "category": "categoria afectada",
      "impact": "alto|medio|bajo"
    }
  ],
  "savingsOpportunities": [
    {
      "area": "área de ahorro",
      "potentialSaving": número,
      "howTo": "cómo lograr el ahorro"
    }
  ]
}`;

    } else if (requestType === 'goal_tracking') {
      prompt = `
Analiza el progreso hacia las metas financieras y proporciona guidance.

DATOS:
- Metas financieras: ${JSON.stringify(financialGoals || [])}
- Transacciones recientes: ${JSON.stringify(transactions?.slice(0, 10) || [])}
- Balance actual: $${currentBalance || 0}

FORMATO JSON:
{
  "goalProgress": [
    {
      "goalName": "nombre de la meta",
      "currentProgress": porcentaje,
      "onTrack": true|false,
      "estimatedCompletion": "fecha estimada",
      "adjustments": "ajustes recomendados"
    }
  ],
  "motivationalInsights": [
    "insight motivacional 1",
    "insight motivacional 2"
  ],
  "nextSteps": [
    "paso siguiente 1",
    "paso siguiente 2"
  ]
}`;

    } else {
      // Default: financial health check
      prompt = `
Realiza un chequeo de salud financiera general.

DATOS:
- Balance: $${currentBalance || 0}
- Ingresos: $${monthlyIncome || 0}
- Gastos recientes: ${JSON.stringify(transactions?.slice(0, 10) || [])}

FORMATO JSON:
{
  "healthScore": número_del_1_al_100,
  "strengths": ["fortaleza 1", "fortaleza 2"],
  "concerns": ["preocupación 1", "preocupación 2"],
  "quickWins": ["acción rápida 1", "acción rápida 2"],
  "summary": "resumen general de la salud financiera"
}`;
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
            content: 'Eres un asesor financiero experto especializado en finanzas personales para personas con ADHD. Proporcionas consejos prácticos, realistas y fáciles de implementar. Respondes ÚNICAMENTE con JSON válido.' 
          },
          { role: 'user', content: prompt }
        ],
        max_tokens: 2000,
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
    console.log('Financial AI response generated');

    let aiResult;
    try {
      aiResult = JSON.parse(data.choices[0].message.content);
    } catch (parseError) {
      console.error('JSON parsing error:', parseError);
      console.log('Raw response:', data.choices[0].message.content);
      
      // Fallback response based on request type
      if (requestType === 'spending_analysis') {
        aiResult = {
          insights: [{
            type: 'recommendation',
            title: 'Revisar Gastos Frecuentes',
            description: 'Identifica patrones de gasto que podrían optimizarse.',
            category: 'spending',
            priority: 'medium',
            amount: 0,
            actionable: true,
            action: {
              type: 'review_category',
              label: 'Revisar Categorías',
              data: {}
            },
            confidence: 0.8
          }],
          spendingPatterns: {
            impulsiveSpending: {
              frequency: 'medio',
              totalAmount: 0,
              commonTriggers: ['Estrés', 'Aburrimiento'],
              peakTimes: ['Fines de semana']
            },
            categoryBreakdown: {},
            monthlyProjection: {
              estimatedSpending: currentBalance || 0,
              budgetOverrun: 0,
              savingsPotential: 100
            }
          },
          recommendations: [{
            title: 'Establece Límites Diarios',
            description: 'Define un límite de gasto diario para evitar excesos.',
            expectedSaving: 50,
            difficulty: 'fácil',
            timeToImplement: 'inmediato',
            adhdFriendly: true
          }],
          alerts: []
        };
      } else {
        aiResult = {
          healthScore: 70,
          strengths: ['Control de gastos básico'],
          concerns: ['Falta de presupuesto detallado'],
          quickWins: ['Definir categorías de gasto'],
          summary: 'Salud financiera estable con oportunidades de mejora.'
        };
      }
    }

    return new Response(JSON.stringify({
      ...aiResult,
      analysisTimestamp: new Date().toISOString(),
      requestType
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in financial-ai-insights function:', error);
    
    return new Response(JSON.stringify({ 
      error: error.message,
      fallback: {
        healthScore: 60,
        insights: [],
        recommendations: [{
          title: 'Mantén un Registro de Gastos',
          description: 'Registra todos tus gastos para obtener mejor análisis.',
          expectedSaving: 0,
          difficulty: 'fácil',
          timeToImplement: 'inmediato',
          adhdFriendly: true
        }]
      }
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});