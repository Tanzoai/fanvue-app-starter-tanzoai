import { LucideIcon } from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';

interface KPICardProps {
  title: string;
  value: string | number;
  change?: number;
  icon?: LucideIcon;
  trend?: 'up' | 'down' | 'neutral';
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'yellow';
  subtitle?: string;
}

export default function KPICard({
  title,
  value,
  change,
  icon: Icon,
  trend = 'neutral',
  color = 'blue',
  subtitle,
}: KPICardProps) {
  const colorConfig = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    purple: 'from-purple-500 to-purple-600',
    orange: 'from-orange-500 to-orange-600',
    yellow: 'from-yellow-500 to-yellow-600',
  };

  const trendColors = {
    up: 'text-green-400',
    down: 'text-red-400',
    neutral: 'text-gray-400',
  };

  return (
    <GlassCard className="p-6 hover:scale-105 transition-transform duration-300" hover>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-400 mb-1">{title}</p>
          <p className="text-3xl font-bold text-white mb-2">{value}</p>
          {subtitle && (
            <p className="text-xs text-gray-500 mb-2">{subtitle}</p>
          )}
          {change !== undefined && (
            <div className="flex items-center gap-1">
              <span className={`text-sm font-medium ${trendColors[trend]}`}>
                {trend === 'up' && '↑'}
                {trend === 'down' && '↓'}
                {change > 0 ? '+' : ''}{change}%
              </span>
              <span className="text-xs text-gray-500">vs last period</span>
            </div>
          )}
        </div>
        {Icon && (
          <div className={`p-3 rounded-lg bg-gradient-to-br ${colorConfig[color]} shadow-lg`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
        )}
      </div>
    </GlassCard>
  );
}
