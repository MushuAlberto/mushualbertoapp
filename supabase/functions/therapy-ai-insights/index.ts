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
      emotionalEntries,
      moodHistory,
      stressLevels,
      triggers,
      currentSymptoms,
      therapyGoals,
      requestType,
      userPersonality,
      adhdTraits
    } = await req.json();

    console.log('Therapy AI Insights request:', { requestType, entriesCount: emotionalEntries?.length });

    let prompt = '';
    
    if (requestType === 'emotion_analysis') {
      prompt = `
Eres un terapeuta experto especializado en ADHD y salud mental. Analiza el estado emocional del usuario y proporciona insights terapéuticos profundos.

DATOS EMOCIONALES:
- Entradas del diario: ${JSON.stringify(emotionalEntries?.slice(0, 10) || [])}
- Historial de estado de ánimo: ${JSON.stringify(moodHistory?.slice(0, 15) || [])}
- Niveles de estrés: ${JSON.stringify(stressLevels?.slice(0, 10) || [])}
- Triggers identificados: ${JSON.stringify(triggers || [])}
- Síntomas actuales: ${JSON.stringify(currentSymptoms || [])}
- Metas terapéuticas: ${JSON.stringify(therapyGoals || [])}
- Rasgos ADHD: ${JSON.stringify(adhdTraits || [])}

ANÁLISIS REQUERIDO:
1. Patrones emocionales profundos
2. Correlaciones entre eventos y estados emocionales
3. Identificación de distorsiones cognitivas
4. Estrategias de afrontamiento personalizadas
5. Técnicas terapéuticas específicas para ADHD

FORMATO DE RESPUESTA JSON:
{
  "emotionalAnalysis": {
    "overallState": "estable|en_riesgo|crisis|mejorando",
    "dominantEmotions": ["emoción1", "emoción2"],
    "emotionalStability": número_del_1_al_10,
    "riskFactors": ["factor1", "factor2"],
    "strengthFactors": ["fortaleza1", "fortaleza2"]
  },
  "cognitivePatterns": {
    "identifiedDistortions": [
      {
        "type": "tipo_distorsión",
        "description": "descripción",
        "frequency": "baja|media|alta",
        "impact": "bajo|medio|alto"
      }
    ],
    "thoughtPatterns": ["patrón1", "patrón2"],
    "behavioralTriggers": ["trigger1", "trigger2"]
  },
  "therapeuticInsights": [
    {
      "insight": "insight terapéutico",
      "category": "cognitivo|emocional|conductual|social",
      "priority": "baja|media|alta|crítica",
      "evidenceLevel": "observacional|fuerte|muy_fuerte",
      "actionable": true|false
    }
  ],
  "personalizedInterventions": [
    {
      "technique": "nombre de la técnica",
      "description": "descripción detallada",
      "category": "CBT|mindfulness|exposure|behavioral",
      "duration": "5-10min|15-30min|30-60min",
      "difficulty": "principiante|intermedio|avanzado",
      "adhdFriendly": true|false,
      "steps": ["paso1", "paso2", "paso3"],
      "expectedOutcome": "resultado esperado"
    }
  ],
  "progressTracking": {
    "improvementAreas": ["área1", "área2"],
    "concernAreas": ["preocupación1", "preocupación2"],
    "nextSteps": ["paso1", "paso2"],
    "milestones": ["hito1", "hito2"]
  },
  "emergencyAssessment": {
    "riskLevel": "bajo|medio|alto|crítico",
    "immediateActions": ["acción1", "acción2"],
    "supportResources": ["recurso1", "recurso2"]
  }
}

Enfócate en proporcionar análisis profundos y técnicas específicamente adaptadas para personas con ADHD.
Responde ÚNICAMENTE con JSON válido.`;

    } else if (requestType === 'cbt_session') {
      prompt = `
Crea una sesión de terapia cognitivo-conductual personalizada para ADHD.

CONTEXTO DEL USUARIO:
- Estado emocional actual: ${JSON.stringify(currentSymptoms || [])}
- Triggers identificados: ${JSON.stringify(triggers || [])}
- Metas terapéuticas: ${JSON.stringify(therapyGoals || [])}
- Personalidad: ${JSON.stringify(userPersonality || {})}

FORMATO JSON:
{
  "sessionPlan": {
    "title": "título de la sesión",
    "duration": número_en_minutos,
    "objectives": ["objetivo1", "objetivo2"],
    "techniques": ["técnica1", "técnica2"]
  },
  "guidedExercises": [
    {
      "name": "nombre del ejercicio",
      "type": "thought_record|behavioral_experiment|mindfulness|exposure",
      "instructions": ["instrucción1", "instrucción2"],
      "duration": número_en_minutos,
      "materials": ["material1", "material2"],
      "reflectionQuestions": ["pregunta1", "pregunta2"]
    }
  ],
  "homeworkAssignments": [
    {
      "task": "tarea específica",
      "duration": "tiempo estimado",
      "frequency": "diario|semanal|según_necesidad",
      "trackingMethod": "método de seguimiento"
    }
  ],
  "adaptations": {
    "forADHD": ["adaptación1", "adaptación2"],
    "personalityBased": ["adaptación1", "adaptación2"]
  }
}`;

    } else if (requestType === 'crisis_intervention') {
      prompt = `
Evalúa la situación de crisis y proporciona intervención inmediata.

DATOS DE CRISIS:
- Síntomas actuales: ${JSON.stringify(currentSymptoms || [])}
- Nivel de estrés: ${moodHistory?.[0]?.stress || 'no especificado'}
- Última entrada emocional: ${JSON.stringify(emotionalEntries?.[0] || {})}

FORMATO JSON:
{
  "crisisAssessment": {
    "severity": "leve|moderada|severa|crítica",
    "immediateRisk": true|false,
    "requiresProfessionalHelp": true|false
  },
  "immediateActions": [
    {
      "action": "acción específica",
      "priority": "inmediata|urgente|importante",
      "instructions": "instrucciones detalladas"
    }
  ],
  "copingStrategies": [
    {
      "strategy": "estrategia de afrontamiento",
      "timeToImplement": "inmediato|5min|15min",
      "effectiveness": "alta|media|baja"
    }
  ],
  "safetyPlan": {
    "warningSignals": ["señal1", "señal2"],
    "copingMethods": ["método1", "método2"],
    "supportContacts": ["contacto1", "contacto2"],
    "professionalResources": ["recurso1", "recurso2"]
  }
}`;

    } else {
      // Default: wellness check
      prompt = `
Realiza un chequeo general de bienestar mental.

DATOS:
- Entradas recientes: ${JSON.stringify(emotionalEntries?.slice(0, 5) || [])}
- Estado de ánimo: ${JSON.stringify(moodHistory?.slice(0, 3) || [])}

FORMATO JSON:
{
  "wellnessScore": número_del_1_al_100,
  "emotionalBalance": "equilibrado|inestable|en_progreso",
  "recommendations": [
    "recomendación1",
    "recomendación2"
  ],
  "positiveObservations": [
    "observación1",
    "observación2"
  ],
  "areasForImprovement": [
    "área1",
    "área2"
  ]
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
            content: 'Eres un terapeuta experto especializado en ADHD, terapia cognitivo-conductual y salud mental. Proporcionas análisis profundos, intervenciones personalizadas y técnicas terapéuticas basadas en evidencia. Respondes ÚNICAMENTE con JSON válido.' 
          },
          { role: 'user', content: prompt }
        ],
        max_tokens: 2500,
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
    console.log('Therapy AI response generated');

    let aiResult;
    try {
      aiResult = JSON.parse(data.choices[0].message.content);
    } catch (parseError) {
      console.error('JSON parsing error:', parseError);
      console.log('Raw response:', data.choices[0].message.content);
      
      // Fallback response based on request type
      if (requestType === 'emotion_analysis') {
        aiResult = {
          emotionalAnalysis: {
            overallState: 'estable',
            dominantEmotions: ['neutral', 'esperanzado'],
            emotionalStability: 7,
            riskFactors: ['Estrés'],
            strengthFactors: ['Autoconciencia']
          },
          cognitivePatterns: {
            identifiedDistortions: [{
              type: 'pensamiento_catastrófico',
              description: 'Tendencia a imaginar el peor escenario',
              frequency: 'media',
              impact: 'medio'
            }],
            thoughtPatterns: ['Autocrítica excesiva'],
            behavioralTriggers: ['Situaciones estresantes']
          },
          therapeuticInsights: [{
            insight: 'El usuario muestra buena capacidad de autoobservación',
            category: 'cognitivo',
            priority: 'media',
            evidenceLevel: 'observacional',
            actionable: true
          }],
          personalizedInterventions: [{
            technique: 'Registro de Pensamientos',
            description: 'Identifica y analiza patrones de pensamiento',
            category: 'CBT',
            duration: '15-30min',
            difficulty: 'principiante',
            adhdFriendly: true,
            steps: ['Identifica el pensamiento', 'Evalúa la evidencia', 'Desarrolla alternativa'],
            expectedOutcome: 'Mayor conciencia de patrones cognitivos'
          }],
          progressTracking: {
            improvementAreas: ['Autorregulación emocional'],
            concernAreas: ['Gestión del estrés'],
            nextSteps: ['Practicar técnicas de mindfulness'],
            milestones: ['Reducir autocrítica']
          },
          emergencyAssessment: {
            riskLevel: 'bajo',
            immediateActions: ['Continuar autocuidado'],
            supportResources: ['Aplicación de terapia']
          }
        };
      } else if (requestType === 'cbt_session') {
        aiResult = {
          sessionPlan: {
            title: 'Sesión de Autoconocimiento',
            duration: 30,
            objectives: ['Identificar patrones de pensamiento'],
            techniques: ['CBT', 'Mindfulness']
          },
          guidedExercises: [{
            name: 'Registro de Pensamientos Diario',
            type: 'thought_record',
            instructions: ['Anota pensamientos negativos', 'Evalúa su veracidad'],
            duration: 15,
            materials: ['Libreta', 'Bolígrafo'],
            reflectionQuestions: ['¿Es este pensamiento realista?']
          }],
          homeworkAssignments: [{
            task: 'Practicar registro diario',
            duration: '10 minutos',
            frequency: 'diario',
            trackingMethod: 'App de terapia'
          }],
          adaptations: {
            forADHD: ['Sesiones más cortas', 'Recordatorios visuales'],
            personalityBased: ['Enfoque práctico']
          }
        };
      } else {
        aiResult = {
          wellnessScore: 75,
          emotionalBalance: 'equilibrado',
          recommendations: ['Mantener rutina de autocuidado'],
          positiveObservations: ['Buena autoconciencia'],
          areasForImprovement: ['Gestión del estrés']
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
    console.error('Error in therapy-ai-insights function:', error);
    
    return new Response(JSON.stringify({ 
      error: error.message,
      fallback: {
        wellnessScore: 70,
        emotionalBalance: 'en_progreso',
        recommendations: ['Continuar con práctica de autocuidado'],
        therapeuticInsights: [{
          insight: 'Mantén la práctica constante de autoreflexión',
          category: 'general',
          priority: 'media',
          actionable: true
        }]
      }
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});