
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import AvatarMushu from '@/components/AvatarMushu';
import { Task, Habit, Transaction } from '@/types';

interface OverviewCardsProps {
  pendingTasks: Task[];
  activeHabits: Habit[];
  recentTransactions: Transaction[];
}

const OverviewCards: React.FC<OverviewCardsProps> = ({ 
  pendingTasks, 
  activeHabits, 
  recentTransactions 
}) => {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Pending Tasks */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Tareas Pendientes</span>
            <Link to="/productivity">
              <Button variant="outline" size="sm">Ver todas</Button>
            </Link>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {pendingTasks.length > 0 ? (
            <div className="space-y-3">
              {pendingTasks.map(task => (
                <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{task.title}</p>
                    <Badge variant={task.status === 'inprogress' ? 'default' : 'secondary'}>
                      {task.status === 'inprogress' ? 'En progreso' : 'Por hacer'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 text-center py-4">¡No tienes tareas pendientes! 🎉</p>
          )}
        </CardContent>
      </Card>

      {/* Active Habits */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Hábitos de Hoy</span>
            <Link to="/productivity">
              <Button variant="outline" size="sm">Ver todos</Button>
            </Link>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {activeHabits.length > 0 ? (
            <div className="space-y-3">
              {activeHabits.map(habit => (
                <div key={habit.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{habit.name}</p>
                    <p className="text-sm text-gray-600">Racha: {habit.streak} días</p>
                  </div>
                  <Badge variant="outline">Pendiente</Badge>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 text-center py-4">¡Todos los hábitos completados! ✨</p>
          )}
        </CardContent>
      </Card>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Transacciones Recientes</span>
            <Link to="/expenses">
              <Button variant="outline" size="sm">Ver todas</Button>
            </Link>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {recentTransactions.length > 0 ? (
            <div className="space-y-3">
              {recentTransactions.map(transaction => (
                <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{transaction.description || transaction.category}</p>
                    <p className="text-sm text-gray-600">{new Date(transaction.date).toLocaleDateString()}</p>
                  </div>
                  <span className={`font-medium ${
                    transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transaction.type === 'income' ? '+' : '-'}$ {transaction.amount}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 text-center py-4">No hay transacciones recientes</p>
          )}
        </CardContent>
      </Card>

      {/* Chat Reflection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Reflexión de Mushu</span>
            <Link to="/chat">
              <Button variant="outline" size="sm">Chatear</Button>
            </Link>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <AvatarMushu size={48} className="mx-auto mb-3" />
            <p className="text-blue-600 font-medium">¡Hola! Soy <b>Mushu</b>, tu amigo perruno IA</p>
            <p className="text-gray-600 text-sm mt-2">
              ¿Quieres conversar conmigo? Estoy aquí para escucharte y darte buenos consejos.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OverviewCards;
