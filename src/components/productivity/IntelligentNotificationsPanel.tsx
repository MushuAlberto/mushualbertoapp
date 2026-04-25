import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useIntelligentNotifications } from '@/hooks/useIntelligentNotifications';
import { 
  Bell, 
  BellOff, 
  Sparkles, 
  Heart, 
  Target, 
  Award,
  Clock,
  Settings
} from 'lucide-react';

export const IntelligentNotificationsPanel: React.FC = () => {
  const {
    isGenerating,
    lastNotification,
    preferences,
    updatePreferences,
    requestPermission,
    sendReminder,
    sendMotivation,
    sendWellbeingReminder,
    celebrateAchievement,
  } = useIntelligentNotifications();

  const [testContext, setTestContext] = useState('');

  const handleRequestPermission = async () => {
    await requestPermission();
  };

  const notificationPermission = typeof window !== 'undefined' && 'Notification' in window 
    ? Notification.permission 
    : 'default';

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-primary" />
          Notificaciones Inteligentes
        </CardTitle>
        <CardDescription>
          Recordatorios personalizados con IA para ADHD
        </CardDescription>

        {notificationPermission !== 'granted' && (
          <Button
            onClick={handleRequestPermission}
            variant="outline"
            size="sm"
            className="mt-2 flex items-center gap-2"
          >
            <Bell className="h-4 w-4" />
            Activar Notificaciones del Navegador
          </Button>
        )}

        {notificationPermission === 'granted' && (
          <Badge variant="default" className="mt-2 w-fit">
            ✅ Notificaciones Activas
          </Badge>
        )}
      </CardHeader>

      <CardContent>
        <ScrollArea className="h-[500px] pr-4">
          <div className="space-y-4">
            {/* Preferences Section */}
            <div className="space-y-3">
              <h4 className="font-semibold text-sm flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Preferencias
              </h4>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="enable-reminders" className="flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    Recordatorios de Tareas
                  </Label>
                  <Switch
                    id="enable-reminders"
                    checked={preferences.enableReminders}
                    onCheckedChange={(checked) => updatePreferences({ enableReminders: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="enable-motivation" className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4" />
                    Mensajes Motivacionales
                  </Label>
                  <Switch
                    id="enable-motivation"
                    checked={preferences.enableMotivation}
                    onCheckedChange={(checked) => updatePreferences({ enableMotivation: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="enable-wellbeing" className="flex items-center gap-2">
                    <Heart className="h-4 w-4" />
                    Recordatorios de Bienestar
                  </Label>
                  <Switch
                    id="enable-wellbeing"
                    checked={preferences.enableWellbeing}
                    onCheckedChange={(checked) => updatePreferences({ enableWellbeing: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="enable-achievements" className="flex items-center gap-2">
                    <Award className="h-4 w-4" />
                    Celebración de Logros
                  </Label>
                  <Switch
                    id="enable-achievements"
                    checked={preferences.enableAchievements}
                    onCheckedChange={(checked) => updatePreferences({ enableAchievements: checked })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="frequency" className="text-sm">Frecuencia de Notificaciones</Label>
                <Select
                  value={preferences.frequency}
                  onValueChange={(value: 'minimal' | 'moderate' | 'frequent') => 
                    updatePreferences({ frequency: value })
                  }
                >
                  <SelectTrigger id="frequency">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="minimal">Mínimas (esenciales)</SelectItem>
                    <SelectItem value="moderate">Moderadas (balanceadas)</SelectItem>
                    <SelectItem value="frequent">Frecuentes (máximo apoyo)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <Label htmlFor="quiet-start" className="text-xs flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    Horario Silencioso (inicio)
                  </Label>
                  <Select
                    value={preferences.quietHoursStart?.toString()}
                    onValueChange={(value) => 
                      updatePreferences({ quietHoursStart: parseInt(value) })
                    }
                  >
                    <SelectTrigger id="quiet-start" className="h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 24 }, (_, i) => (
                        <SelectItem key={i} value={i.toString()}>
                          {i.toString().padStart(2, '0')}:00
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="quiet-end" className="text-xs flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    Horario Silencioso (fin)
                  </Label>
                  <Select
                    value={preferences.quietHoursEnd?.toString()}
                    onValueChange={(value) => 
                      updatePreferences({ quietHoursEnd: parseInt(value) })
                    }
                  >
                    <SelectTrigger id="quiet-end" className="h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 24 }, (_, i) => (
                        <SelectItem key={i} value={i.toString()}>
                          {i.toString().padStart(2, '0')}:00
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <Separator />

            {/* Test Notifications Section */}
            <div className="space-y-3">
              <h4 className="font-semibold text-sm flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                Probar Notificaciones
              </h4>

              <div className="grid grid-cols-2 gap-2">
                <Button
                  onClick={() => sendReminder('Revisar tus tareas pendientes')}
                  disabled={isGenerating}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Target className="h-4 w-4" />
                  Recordatorio
                </Button>

                <Button
                  onClick={() => sendMotivation([])}
                  disabled={isGenerating}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Sparkles className="h-4 w-4" />
                  Motivación
                </Button>

                <Button
                  onClick={() => sendWellbeingReminder()}
                  disabled={isGenerating}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Heart className="h-4 w-4" />
                  Bienestar
                </Button>

                <Button
                  onClick={() => celebrateAchievement('Completar una tarea')}
                  disabled={isGenerating}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Award className="h-4 w-4" />
                  Logro
                </Button>
              </div>
            </div>

            {lastNotification && (
              <>
                <Separator />
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">Última Notificación</h4>
                  <div className="p-3 bg-secondary/50 rounded-lg">
                    <div className="font-medium text-sm">{lastNotification.title}</div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {lastNotification.body}
                    </div>
                    <div className="flex gap-2 mt-2">
                      <Badge variant="outline" className="text-xs">
                        {lastNotification.type}
                      </Badge>
                      <Badge 
                        variant={
                          lastNotification.priority === 'high' ? 'default' :
                          lastNotification.priority === 'medium' ? 'secondary' : 'outline'
                        }
                        className="text-xs"
                      >
                        {lastNotification.priority}
                      </Badge>
                    </div>
                  </div>
                </div>
              </>
            )}

            <div className="p-3 bg-primary/5 rounded-lg">
              <p className="text-xs text-muted-foreground">
                💡 Las notificaciones inteligentes se adaptan a tu patrón de actividad y perfil ADHD
                para enviarte recordatorios en el momento óptimo.
              </p>
            </div>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
