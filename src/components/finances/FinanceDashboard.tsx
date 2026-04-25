
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Tables } from '@/integrations/supabase/types';

import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

type Transaction = Tables<'transactions'>;

interface MonthlyData {
  month: string;
  ingresos: number;
  egresos: number;
}

const FinanceDashboard: React.FC<{ transactions: Transaction[] }> = ({ transactions }) => {

  if (transactions.length === 0) {
    return <p className="text-center text-gray-500 py-10">No hay datos suficientes para mostrar el dashboard.</p>;
  }

  const monthlyData = transactions.reduce((acc, tx) => {
    const month = format(parseISO(tx.date), 'MMM yyyy', { locale: es });
    if (!acc[month]) {
      acc[month] = { month, ingresos: 0, egresos: 0 };
    }
    if (tx.type === 'income') {
      acc[month].ingresos += tx.amount;
    } else {
      acc[month].egresos += tx.amount;
    }
    return acc;
  }, {} as Record<string, MonthlyData>);
  
  const chartData = Object.values(monthlyData).sort((a,b) => {
      const dateA = new Date(2000, ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'].indexOf(a.month.split(' ')[0]), 1);
      const dateB = new Date(2000, ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'].indexOf(b.month.split(' ')[0]), 1);
      return dateA.getTime() - dateB.getTime();
  });

  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" tickFormatter={(label) => label.charAt(0).toUpperCase() + label.slice(1)} />
          <YAxis
            tickFormatter={(value) => `$${value}`}
          />
          <Tooltip
            formatter={(value: number) => [`$${value.toFixed(2)}`, '']}
            labelFormatter={(label) => label.charAt(0).toUpperCase() + label.slice(1)}
          />
          <Legend />
          <Bar dataKey="ingresos" fill="#22c55e" name="Ingresos" />
          <Bar dataKey="egresos" fill="#ef4444" name="Egresos" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default FinanceDashboard;
