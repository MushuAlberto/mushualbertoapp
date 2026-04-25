
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // NEW LOG
  console.log("[Mushu TTS] [EDGE] Petición recibida con método:", req.method);

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const bodyText = await req.text();
    console.log("[Mushu TTS] [EDGE] Body RAW recibido:", bodyText);

    let body;
    try {
      body = JSON.parse(bodyText);
    } catch (err) {
      console.error("[Mushu TTS] [EDGE] Error al parsear body JSON:", err);
      return new Response(JSON.stringify({ error: "Body no es JSON válido" }), { status: 400, headers: corsHeaders });
    }

    const { text, voiceId, model, language } = body;
    console.log("[Mushu TTS] [EDGE] Parámetros extraídos:", { text, voiceId, model, language });

    if (!text) {
      console.error("[Mushu TTS] [EDGE] FALTA parámetro text");
      throw new Error('Text is required');
    }

    const elevenLabsApiKey = Deno.env.get('ELEVENLABS_API_KEY');
    if (!elevenLabsApiKey) {
      console.error("[Mushu TTS] [EDGE] ELEVENLABS_API_KEY NO CONFIGURADO");
      throw new Error('ElevenLabs API key not configured');
    }
    console.log("[Mushu TTS] [EDGE] ELEVENLABS_API_KEY OK");

    const finalVoiceId = voiceId || 'TX3LPaxmHKxFdv7VOQHJ';
    const finalModel = model || 'eleven_multilingual_v2';

    console.log(`[Mushu TTS] [EDGE] Llamando ElevenLabs: voice=${finalVoiceId}, model=${finalModel}`);

    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${finalVoiceId}`, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': elevenLabsApiKey,
      },
      body: JSON.stringify({
        text,
        model_id: finalModel,
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.5,
        },
      }),
    });

    console.log("[Mushu TTS] [EDGE] ElevenLabs response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[Mushu TTS] [EDGE] ElevenLabs API error:', errorText);
      throw new Error(`ElevenLabs API error: ${response.status} - ${errorText}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    console.log("[Mushu TTS] [EDGE] Audio arrayBuffer length:", arrayBuffer.byteLength);

    const base64Audio = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));

    console.log('[Mushu TTS] [EDGE] Audio generado, base64 tamaño:', base64Audio.length);

    return new Response(
      JSON.stringify({ audioContent: base64Audio }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('[Mushu TTS] [EDGE] Error en text-to-voice:', error && error.message ? error.message : error);
    return new Response(
      JSON.stringify({ error: error && error.message ? error.message : String(error) }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
