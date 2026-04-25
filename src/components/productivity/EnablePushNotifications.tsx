
import React from "react";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";
import { useWebPush } from "@/hooks/useWebPush";

const EnablePushNotifications: React.FC = () => {
  const { permission, requestPermission } = useWebPush();

  if (permission === "granted") {
    return (
      <div className="flex items-center gap-2 text-green-500">
        <Bell className="w-4 h-4" />
        Notificaciones activadas
      </div>
    );
  }

  return (
    <Button size="sm" variant="outline" onClick={requestPermission}>
      <Bell className="w-4 h-4 mr-2" />
      Activar notificaciones
    </Button>
  );
};

export default EnablePushNotifications;
