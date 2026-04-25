
import { useEffect, useState } from "react";

const VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY || ""; // Fallback para cargarlo del frontend, pero deberías pasarlo por settings si es necesario

// Utilidad para convertir base64 a Uint8Array
function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');
  const rawData = typeof window !== "undefined" ? window.atob(base64) : ""; // Previene error fuera del navegador
  return Uint8Array.from([...rawData].map(char => char.charCodeAt(0)));
}

function getNotificationPermission(): NotificationPermission | "default" {
  if (typeof window === "undefined" || typeof window.Notification === "undefined") {
    return "default"; // Fallback seguro
  }
  return window.Notification.permission;
}

export function useWebPush() {
  const [permission, setPermission] = useState<NotificationPermission | "default">(getNotificationPermission());

  useEffect(() => {
    setPermission(getNotificationPermission());
    // Opcional: podrías verificar si ya tiene servicio worker registrado y/o suscripción aquí
  }, []);

  // Envía la suscripción push a localStorage (simplificado)
  const savePushSubscription = async (subscription: PushSubscription) => {
    localStorage.setItem('mushu_push_subscription', JSON.stringify(subscription.toJSON()));
  };

  const requestPermission = async () => {
    if (
      typeof window === "undefined" ||
      typeof window.Notification === "undefined" ||
      !("serviceWorker" in navigator && "PushManager" in window)
    ) {
      alert("Tu navegador no soporta notificaciones push web.");
      return false;
    }
    const result = await window.Notification.requestPermission();
    setPermission(result);
    if (result === "granted") {
      // Registrar SW
      const reg = await navigator.serviceWorker.register("/notification-sw.js");
      // Suscribirse a push
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
      });
      await savePushSubscription(sub);
    }
    return result === "granted";
  };

  return {
    permission,
    requestPermission,
  };
}
