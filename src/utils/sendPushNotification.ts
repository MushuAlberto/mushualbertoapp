
export async function sendPushNotification(userId: string, payload: { title: string; body: string; icon?: string }) {
  const response = await fetch(
    "https://xdudrydyvrbhvyigpztm.functions.supabase.co/push-notifications",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: userId, payload }),
    }
  );
  return response.json();
}
