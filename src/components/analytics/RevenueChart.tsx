'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import GlassCard from '@/components/ui/GlassCard';

interface RevenueData {
  date: string;
  revenue: number;
  subscriptions?: number;
  tips?: number;
}

interface RevenueChartProps {
  data: RevenueData[];
  title?: string;
  height?: number;
}

export default function RevenueChart({ 
  data, 
  title = 'Revenue Overview',
  height = 300 
}: RevenueChartProps) {
  return (
    <GlassCard className="p-6">
      <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis 
            dataKey="date" 
            stroke="#9CA3AF"
            style={{ fontSize: '12px' }}
          />
          <YAxis 
            stroke="#9CA3AF"
            style={{ fontSize: '12px' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(17, 24, 39, 0.9)',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              borderRadius: '8px',
              color: '#fff',
            }}
          />
          <Legend 
            wrapperStyle={{ 
              fontSize: '12px',
              color: '#9CA3AF'
            }}
          />
          <Line
            type="monotone"
            dataKey="revenue"
            stroke="#3B82F6"
            strokeWidth={3}
            dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, fill: '#60A5FA' }}
          />
          {data[0]?.subscriptions !== undefined && (
            <Line
              type="monotone"
              dataKey="subscriptions"
              stroke="#10B981"
              strokeWidth={2}
              dot={{ fill: '#10B981', strokeWidth: 2, r: 3 }}
            />
          )}
          {data[0]?.tips !== undefined && (
            <Line
              type="monotone"
              dataKey="tips"
              stroke="#F59E0B"
              strokeWidth={2}
              dot={{ fill: '#F59E0B', strokeWidth: 2, r: 3 }}
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </GlassCard>
  );
}
