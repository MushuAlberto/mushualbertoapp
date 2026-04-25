
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CheckSquare, Calendar, TrendingUp } from 'lucide-react';

interface QuickStatsProps {
  pendingTasksCount: number;
  bestStreak: number;
  totalBalance: number;
  sparkles: number;
}

const QuickStats: React.FC<QuickStatsProps> = ({ 
  pendingTasksCount, 
  bestStreak, 
  totalBalance, 
  sparkles 
}) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-2">
            <CheckSquare className="h-5 w-5 text-blue-600" />
            <div>
              <p className="text-2xl font-bold">{pendingTasksCount}</p>
              <p className="text-xs text-gray-600">Tareas pendientes</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-green-600" />
            <div>
              <p className="text-2xl font-bold">{bestStreak}</p>
              <p className="text-xs text-gray-600">Mejor racha</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-purple-600" />
            <div>
              <p className="text-2xl font-bold">$ {totalBalance.toFixed(2)}</p>
              <p className="text-xs text-gray-600">Balance total</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-2">
            <span className="text-amber-500">✨</span>
            <div>
              <p className="text-2xl font-bold">{sparkles}</p>
              <p className="text-xs text-gray-600">Sparkles</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuickStats;
