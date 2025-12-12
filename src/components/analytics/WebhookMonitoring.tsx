'use client';

import { useState, useEffect } from 'react';
import { Activity, TrendingUp, Users, MessageSquare, DollarSign } from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';
import StatusBadge from '@/components/ui/StatusBadge';

interface WebhookStats {
  total: number;
  successful: number;
  failed: number;
  successRate: number;
  eventCounts: Record<string, number>;
}

interface RevenueStats {
  total: number;
  byType: Record<string, number>;
  count: number;
}

export default function WebhookMonitoring() {
  const [stats, setStats] = useState<WebhookStats | null>(null);
  const [revenueStats, setRevenueStats] = useState<RevenueStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
    
    // Refresh stats every 30 seconds
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/webhooks/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data.stats);
        setRevenueStats(data.revenueStats);
      }
    } catch (error) {
      console.error('Failed to fetch webhook stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <GlassCard className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <Activity className="w-5 h-5 text-purple-400 animate-pulse" />
          <h3 className="text-lg font-semibold text-white">Webhook Activity</h3>
        </div>
        <p className="text-gray-400 text-sm">Loading webhook statistics...</p>
      </GlassCard>
    );
  }

  const eventTypeIcons: Record<string, React.ReactNode> = {
    'message.received': <MessageSquare className="w-4 h-4 text-blue-400" />,
    'subscriber.new': <Users className="w-4 h-4 text-green-400" />,
    'tip.received': <DollarSign className="w-4 h-4 text-yellow-400" />,
    'purchase.received': <TrendingUp className="w-4 h-4 text-purple-400" />,
  };

  return (
    <GlassCard className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Activity className="w-5 h-5 text-purple-400" />
          <h3 className="text-lg font-semibold text-white">Webhook Activity</h3>
        </div>
        <StatusBadge 
          status={stats && stats.total > 0 ? 'active' : 'inactive'} 
          pulse={stats && stats.total > 0}
        />
      </div>

      {stats && stats.total > 0 ? (
        <div className="space-y-4">
          {/* Overview Stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 bg-gray-800/30 rounded-lg border border-gray-700/30">
              <p className="text-xs text-gray-400 mb-1">Total Events</p>
              <p className="text-xl font-bold text-white">{stats.total}</p>
            </div>
            <div className="p-3 bg-gray-800/30 rounded-lg border border-green-500/20">
              <p className="text-xs text-gray-400 mb-1">Successful</p>
              <p className="text-xl font-bold text-green-400">{stats.successful}</p>
            </div>
            <div className="p-3 bg-gray-800/30 rounded-lg border border-red-500/20">
              <p className="text-xs text-gray-400 mb-1">Failed</p>
              <p className="text-xl font-bold text-red-400">{stats.failed}</p>
            </div>
          </div>

          {/* Success Rate */}
          <div className="p-3 bg-gray-800/30 rounded-lg border border-gray-700/30">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-400">Success Rate</p>
              <p className="text-sm font-bold text-white">{stats.successRate.toFixed(1)}%</p>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-green-500 to-green-400 h-2 rounded-full transition-all duration-500"
                style={{ width: `${stats.successRate}%` }}
              />
            </div>
          </div>

          {/* Event Breakdown */}
          {Object.keys(stats.eventCounts).length > 0 && (
            <div>
              <p className="text-sm text-gray-400 mb-2">Events by Type</p>
              <div className="space-y-2">
                {Object.entries(stats.eventCounts).map(([event, count]) => (
                  <div 
                    key={event}
                    className="flex items-center justify-between p-2 bg-gray-800/20 rounded-lg"
                  >
                    <div className="flex items-center gap-2">
                      {eventTypeIcons[event] || <Activity className="w-4 h-4 text-gray-400" />}
                      <span className="text-sm text-gray-300">{event}</span>
                    </div>
                    <span className="text-sm font-medium text-white">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Revenue Summary */}
          {revenueStats && revenueStats.total > 0 && (
            <div className="p-3 bg-gradient-to-r from-green-900/20 to-emerald-900/20 border border-green-500/30 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-400 mb-1">Revenue Tracked</p>
                  <p className="text-2xl font-bold text-green-400">
                    ${revenueStats.total.toFixed(2)}
                  </p>
                </div>
                <DollarSign className="w-8 h-8 text-green-400 opacity-50" />
              </div>
              {Object.keys(revenueStats.byType).length > 0 && (
                <div className="mt-2 pt-2 border-t border-green-500/20">
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    {Object.entries(revenueStats.byType).map(([type, amount]) => (
                      <div key={type}>
                        <p className="text-gray-400 capitalize">{type}</p>
                        <p className="text-white font-medium">${amount.toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-8">
          <Activity className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400 text-sm">No webhook events received yet</p>
          <p className="text-gray-500 text-xs mt-1">
            Configure webhooks in Settings to start tracking events
          </p>
        </div>
      )}
    </GlassCard>
  );
}
