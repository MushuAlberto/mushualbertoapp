
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import AvatarMushu from '@/components/AvatarMushu';

interface WelcomeSectionProps {
  userName: string;
  dailyThought: string;
}

const WelcomeSection: React.FC<WelcomeSectionProps> = ({ userName, dailyThought }) => {
  return (
    <div className="text-center space-y-4">
      <div className="w-24 h-24 flex items-center justify-center mx-auto">
        <AvatarMushu size={96} />
      </div>
      <h1 className="text-3xl font-bold text-gray-800">¡Hola, {userName}!</h1>
      <Card className="bg-gradient-to-r from-blue-100 to-purple-100 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <AvatarMushu size={32} className="inline-block" />
            <p className="text-blue-800 font-medium italic">{dailyThought}</p>
          </div>
          <p className="text-blue-600 text-sm mt-2">- Consejo de Mushu 🐶</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default WelcomeSection;
