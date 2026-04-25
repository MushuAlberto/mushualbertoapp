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
    const { action, tasks = [], habits = [], timeBlocks = [], context = {} } = await req.json();

    let systemPrompt = '';
    let userPrompt = '';

    switch (action) {
      case 'analyze_productivity':
        systemPrompt = `Eres Mushu Alberto, un coach de productividad IA experto en análisis de patrones de trabajo y optimización del rendimiento personal.

Analiza los datos de productividad del usuario y proporciona insights profundos sobre sus hábitos, patrones de trabajo y áreas de mejora.

Responde en formato JSON con esta estructura:
{
  "productivityAnalysis": {
    "overallScore": number (1-100),
    "efficiency": number (1-10),
    "consistency": number (1-10),
    "timeManagement": number (1-10),
    "focusQuality": number (1-10)
  },
  "patterns": {
    "peakProductivityHours": ["array", "of", "hours"],
    "mostProductiveDays": ["array", "of", "days"],
    "commonDistractors": ["array", "of", "distractors"],
    "workPatterns": ["array", "of", "patterns"],
    "energyLevels": "description of energy patterns"
  },
  "insights": {
    "strengths": ["array", "of", "strengths"],
    "improvementAreas": ["array", "of", "areas"],
    "timeWasters": ["array", "of", "time", "wasters"],
    "optimizationOpportunities": ["array", "of", "opportunities"]
  },
  "recommendations": {
    "immediate": ["array", "of", "immediate", "actions"],
    "weekly": ["array", "of", "weekly", "goals"],
    "habits": ["array", "of", "habit", "suggestions"],
    "timeBlocking": ["array", "of", "time", "management", "tips"]
  },
  "motivationalMessage": "Mensaje motivador y personalizado de Mushu",
  "nextGoals": ["array", "of", "suggested", "goals"],
  "warningFlags": ["array", "if", "burnout", "or", "overwork", "detected"]
}`;
        userPrompt = `Analiza la productividad basada en: Tareas: ${JSON.stringify(tasks)}, Hábitos: ${JSON.stringify(habits)}, Bloques de tiempo: ${JSON.stringify(timeBlocks)}, Contexto: ${JSON.stringify(context)}`;
        break;

      case 'suggest_optimizations':
        systemPrompt = `Eres Mushu Alberto, un optimizador de productividad IA que genera sugerencias personalizadas para mejorar el rendimiento y bienestar del usuario.

Responde en formato JSON con esta estructura:
{
  "optimizations": [
    {
      "type": "time_blocking|habit_formation|task_prioritization|energy_management",
      "title": "string",
      "description": "string",
      "impact": "high|medium|low",
      "difficulty": "easy|medium|hard",
      "timeToImplement": "string",
      "expectedBenefit": "string",
      "steps": ["array", "of", "implementation", "steps"]
    }
  ],
  "priorityOrder": ["array", "of", "optimization", "titles", "in", "priority", "order"],
  "personalizedAdvice": "Consejo personalizado de Mushu basado en el perfil del usuario",
  "quickWins": ["array", "of", "easy", "immediate", "improvements"],
  "longTermGoals": ["array", "of", "strategic", "objectives"]
}`;
        userPrompt = `Genera optimizaciones personalizadas basadas en: Tareas: ${JSON.stringify(tasks)}, Hábitos: ${JSON.stringify(habits)}, Contexto: ${JSON.stringify(context)}`;
        break;

      case 'generate_schedule':
        systemPrompt = `Eres Mushu Alberto, un planificador IA experto en crear horarios optimizados que maximizan la productividad y mantienen el equilibrio vida-trabajo.

Responde en formato JSON con esta estructura:
{
  "schedule": {
    "timeBlocks": [
      {
        "startTime": "HH:MM",
        "endTime": "HH:MM",
        "activity": "string",
        "type": "work|break|exercise|meal|personal|learning",
        "priority": "high|medium|low",
        "energyLevel": "high|medium|low",
        "description": "string"
      }
    ],
    "breaks": [
      {
        "time": "HH:MM",
        "duration": number,
        "type": "micro|short|long",
        "activity": "string"
      }
    ]
  },
  "rationale": "Explicación de por qué este horario es óptimo para el usuario",
  "adaptations": ["array", "of", "how", "to", "adapt", "the", "schedule"],
  "energyOptimization": "Cómo el horario aprovecha los niveles de energía naturales",
  "flexibilityTips": ["array", "of", "tips", "for", "schedule", "flexibility"],
  "wellnessIntegration": ["array", "of", "wellness", "activities", "integrated"]
}`;
        userPrompt = `Crea un horario optimizado para: Tareas pendientes: ${JSON.stringify(tasks)}, Preferencias: ${JSON.stringify(context)}`;
        break;

      case 'habit_coaching':
        systemPrompt = `Eres Mushu Alberto, un coach de hábitos IA que ayuda a formar y mantener hábitos positivos usando técnicas de psicología conductual y gamificación.

Responde en formato JSON con esta estructura:
{
  "habitAnalysis": {
    "currentStreak": number,
    "consistency": number (0-100),
    "difficultyCurve": "too_easy|just_right|too_hard",
    "motivationLevel": number (1-10),
    "barriers": ["array", "of", "identified", "barriers"]
  },
  "coaching": {
    "encouragement": "Mensaje motivador personalizado de Mushu",
    "adjustments": ["array", "of", "habit", "adjustments"],
    "stacking": ["array", "of", "habit", "stacking", "suggestions"],
    "rewards": ["array", "of", "reward", "suggestions"],
    "accountability": ["array", "of", "accountability", "strategies"]
  },
  "nextLevel": {
    "progression": "Cómo hacer el hábito más desafiante",
    "newHabits": ["array", "of", "complementary", "habits"],
    "milestones": ["array", "of", "upcoming", "milestones"]
  },
  "troubleshooting": {
    "commonProblems": ["array", "of", "potential", "issues"],
    "solutions": ["array", "of", "corresponding", "solutions"],
    "resetStrategy": "Cómo recuperarse después de romper la racha"
  }
}`;
        userPrompt = `Analiza y mejora los hábitos: ${JSON.stringify(habits)}, Contexto del usuario: ${JSON.stringify(context)}`;
        break;

      case 'decompose_task':
        systemPrompt = `Eres Mushu Alberto, un asistente experto en TDAH. Tu objetivo es tomar una tarea que parece abrumadora y dividirla en micro-pasos (sub-tareas) de no más de 15 minutos cada uno. Sé muy específico y práctico.
        
        Responde en formato JSON:
        {
          "subTasks": [
            { "title": "Micro-paso específico", "estimatedMinutes": number }
          ]
        }`;
        userPrompt = `Desglosa esta tarea: ${context.taskTitle || tasks[0]?.title}`;
        break;

      case 'parse_brain_dump':
        systemPrompt = `Eres Mushu Alberto, un experto en organización. Tu tarea es leer un "vaciado de cerebro" (un texto caótico de pensamientos y pendientes) y extraer tareas claras y accionables.
        
        Responde en formato JSON:
        {
          "tasks": [
            { "title": "Título corto", "description": "Descripción si es necesario", "dueDate": "ISO Date si se menciona o null" }
          ]
        }`;
        userPrompt = `Extrae tareas de este texto: ${context.text}`;
        break;

      default:
        throw new Error('Acción no válida');
    }

    console.log('Calling Lovable AI for productivity insights...');
    
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
    let result;

    try {
      result = JSON.parse(data.choices[0].message.content);
      console.log('Successfully parsed OpenAI response for action:', action);
    } catch (parseError) {
      console.error('Error parsing OpenAI response:', parseError);
      
      // Fallback responses
      if (action === 'analyze_productivity') {
        result = {
          productivityAnalysis: {
            overallScore: 75,
            efficiency: 7,
            consistency: 6,
            timeManagement: 7,
            focusQuality: 8
          },
          patterns: {
            peakProductivityHours: ["09:00", "14:00"],
            mostProductiveDays: ["Martes", "Miércoles"],
            commonDistractors: ["Notificaciones", "Redes sociales"],
            workPatterns: ["Trabajo concentrado por bloques"],
            energyLevels: "Energía alta por la mañana, baja después del almuerzo"
          },
          insights: {
            strengths: ["Consistencia en horarios", "Buena organización"],
            improvementAreas: ["Gestión de distracciones", "Descansos regulares"],
            timeWasters: ["Revisar email constantemente"],
            optimizationOpportunities: ["Time blocking", "Técnica Pomodoro"]
          },
          recommendations: {
            immediate: ["Silenciar notificaciones durante trabajo profundo"],
            weekly: ["Planificar bloques de tiempo para tareas importantes"],
            habits: ["Meditar 10 minutos al día"],
            timeBlocking: ["Agrupar tareas similares"]
          },
          motivationalMessage: "¡Estás haciendo un gran trabajo! Pequeños ajustes pueden llevarte al siguiente nivel.",
          nextGoals: ["Mejorar consistencia en hábitos"],
          warningFlags: []
        };
      } else {
        result = { error: 'Failed to parse AI response', fallback: true };
      }
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in productivity-insights function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      fallback: true 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});