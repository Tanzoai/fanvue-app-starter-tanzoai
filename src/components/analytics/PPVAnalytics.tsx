'use client';

import { useState } from 'react';
import { DollarSign, TrendingUp, Send, CheckCircle, BarChart3, PieChart } from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';

interface PPVStats {
  sentToday: number;
  paidToday: number;
  revenueTodaynet: number;
  revenueToday: number;
  conversionRate: number;
  revenueWeek: number;
  revenueMonth: number;
  topScripts: Array<{
    name: string;
    sent: number;
    revenue: number;
  }>;
}

export default function PPVAnalytics() {
  // Mock data - TODO: fetch from API
  const [stats] = useState<PPVStats>({
    sentToday: 45,
    paidToday: 28,
    revenueToday: 670,
    revenueTodaynet: 536, // After 20% commission
    conversionRate: 62,
    revenueWeek: 3240,
    revenueMonth: 12580,
    topScripts: [
      { name: 'Welcome Script - Photo Set', sent: 156, revenue: 2340 },
      { name: 'Upsell - Custom Video', sent: 89, revenue: 1780 },
      { name: 'Re-engagement - Bundle Offer', sent: 67, revenue: 1340 },
    ],
  });

  // Mock data for charts
  const revenueBySource = [
    { name: 'PPV Automatiques', value: 670, color: '#fbbf24' },
    { name: 'Tips Bots', value: 230, color: '#3b82f6' },
    { name: 'Abonnements Scripts', value: 320, color: '#10b981' },
    { name: 'Manuel', value: 150, color: '#8b5cf6' },
  ];

  const scriptPerformance = [
    { date: 'Mon', welcome: 12, firstMsg: 8, reengage: 5, upsell: 7, retention: 3 },
    { date: 'Tue', welcome: 15, firstMsg: 10, reengage: 7, upsell: 9, retention: 4 },
    { date: 'Wed', welcome: 18, firstMsg: 12, reengage: 9, upsell: 12, retention: 6 },
    { date: 'Thu', welcome: 14, firstMsg: 9, reengage: 6, upsell: 8, retention: 5 },
    { date: 'Fri', welcome: 22, firstMsg: 15, reengage: 11, upsell: 14, retention: 8 },
    { date: 'Sat', welcome: 25, firstMsg: 18, reengage: 13, upsell: 16, retention: 9 },
    { date: 'Sun', welcome: 20, firstMsg: 14, reengage: 10, upsell: 12, retention: 7 },
  ];

  const botVsManual = [
    { metric: 'Messages', bot: 128, manual: 42 },
    { metric: 'Revenus ($)', bot: 1240, manual: 350 },
    { metric: 'Temps (h)', bot: 6.5, manual: 2.1 },
  ];

  return (
    <div className="space-y-6">
      {/* PPV Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Sent Today */}
        <div className="p-4 bg-blue-900/10 border border-blue-500/30 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Send className="w-4 h-4 text-blue-400" />
            <p className="text-xs text-gray-400">PPV Envoyés Auj.</p>
          </div>
          <p className="text-2xl font-bold text-white">{stats.sentToday}</p>
        </div>

        {/* Paid Today */}
        <div className="p-4 bg-green-900/10 border border-green-500/30 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-4 h-4 text-green-400" />
            <p className="text-xs text-gray-400">PPV Payés Auj.</p>
          </div>
          <p className="text-2xl font-bold text-white">{stats.paidToday}</p>
        </div>

        {/* Conversion Rate */}
        <div className="p-4 bg-purple-900/10 border border-purple-500/30 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-purple-400" />
            <p className="text-xs text-gray-400">Taux Conversion</p>
          </div>
          <p className="text-2xl font-bold text-white">{stats.conversionRate}%</p>
        </div>

        {/* Revenue Today */}
        <div className="p-4 bg-yellow-900/10 border border-yellow-500/30 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-4 h-4 text-yellow-400" />
            <p className="text-xs text-gray-400">Revenus Auj.</p>
          </div>
          <p className="text-2xl font-bold text-white">${stats.revenueToday}</p>
          <p className="text-xs text-green-400 mt-1">
            Net: ${stats.revenueTodaynet}
          </p>
        </div>
      </div>

      {/* Advanced Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue by Source */}
        <GlassCard className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <PieChart className="w-5 h-5 text-yellow-400" />
            <h3 className="text-lg font-semibold text-white">Revenus par Source</h3>
          </div>

          <div className="flex items-center justify-center h-64">
            <div className="relative w-48 h-48">
              {/* Simple pie chart visualization */}
              <div className="w-full h-full rounded-full border-8 border-gray-700 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-xs text-gray-400">Total</p>
                  <p className="text-xl font-bold text-white">${stats.revenueToday}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 space-y-2">
            {revenueBySource.map((item, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-gray-300">{item.name}</span>
                </div>
                <span className="font-medium text-white">${item.value}</span>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Script Performance Over Time */}
        <GlassCard className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <BarChart3 className="w-5 h-5 text-blue-400" />
            <h3 className="text-lg font-semibold text-white">Performance Scripts</h3>
          </div>

          <div className="h-64 flex items-end justify-between px-2">
            {scriptPerformance.map((day, index) => (
              <div key={index} className="flex flex-col items-center gap-1 flex-1">
                <div className="flex items-end justify-center gap-0.5 h-40 w-full">
                  <div 
                    className="w-2 bg-blue-500 rounded-t" 
                    style={{ height: `${(day.welcome / 30) * 100}%` }}
                    title={`Welcome: ${day.welcome}`}
                  ></div>
                  <div 
                    className="w-2 bg-purple-500 rounded-t" 
                    style={{ height: `${(day.upsell / 30) * 100}%` }}
                    title={`Upsell: ${day.upsell}`}
                  ></div>
                  <div 
                    className="w-2 bg-green-500 rounded-t" 
                    style={{ height: `${(day.reengage / 30) * 100}%` }}
                    title={`Re-engagement: ${day.reengage}`}
                  ></div>
                </div>
                <span className="text-xs text-gray-400 mt-1">{day.date}</span>
              </div>
            ))}
          </div>

          <div className="mt-4 flex justify-center gap-4">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-blue-500 rounded"></div>
              <span className="text-xs text-gray-400">Welcome</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-purple-500 rounded"></div>
              <span className="text-xs text-gray-400">Upsell</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-green-500 rounded"></div>
              <span className="text-xs text-gray-400">Re-engagement</span>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Bot vs Manual Performance */}
      <GlassCard className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <BarChart3 className="w-5 h-5 text-purple-400" />
          <h3 className="text-lg font-semibold text-white">Bot vs Manuel</h3>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {botVsManual.map((item, index) => (
            <div key={index} className="text-center">
              <div className="flex items-end justify-center gap-2 h-32 mb-3">
                <div 
                  className="w-8 bg-blue-500 rounded-t flex items-end justify-center pb-1"
                  style={{ height: `${(item.bot / Math.max(...botVsManual.map(i => i.bot))) * 100}%` }}
                >
                  <span className="text-xs text-white rotate-90 origin-center transform translate-y-4">{item.bot}</span>
                </div>
                <div 
                  className="w-8 bg-gray-500 rounded-t flex items-end justify-center pb-1"
                  style={{ height: `${(item.manual / Math.max(...botVsManual.map(i => i.manual))) * 100}%` }}
                >
                  <span className="text-xs text-white rotate-90 origin-center transform translate-y-4">{item.manual}</span>
                </div>
              </div>
              <p className="text-sm text-gray-400">{item.metric}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 flex justify-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-500 rounded"></div>
            <span className="text-sm text-gray-300">Automatisé</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-500 rounded"></div>
            <span className="text-sm text-gray-300">Manuel</span>
          </div>
        </div>
      </GlassCard>

      {/* Top Performing Scripts */}
      <GlassCard className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <TrendingUp className="w-5 h-5 text-purple-400" />
          <h3 className="text-lg font-semibold text-white">Top Scripts Performants</h3>
        </div>

        <div className="space-y-3">
          {stats.topScripts.map((script, index) => (
            <div
              key={index}
              className="p-4 bg-gray-800/30 rounded-lg border border-gray-700/30"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className={`
                    w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold
                    ${index === 0 ? 'bg-yellow-500/20 text-yellow-400' : ''}
                    ${index === 1 ? 'bg-gray-400/20 text-gray-400' : ''}
                    ${index === 2 ? 'bg-orange-500/20 text-orange-400' : ''}
                  `}>
                    #{index + 1}
                  </div>
                  <p className="font-medium text-white text-sm">{script.name}</p>
                </div>
                <p className="font-bold text-green-400">${script.revenue}</p>
              </div>
              <div className="flex items-center justify-between text-xs text-gray-400">
                <span>Envoyés: {script.sent}</span>
                <span>Moy.: ${(script.revenue / script.sent).toFixed(2)}/PPV</span>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
