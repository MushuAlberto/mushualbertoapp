// Service Worker básico para recibir notificaciones push

self.addEventListener("push", (event) => {
  const data = event.data?.json() ?? {};
  const { title, body, icon, tag } = data;
  event.waitUntil(
    self.registration.showNotification(title || "Notificación", {
      body: body || "",
      icon: icon || "/favicon.ico",
      tag: tag || "mushu-notification",
      badge: icon || "/favicon.ico",
    })
  );
});

// (Opcional) Manejar click en la notificación
self.addEventListener("notificationclick", function(event) {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: "window" }).then(function(clientList) {
      if (clients.openWindow) {
        return clients.openWindow("/");
      }
    })
  );
});
// Ya está bien configurado para mostrar notificaciones
