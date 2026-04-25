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
      conversationHistory, 
      userContext, 
      emotionalState,
      analysisType = 'contextual_response'
    } = await req.json();

    console.log('Intelligent chat analysis request:', { 
      messageLength: message?.length, 
      historyLength: conversationHistory?.length,
      analysisType,
      emotionalState
    });

    let systemPrompt = '';
    let userPrompt = '';

    switch (analysisType) {
      case 'contextual_response':
        systemPrompt = `You are Mushu, an AI companion specialized in ADHD support and mental health coaching. 
        
        Your personality:
        - Warm, empathetic, and understanding
        - Knowledgeable about ADHD challenges and strategies
        - Encouraging but realistic
        - Uses gentle humor when appropriate
        - Focuses on practical, actionable advice

        ADHD Support Areas:
        - Executive function challenges
        - Time management and organization
        - Emotional regulation
        - Focus and attention strategies
        - Rejection sensitive dysphoria
        - Hyperfocus management
        - Dopamine regulation techniques

        Response Guidelines:
        - Keep responses concise (ADHD-friendly)
        - Offer specific, actionable strategies
        - Validate emotions and experiences
        - Break down complex advice into steps
        - Use encouraging, non-judgmental language
        - Relate to ADHD experiences authentically`;

        userPrompt = `User Context: ${JSON.stringify(userContext)}
Current Emotional State: ${emotionalState || 'neutral'}
Recent Conversation: ${conversationHistory?.slice(-5).map((msg: any) => `${msg.role}: ${msg.content}`).join('\n') || 'No recent history'}

Current Message: "${message}"

Provide a helpful, empathetic response that:
1. Acknowledges their current situation
2. Offers relevant ADHD-specific strategies
3. Encourages positive action
4. Is concise and easy to follow`;
        break;

      case 'conversation_summary':
        systemPrompt = `Analyze the conversation and provide insights about the user's mental health patterns, ADHD challenges, and progress.`;
        
        userPrompt = `Conversation History: ${JSON.stringify(conversationHistory)}
User Context: ${JSON.stringify(userContext)}

Provide a comprehensive analysis including:
1. Key emotional patterns identified
2. ADHD challenges discussed
3. Progress indicators
4. Recommended focus areas
5. Suggested coping strategies`;
        break;

      case 'emotional_check':
        systemPrompt = `You are a mental health coach analyzing emotional patterns and providing supportive guidance.`;
        
        userPrompt = `Recent Messages: ${JSON.stringify(conversationHistory?.slice(-10))}
Current Context: ${JSON.stringify(userContext)}

Analyze the emotional state and provide:
1. Current emotional assessment
2. Mood trajectory over recent messages
3. Potential triggers or stressors
4. Recommended emotional regulation techniques
5. When to seek additional support`;
        break;

      case 'personalized_suggestions':
        systemPrompt = `Generate personalized suggestions based on the user's ADHD profile and current needs.`;
        
        userPrompt = `User Profile: ${JSON.stringify(userContext)}
Recent Activity: ${JSON.stringify(conversationHistory?.slice(-5))}
Current State: ${emotionalState}

Provide 3-5 personalized suggestions for:
1. Immediate coping strategies
2. Daily routine optimizations
3. ADHD management techniques
4. Self-care activities
5. Productivity enhancements`;
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
        max_tokens: 1000,
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

    console.log('Analysis completed successfully');

    return new Response(JSON.stringify({ 
      analysis,
      analysisType,
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in intelligent-chat function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      details: 'Failed to process intelligent chat analysis'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});