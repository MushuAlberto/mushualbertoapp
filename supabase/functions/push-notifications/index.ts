
// edge function para enviar notificaciones web push a las suscripciones almacenadas
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import webpush from "npm:web-push@3.5.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Content-Type": "application/json",
};

const vapidPublicKey = Deno.env.get("VAPID_PUBLIC_KEY");
const vapidPrivateKey = Deno.env.get("VAPID_PRIVATE_KEY");

webpush.setVapidDetails(
  "mailto:admin@example.com", // puedes cambiarlo por tu contacto real
  vapidPublicKey,
  vapidPrivateKey
);

serve(async (req: Request) => {
  // Manejar preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  try {
    const { user_id, payload } = await req.json();

    // Buscar la suscripción en la tabla push_subscriptions
    const supabase_url = Deno.env.get("SUPABASE_URL");
    const supabase_key = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    // Obtener suscripciones para el usuario específico
    const resp = await fetch(`${supabase_url}/rest/v1/push_subscriptions?user_id=eq.${user_id}`, {
      headers: {
        apiKey: supabase_key,
        Authorization: `Bearer ${supabase_key}`,
      }
    });

    const subs = await resp.json();

    if (Array.isArray(subs) && subs.length > 0) {
      for (const sub of subs) {
        try {
          await webpush.sendNotification(sub.subscription, JSON.stringify(payload));
        } catch (e) {
          console.error("Error al enviar notificación push:", e);
        }
      }
    }

    return new Response(
      JSON.stringify({ success: true, sent: subs.length }),
      { headers: corsHeaders }
    );
  } catch (err) {
    console.error("Error:", err);
    return new Response(JSON.stringify({ error: err?.message || err + "" }), {
      status: 500,
      headers: corsHeaders,
    });
  }
});
