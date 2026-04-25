import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { User, Settings, Brain, Clock } from 'lucide-react';

export default function ProfileSettings() {
  const { profile, preferences, updateProfile, updatePreferences, signOut } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [username, setUsername] = useState(profile?.username || '');
  const [adhdType, setAdhdType] = useState(preferences?.adhd_type || 'not_specified');
  const [focusDuration, setFocusDuration] = useState(preferences?.focus_duration || 25);
  const [breakDuration, setBreakDuration] = useState(preferences?.break_duration || 5);
  const [notifPrefs, setNotifPrefs] = useState(preferences?.notification_preferences || {
    reminders: true,
    motivation: true,
    wellbeing: true,
    achievements: true,
  });

  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      await updateProfile({
        full_name: fullName,
        username: username || null,
      });
      toast({
        title: 'Perfil actualizado',
        description: 'Tu perfil se ha actualizado correctamente',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo actualizar el perfil',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSavePreferences = async () => {
    setLoading(true);
    try {
      await updatePreferences({
        adhd_type: adhdType,
        focus_duration: focusDuration,
        break_duration: breakDuration,
        notification_preferences: notifPrefs,
      });
      toast({
        title: 'Preferencias actualizadas',
        description: 'Tus preferencias se han guardado correctamente',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudieron actualizar las preferencias',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: 'Sesión cerrada',
      description: 'Has cerrado sesión correctamente',
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <User className="w-5 h-5" />
            <CardTitle>Perfil Personal</CardTitle>
          </div>
          <CardDescription>Actualiza tu información personal</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="full-name">Nombre completo</Label>
            <Input
              id="full-name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Tu nombre"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="username">Nombre de usuario</Label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="usuario123"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Sparkles:</span>
            <span className="font-bold text-primary">{profile?.sparkles || 0} ✨</span>
          </div>
          <Button onClick={handleSaveProfile} disabled={loading}>
            Guardar Perfil
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5" />
            <CardTitle>Configuración ADHD</CardTitle>
          </div>
          <CardDescription>Personaliza la experiencia según tu tipo de ADHD</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="adhd-type">Tipo de ADHD</Label>
            <Select value={adhdType} onValueChange={setAdhdType}>
              <SelectTrigger id="adhd-type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="not_specified">No especificado</SelectItem>
                <SelectItem value="inattentive">Inatento</SelectItem>
                <SelectItem value="hyperactive">Hiperactivo</SelectItem>
                <SelectItem value="combined">Combinado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator />

          <div className="space-y-2">
            <Label htmlFor="focus-duration">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Duración de enfoque (minutos)
              </div>
            </Label>
            <Input
              id="focus-duration"
              type="number"
              min="5"
              max="60"
              value={focusDuration}
              onChange={(e) => setFocusDuration(Number(e.target.value))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="break-duration">Duración de descanso (minutos)</Label>
            <Input
              id="break-duration"
              type="number"
              min="1"
              max="30"
              value={breakDuration}
              onChange={(e) => setBreakDuration(Number(e.target.value))}
            />
          </div>

          <Button onClick={handleSavePreferences} disabled={loading}>
            Guardar Configuración ADHD
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            <CardTitle>Preferencias de Notificaciones</CardTitle>
          </div>
          <CardDescription>Controla qué notificaciones quieres recibir</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="notif-reminders">Recordatorios</Label>
            <Switch
              id="notif-reminders"
              checked={notifPrefs.reminders}
              onCheckedChange={(checked) =>
                setNotifPrefs({ ...notifPrefs, reminders: checked })
              }
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="notif-motivation">Mensajes de motivación</Label>
            <Switch
              id="notif-motivation"
              checked={notifPrefs.motivation}
              onCheckedChange={(checked) =>
                setNotifPrefs({ ...notifPrefs, motivation: checked })
              }
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="notif-wellbeing">Recordatorios de bienestar</Label>
            <Switch
              id="notif-wellbeing"
              checked={notifPrefs.wellbeing}
              onCheckedChange={(checked) =>
                setNotifPrefs({ ...notifPrefs, wellbeing: checked })
              }
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="notif-achievements">Logros y recompensas</Label>
            <Switch
              id="notif-achievements"
              checked={notifPrefs.achievements}
              onCheckedChange={(checked) =>
                setNotifPrefs({ ...notifPrefs, achievements: checked })
              }
            />
          </div>
          <Button onClick={handleSavePreferences} disabled={loading}>
            Guardar Preferencias
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sesión</CardTitle>
          <CardDescription>Gestiona tu cuenta</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="destructive" onClick={handleSignOut}>
            Cerrar Sesión
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
