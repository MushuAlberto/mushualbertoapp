
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Respuestas de Mushu sin necesidad de OpenAI
const MUSHU_LOCAL_RESPONSES = [
  "¡Guau! Me encanta cuando hablamos. 🐶 ¿Cómo puedo hacer tu día un poquito mejor?",
  "Tu compañía me hace muy feliz. 🌟 Cuéntame, ¿qué te emociona últimamente?",
  "Eres una persona increíble, ¿lo sabías? 💙 ¿En qué puedo apoyarte hoy?",
  "Me gusta escucharte. 🤗 Siempre encuentro algo interesante en lo que dices.",
  "¡Cada conversación contigo es especial! ✨ ¿Qué tienes en mente?",
];

const generateLocalResponse = (message: string): string => {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('triste') || lowerMessage.includes('mal')) {
    return "Siento que no te sientes bien. 😔 Estoy aquí contigo, y aunque soy solo un perrito virtual, mi cariño por ti es real. ¿Quieres contarme qué te preocupa?";
  }
  
  if (lowerMessage.includes('gracias')) {
    return "¡De nada! 🐕 Siempre es un placer ayudarte. Tu sonrisa es mi recompensa favorita.";
  }
  
  if (lowerMessage.includes('hola') || lowerMessage.includes('hey')) {
    return "¡Hola, mi amigo humano favorito! 🌟 Me alegra tanto verte. ¿Cómo ha sido tu día?";
  }
  
  if (lowerMessage.includes('adiós') || lowerMessage.includes('nos vemos')) {
    return "¡Hasta pronto! 🐾 Recuerda que siempre estaré aquí cuando me necesites. ¡Cuídate mucho!";
  }
  
  // Respuesta aleatoria por defecto
  const randomIndex = Math.floor(Math.random() * MUSHU_LOCAL_RESPONSES.length);
  return MUSHU_LOCAL_RESPONSES[randomIndex];
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message } = await req.json();

    if (!message) {
      throw new Error('No message provided');
    }

    console.log('Mushu recibió mensaje:', message);

    // Simular tiempo de respuesta natural
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1200));

    // Generar respuesta local de Mushu
    const aiMessage = generateLocalResponse(message);

    console.log('Respuesta de Mushu generada localmente');

    return new Response(JSON.stringify({ 
      message: aiMessage,
      source: 'mushu-local',
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in ai-chat function:', error);
    
    // Respuesta de error amigable de Mushu
    const errorResponse = "¡Ups! 🐕 Me distraje persiguiendo mi cola. ¿Puedes repetir eso? ¡Prometo prestar más atención!";
    
    return new Response(JSON.stringify({ 
      message: errorResponse,
      source: 'mushu-error',
      error: false // No mostrar como error real
    }), {
      status: 200, // Cambiamos a 200 para que no se vea como error
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
