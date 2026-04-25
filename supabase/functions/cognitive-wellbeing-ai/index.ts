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
      gameResults,
      userProfile,
      cognitiveHistory,
      analysisType = 'performance_analysis'
    } = await req.json();

    console.log('Cognitive wellbeing analysis request:', { 
      gameResultsCount: gameResults?.length,
      analysisType,
      userProfileId: userProfile?.id
    });

    let systemPrompt = '';
    let userPrompt = '';

    switch (analysisType) {
      case 'performance_analysis':
        systemPrompt = `You are a cognitive wellness AI specialized in ADHD brain training and neuroplasticity. 
        
        Your expertise includes:
        - Cognitive assessment and training for ADHD brains
        - Neuroplasticity principles and brain training
        - Executive function development
        - Attention and working memory enhancement
        - Processing speed and cognitive flexibility training
        - ADHD-specific cognitive patterns and challenges

        Analysis Guidelines:
        - Focus on ADHD cognitive strengths and challenges
        - Provide specific, actionable recommendations
        - Consider dopamine regulation in suggestions
        - Emphasize progress over perfection
        - Account for ADHD variability and fluctuations
        - Suggest optimal training schedules for ADHD brains`;

        userPrompt = `User Profile: ${JSON.stringify(userProfile)}
Recent Game Results: ${JSON.stringify(gameResults)}
Cognitive History: ${JSON.stringify(cognitiveHistory?.slice(-10))}

Analyze the cognitive performance and provide:
1. Current cognitive strengths and areas for improvement
2. ADHD-specific patterns identified in gameplay
3. Personalized difficulty recommendations
4. Optimal game selection for cognitive development
5. Training schedule suggestions for ADHD brain
6. Progress indicators and milestones
7. Motivational strategies tailored to ADHD`;
        break;

      case 'difficulty_adjustment':
        systemPrompt = `You are an adaptive difficulty AI that personalizes cognitive training for ADHD individuals.`;
        
        userPrompt = `Current Performance: ${JSON.stringify(gameResults?.slice(-5))}
User ADHD Profile: ${JSON.stringify(userProfile)}

Provide difficulty adjustments for each game category:
1. Attention games - current optimal difficulty level
2. Memory games - progression recommendations
3. Reasoning games - complexity adjustments
4. Coordination games - speed and accuracy balance
5. Visuospatial games - spatial complexity recommendations

Include:
- Specific difficulty parameters for each game
- Rationale for adjustments based on ADHD patterns
- Timeline for reassessment
- Warning signs to watch for over/under-stimulation`;
        break;

      case 'cognitive_insights':
        systemPrompt = `You are a neuropsychologist AI providing insights into ADHD cognitive patterns and development.`;
        
        userPrompt = `Cognitive Performance Data: ${JSON.stringify(gameResults)}
User Context: ${JSON.stringify(userProfile)}
Historical Trends: ${JSON.stringify(cognitiveHistory)}

Provide detailed cognitive insights:
1. Executive function assessment based on game performance
2. Working memory capacity and efficiency analysis
3. Attention span and focus quality indicators
4. Processing speed evaluation
5. Cognitive flexibility and set-shifting abilities
6. Pattern recognition and learning adaptation
7. Recommendations for real-world cognitive enhancement`;
        break;

      case 'wellness_recommendations':
        systemPrompt = `You are a holistic wellness AI specializing in ADHD brain health and cognitive optimization.`;
        
        userPrompt = `Performance Data: ${JSON.stringify(gameResults)}
User Profile: ${JSON.stringify(userProfile)}

Generate personalized wellness recommendations:
1. Optimal brain training schedule for ADHD
2. Complementary lifestyle interventions
3. Nutrition recommendations for cognitive health
4. Exercise suggestions for executive function
5. Sleep optimization for ADHD brains
6. Stress management techniques
7. Environmental modifications for focus
8. Supplement considerations (general wellness only)`;
        break;
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
        max_tokens: 1200,
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
    const analysis = data.choices[0].message.content;

    console.log('Cognitive analysis completed successfully');

    return new Response(JSON.stringify({ 
      analysis,
      analysisType,
      timestamp: new Date().toISOString(),
      cognitiveMetrics: {
        performanceScore: gameResults?.length > 0 ? 
          gameResults.reduce((acc: number, result: any) => acc + (result.score || 0), 0) / gameResults.length : 0,
        gamesCompleted: gameResults?.length || 0,
        improvementTrend: 'stable' // Could be calculated from historical data
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in cognitive-wellbeing-ai function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      details: 'Failed to process cognitive wellbeing analysis'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});