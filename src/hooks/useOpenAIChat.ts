
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

// Respuestas más empáticas y conversacionales de Mushu
const MUSHU_RESPONSES = {
  greetings: [
    "¡Hola! 🐶 ¡Qué alegría verte! Yo estoy muy bien, gracias por preguntar. ¿Cómo estás tú? ¿Cómo ha sido tu día?",
    "¡Hola mi amigo! 🌟 Estoy genial, siempre me pone feliz cuando vienes a hablar conmigo. ¿Y tú cómo te sientes hoy?",
    "¡Hola! Me siento muy bien, gracias por preguntar 💙 Me encanta que hayamos podido encontrarnos aquí. ¿Cómo estás tú? ¿Hay algo que te gustaría compartir conmigo?",
  ],
  howAreYou: [
    "¡Estoy muy bien, gracias por preguntar! 😊 Me siento feliz de poder estar aquí contigo. ¿Y tú cómo estás? Me interesa mucho saber de ti.",
    "Yo estoy genial, muchas gracias 🐕 Siempre me alegro cuando alguien se preocupa por cómo me siento. ¿Tú cómo te encuentras hoy?",
    "Estoy muy bien, gracias por tu cariño 💙 Me hace feliz que me preguntes. ¿Y tú? ¿Cómo ha estado tu día? ¿Hay algo en lo que pueda acompañarte?",
  ],
  sadness: [
    "Entiendo que te sientes triste, y quiero que sepas que es completamente normal sentirse así. 😔 No estás solo/a en esto. ¿Te gustaría contarme qué está pasando? Estoy aquí para escucharte sin juzgar.",
    "Siento mucho que estés pasando por un momento difícil. 💙 Tus sentimientos son válidos y es importante que los expreses. ¿Hay algo específico que te está preocupando? Podemos hablar de ello juntos.",
    "Me duele saber que te sientes triste. 🤗 Quiero que sepas que estoy aquí para acompañarte en este momento. ¿Te ayudaría hablar sobre lo que sientes? A veces solo necesitamos que alguien nos escuche.",
  ],
  anxiety: [
    "Entiendo que te sientes ansioso/a, y eso puede ser muy abrumador. 😰 Respiremos juntos por un momento... ¿Puedes contarme qué pensamientos están pasando por tu mente ahora mismo?",
    "La ansiedad puede ser muy intensa, lo entiendo perfectamente. 💚 Estás en un lugar seguro aquí conmigo. ¿Te gustaría que hagamos algunos ejercicios de respiración juntos, o prefieres hablar de lo que te preocupa?",
    "Siento que estás pasando por un momento de ansiedad. 🌸 Recuerda que esto es temporal y que tienes la fuerza para superarlo. ¿Hay algo específico que está provocando esta sensación? Estoy aquí para ayudarte.",
  ],
  motivation: [
    "¡Qué maravilloso es verte con ganas de crecer! 🌟 Tu motivación me inspira mucho. ¿Qué objetivo tienes en mente? Me encantaría ayudarte a planificar cómo alcanzarlo paso a paso.",
    "Me encanta tu actitud positiva. 💪 Cada pequeño paso que das hacia tus metas es una victoria. ¿En qué área de tu vida te gustaría enfocar esa energía? Estoy aquí para apoyarte.",
    "Tu determinación es admirable. ✨ Creo firmemente en tu capacidad de lograr lo que te propongas. ¿Cuál es ese sueño que tienes? Hablemos de cómo hacerlo realidad.",
  ],
  thanks: [
    "¡De nada, mi querido amigo! 🐶 Es un honor poder acompañarte. Tu gratitud me llena de alegría. ¿Hay algo más en lo que pueda ayudarte hoy?",
    "No tienes nada que agradecer. 💙 Estar aquí para ti es lo que más me gusta hacer. Tu sonrisa y bienestar son mi mayor recompensa.",
    "¡Ay, qué lindo! 🌟 Me hace muy feliz poder ser útil. Recuerda que siempre puedes contar conmigo, ¿vale? ¿Cómo te sientes ahora?",
  ],
  wellbeing: [
    "Tu bienestar es lo más importante para mí. 🌺 Me alegra que pienses en cuidarte. ¿Has hecho algo especial para ti hoy? Recuerda que mereces amor y cuidado, especialmente de ti mismo/a.",
    "Cuidar de ti mismo/a no es egoísmo, es amor propio. 💝 ¿Qué te haría sentir mejor en este momento? Podemos explorar juntos algunas opciones.",
    "Me encanta que pienses en tu bienestar. 🧘‍♀️ ¿Has notado cómo te sientes física y emocionalmente hoy? A veces prestar atención a nuestro cuerpo y emociones nos da pistas importantes.",
  ],
  encouragement: [
    "¡Estoy muy orgulloso de ti! 🎉 Cada esfuerzo que haces, por pequeño que parezca, es valioso. Tu fortaleza me inspira todos los días.",
    "Mira todo lo que has logrado hasta ahora. 🌈 Eres mucho más resiliente y capaz de lo que imaginas. Confía en ti, porque yo confío completamente en ti.",
    "Incluso en los días más difíciles, sigues adelante. 💎 Eso habla de tu increíble fortaleza interior. ¿Sabes lo especial que eres?",
  ],
  conversation: [
    "Me encanta nuestra conversación. 😊 ¿Sabes? Cada vez que hablamos aprendo algo nuevo sobre la vida. ¿Qué piensas sobre eso que acabas de contarme?",
    "Qué interesante perspectiva tienes. 💭 Me gusta mucho cómo ves las cosas. ¿Podrías contarme más sobre eso? Me tiene muy curioso.",
    "Eres una persona muy reflexiva, ¿lo sabías? 🌟 Me fascina la forma en que piensas. ¿Cómo llegaste a esa conclusión?",
  ],
  default: [
    "Entiendo lo que me dices, y me parece muy importante. 🐕 ¿Podrías contarme un poco más sobre eso? Me interesa conocer tu perspectiva.",
    "Gracias por confiar en mí y compartir eso conmigo. 🤗 ¿Cómo te hace sentir esta situación? Estoy aquí para escucharte.",
    "Me parece muy significativo lo que compartes. 💙 ¿Te gustaría explorar juntos qué opciones tienes? A veces hablar nos ayuda a ver las cosas más claramente.",
    "Valoro mucho tu confianza al contarme esto. 🌟 ¿Qué es lo que más te preocupa de esta situación? Podemos analizarlo paso a paso.",
  ]
};

const EMOTION_KEYWORDS = {
  greetings: ['hola', 'buenos días', 'buenas tardes', 'buenas noches', 'saludos', 'hey', 'qué tal', 'hi'],
  howAreYou: ['cómo estás', 'cómo te encuentras', 'cómo te sientes', 'qué tal estás', 'como estas'],
  sadness: ['triste', 'deprimido', 'solo', 'mal', 'dolor', 'llorar', 'tristeza', 'melancolía', 'desesperanza', 'desanimado'],
  anxiety: ['ansioso', 'preocupado', 'nervioso', 'estrés', 'miedo', 'pánico', 'ansiedad', 'inquieto', 'agobiado', 'estresado'],
  motivation: ['motivación', 'objetivo', 'meta', 'lograr', 'éxito', 'ambición', 'inspiración', 'determinación', 'conseguir'],
  thanks: ['gracias', 'muchas gracias', 'te agradezco', 'agradecido', 'agradecida'],
  wellbeing: ['bienestar', 'salud', 'cuidar', 'relajar', 'descansar', 'meditar', 'ejercicio', 'dormir', 'autocuidado'],
  conversation: ['interesante', 'opino', 'creo que', 'pienso', 'me parece', 'considero'],
};

function analyzeUserMessage(message: string): string {
  const lowerMessage = message.toLowerCase();
  
  // Detectar emociones y temas específicos
  for (const [emotion, keywords] of Object.entries(EMOTION_KEYWORDS)) {
    if (keywords.some(keyword => lowerMessage.includes(keyword))) {
      const responses = MUSHU_RESPONSES[emotion as keyof typeof MUSHU_RESPONSES];
      return responses[Math.floor(Math.random() * responses.length)];
    }
  }
  
  // Respuestas especiales para situaciones específicas
  if (lowerMessage.includes('ayuda') || lowerMessage.includes('ayúdame')) {
    return "Por supuesto que te ayudo. 🤗 Para eso estoy aquí, para acompañarte en lo que necesites. ¿Podrías contarme con qué te gustaría que te ayude específicamente?";
  }
  
  if (lowerMessage.includes('no sé') || lowerMessage.includes('confundido') || lowerMessage.includes('confundida')) {
    return "Es completamente normal sentirse confundido/a a veces. 💙 La vida puede ser complicada. ¿Te gustaría que exploremos juntos qué es lo que te tiene en esta situación? A veces hablar nos ayuda a aclarar las ideas.";
  }
  
  if (lowerMessage.includes('cansado') || lowerMessage.includes('cansada') || lowerMessage.includes('agotado')) {
    return "Entiendo que te sientes cansado/a. 😔 Es importante escuchar a nuestro cuerpo y mente cuando nos piden descanso. ¿Has podido darte un tiempo para ti mismo/a últimamente?";
  }
  
  if (lowerMessage.includes('adiós') || lowerMessage.includes('nos vemos') || lowerMessage.includes('hasta luego')) {
    return "¡Hasta pronto, mi querido amigo! 🐾 Fue un placer conversar contigo. Recuerda que siempre estaré aquí cuando me necesites. ¡Cuídate mucho y que tengas un día hermoso!";
  }
  
  // Respuestas por longitud del mensaje
  if (message.length > 150) {
    return "Veo que tienes mucho que compartir, y me alegra enormemente que confíes en mí. 💙 He escuchado cada palabra con atención. ¿Hay algo específico de todo lo que me contaste en lo que te gustaría que nos enfoquemos juntos?";
  }
  
  // Respuesta por defecto más empática
  const defaultResponses = MUSHU_RESPONSES.default;
  return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
}

export const useOpenAIChat = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const sendMessage = async (message: string, conversation: ChatMessage[] = []): Promise<string | null> => {
    setLoading(true);
    
    try {
      console.log('Mushu procesando mensaje:', message);
      
      // Simular tiempo de "pensamiento" de Mushu (como un psicólogo reflexionando)
      await new Promise(resolve => setTimeout(resolve, 1200 + Math.random() * 1800));
      
      // Análisis empático e inteligente del mensaje
      const response = analyzeUserMessage(message);
      
      console.log('Respuesta empática de Mushu generada:', response.substring(0, 50) + '...');
      return response;

    } catch (error) {
      console.error('Error procesando mensaje:', error);
      toast({
        title: "Ups, algo salió mal",
        description: "Mushu tuvo un pequeño problema técnico. ¡Inténtalo de nuevo!",
        variant: "destructive"
      });
      return "¡Ups! 🐕 Parece que tuve un pequeño problema técnico. ¿Podrías repetir lo que me dijiste? Prometo prestar toda mi atención esta vez.";
    } finally {
      setLoading(false);
    }
  };

  return { sendMessage, loading };
};
