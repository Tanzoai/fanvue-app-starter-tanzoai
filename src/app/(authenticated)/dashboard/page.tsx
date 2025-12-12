import { DollarSign, Users, MessageSquare, TrendingUp, Zap, Bot, Clock, Activity, AlertCircle, CheckCircle, Lightbulb } from 'lucide-react';
import KPICard from '@/components/analytics/KPICard';
import RevenueChart from '@/components/analytics/RevenueChart';
import PPVAnalytics from '@/components/analytics/PPVAnalytics';
import PredictiveInsights from '@/components/analytics/PredictiveInsights';
import GlassCard from '@/components/ui/GlassCard';
import StatusBadge from '@/components/ui/StatusBadge';
import { getCurrentUser } from '@/lib/fanvue';
import { getFanvueStats } from '@/lib/fanvue-api';

// Mock automation data - TODO: fetch from API
const automationStats = {
  revenueToday: 1240,
  revenueBot: 890,
  revenueManual: 350,
  ppvRevenue: 670,
  scriptsTriggered: 45,
  scriptResponseRate: 68,
  topScript: 'Welcome Script - Photo Set',
  avgResponseTime: 2.3,
  messagesAutoToday: 128,
  messageOpenRate: 72,
  newSubscribers: 12,
  reactivatedFans: 8,
  projectedMonthly: 38200,
  timeAutomated: 6.5,
};

export default async function DashboardPage() {
  // Get real Fanvue user data
  const user = await getCurrentUser();
  const stats = await getFanvueStats();

  // Extract real data from user profile
  const followersCount = user?.fanCounts?.followersCount ?? 0;
  const subscribersCount = user?.fanCounts?.subscribersCount ?? 0;
  const imageCount = user?.contentCounts?.imageCount ?? 0;
  const videoCount = user?.contentCounts?.videoCount ?? 0;
  const postCount = user?.contentCounts?.postCount ?? 0;
  const totalContent = imageCount + videoCount + postCount;

  // Calculate engagement rate (example calculation)
  const engagementRate = followersCount > 0 
    ? ((subscribersCount / followersCount) * 100).toFixed(1)
    : '0.0';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Automation Dashboard</h1>
        <p className="text-gray-400">
          Real-time monitoring of your Fanvue automation performance
        </p>
      </div>

      {/* Main KPI Cards - Automated Revenue */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <KPICard
          title="Revenue Today"
          value={`$${automationStats.revenueToday}`}
          change={15.3}
          trend="up"
          icon={DollarSign}
          color="green"
          subtitle={`Bot: $${automationStats.revenueBot} | Manual: $${automationStats.revenueManual}`}
        />
        <KPICard
          title="PPV Revenue"
          value={`$${automationStats.ppvRevenue}`}
          change={22.1}
          trend="up"
          icon={Zap}
          color="yellow"
          subtitle="From automated scripts"
        />
        <KPICard
          title="Scripts Triggered"
          value={automationStats.scriptsTriggered.toString()}
          change={8.5}
          trend="up"
          icon={Bot}
          color="purple"
          subtitle={`${automationStats.scriptResponseRate}% response rate`}
        />
        <KPICard
          title="Monthly Projection"
          value={`$${automationStats.projectedMonthly.toLocaleString()}`}
          change={12.7}
          trend="up"
          icon={TrendingUp}
          color="blue"
          subtitle="Based on automation"
        />
      </div>

      {/* Secondary KPIs - Engagement */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <GlassCard className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Auto Messages</span>
            <MessageSquare className="w-4 h-4 text-blue-400" />
          </div>
          <p className="text-2xl font-bold text-white">{automationStats.messagesAutoToday}</p>
          <p className="text-xs text-gray-500 mt-1">{automationStats.messageOpenRate}% open rate</p>
        </GlassCard>

        <GlassCard className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">New Subscribers</span>
            <Users className="w-4 h-4 text-green-400" />
          </div>
          <p className="text-2xl font-bold text-white">{automationStats.newSubscribers}</p>
          <p className="text-xs text-gray-500 mt-1">Via Welcome Scripts</p>
        </GlassCard>

        <GlassCard className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Reactivated Fans</span>
            <TrendingUp className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-2xl font-bold text-white">{automationStats.reactivatedFans}</p>
          <p className="text-xs text-gray-500 mt-1">Re-engagement Scripts</p>
        </GlassCard>

        <GlassCard className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Response Time</span>
            <Clock className="w-4 h-4 text-yellow-400" />
          </div>
          <p className="text-2xl font-bold text-white">{automationStats.avgResponseTime}s</p>
          <p className="text-xs text-gray-500 mt-1">Average bot response</p>
        </GlassCard>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* PPV Analytics */}
        <div className="lg:col-span-2">
          <PPVAnalytics />
        </div>

        {/* System Status */}
        <GlassCard className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <Activity className="w-5 h-5 text-green-400" />
            <h3 className="text-lg font-semibold text-white">System Status</h3>
          </div>

          <div className="space-y-3">
            <div className="p-3 bg-gray-800/30 rounded-lg border border-gray-700/30">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-gray-300">Fanvue Webhooks</span>
                <StatusBadge status="success" label="Connected" />
              </div>
              <p className="text-xs text-gray-500">Last event: 2 min ago</p>
            </div>

            <div className="p-3 bg-gray-800/30 rounded-lg border border-gray-700/30">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-gray-300">OpenRouter APIs</span>
                <StatusBadge status="success" label="3/5 Active" />
              </div>
              <p className="text-xs text-gray-500">Last call: 15 sec ago</p>
            </div>

            <div className="p-3 bg-gray-800/30 rounded-lg border border-gray-700/30">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-gray-300">Bio Automation</span>
                <StatusBadge status="active" label="Active" pulse />
              </div>
              <p className="text-xs text-gray-500">Next update: in 2h 15m</p>
            </div>

            <div className="p-3 bg-gray-800/30 rounded-lg border border-gray-700/30">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-gray-300">Active Scripts</span>
                <span className="text-sm font-bold text-green-400">12/15</span>
              </div>
              <p className="text-xs text-gray-500">3 paused manually</p>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Advanced Analytics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Predictive Insights */}
        <PredictiveInsights />

        {/* Top Performers */}
        <GlassCard className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="w-5 h-5 text-purple-400" />
            <h3 className="text-lg font-semibold text-white">Top Performers</h3>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-400 mb-2">Most Profitable Scripts</p>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 bg-gray-800/30 rounded">
                  <span className="text-sm text-white">Welcome - Photo Set</span>
                  <span className="text-sm font-bold text-green-400">$2,340</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-gray-800/30 rounded">
                  <span className="text-sm text-white">Upsell - Custom Video</span>
                  <span className="text-sm font-bold text-green-400">$1,780</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-gray-800/30 rounded">
                  <span className="text-sm text-white">Re-engagement Bundle</span>
                  <span className="text-sm font-bold text-green-400">$1,340</span>
                </div>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-400 mb-2">Best Performing Hours</p>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 bg-gray-800/30 rounded">
                  <span className="text-sm text-white">8:00 PM - 10:00 PM</span>
                  <span className="text-sm font-bold text-purple-400">78%</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-gray-800/30 rounded">
                  <span className="text-sm text-white">2:00 PM - 4:00 PM</span>
                  <span className="text-sm font-bold text-purple-400">65%</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-gray-800/30 rounded">
                  <span className="text-sm text-white">11:00 PM - 1:00 AM</span>
                  <span className="text-sm font-bold text-purple-400">62%</span>
                </div>
              </div>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Live Activity Feed */}
      <div className="grid grid-cols-1 gap-6">
        {/* Live Activity */}
        <GlassCard className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <Zap className="w-5 h-5 text-yellow-400" />
            <h3 className="text-lg font-semibold text-white">Live Activity</h3>
          </div>

          <div className="space-y-2 max-h-96 overflow-y-auto">
            <div className="p-3 bg-green-900/10 border border-green-500/30 rounded-lg">
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-white">PPV paid: $25</p>
                  <p className="text-xs text-gray-400">Upsell Script → @username</p>
                  <p className="text-xs text-gray-500">2 minutes ago</p>
                </div>
              </div>
            </div>

            <div className="p-3 bg-blue-900/10 border border-blue-500/30 rounded-lg">
              <div className="flex items-start gap-2">
                <Bot className="w-4 h-4 text-blue-400 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-white">Welcome Script sent</p>
                  <p className="text-xs text-gray-400">New subscriber: @newuser123</p>
                  <p className="text-xs text-gray-500">5 minutes ago</p>
                </div>
              </div>
            </div>

            <div className="p-3 bg-purple-900/10 border border-purple-500/30 rounded-lg">
              <div className="flex items-start gap-2">
                <Activity className="w-4 h-4 text-purple-400 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-white">Bio updated automatically</p>
                  <p className="text-xs text-gray-400">Template: Sexy & Flirty</p>
                  <p className="text-xs text-gray-500">12 minutes ago</p>
                </div>
              </div>
            </div>

            <div className="p-3 bg-yellow-900/10 border border-yellow-500/30 rounded-lg">
              <div className="flex items-start gap-2">
                <MessageSquare className="w-4 h-4 text-yellow-400 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-white">Re-engagement triggered</p>
                  <p className="text-xs text-gray-400">Inactive fan: @username456</p>
                  <p className="text-xs text-gray-500">18 minutes ago</p>
                </div>
              </div>
            </div>

            <div className="p-3 bg-gray-800/30 border border-gray-700/30 rounded-lg">
              <div className="flex items-start gap-2">
                <Activity className="w-4 h-4 text-gray-400 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-white">Webhook received</p>
                  <p className="text-xs text-gray-400">Event: new_message</p>
                  <p className="text-xs text-gray-500">25 minutes ago</p>
                </div>
              </div>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
