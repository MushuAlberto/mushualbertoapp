import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import ProfileSettings from '@/components/auth/ProfileSettings';

export default function Profile() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Mi Perfil</h1>
      <ProfileSettings />
    </div>
  );
}
