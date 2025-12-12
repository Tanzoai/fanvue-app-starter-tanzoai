'use client';

import { useState, useEffect } from 'react';
import { Copy, CheckCircle, RefreshCw, Activity, Webhook } from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';
import NeonButton from '@/components/ui/NeonButton';
import StatusBadge from '@/components/ui/StatusBadge';

export default function WebhookConfiguration() {
  const [webhookUrl, setWebhookUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [testing, setTesting] = useState(false);
  const [webhookStatus, setWebhookStatus] = useState<'active' | 'inactive' | 'error'>('inactive');
  const [recentEvents, setRecentEvents] = useState<Array<{
    id: string;
    event: string;
    timestamp: string;
    status: 'success' | 'error';
  }>>([]);

  useEffect(() => {
    // Generate webhook URL based on current domain
    const baseUrl = window.location.origin;
    setWebhookUrl(`${baseUrl}/api/webhooks/fanvue`);
    
    // Fetch recent events from API
    fetchWebhookStats();
  }, []);

  const fetchWebhookStats = async () => {
    try {
      const response = await fetch('/api/webhooks/stats');
      if (response.ok) {
        const data = await response.json();
        if (data.recentEvents && data.recentEvents.length > 0) {
          setRecentEvents(data.recentEvents);
          setWebhookStatus('active');
        }
      }
    } catch (error) {
      console.error('Failed to fetch webhook stats:', error);
    }
  };

  const copyWebhookUrl = async () => {
    try {
      await navigator.clipboard.writeText(webhookUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const testWebhook = async () => {
    setTesting(true);
    try {
      const response = await fetch('/api/webhooks/fanvue', {
        method: 'GET',
      });
      
      if (response.ok) {
        setWebhookStatus('active');
        // Add test event to recent events
        setRecentEvents(prev => [{
          id: Date.now().toString(),
          event: 'webhook.test',
          timestamp: new Date().toISOString(),
          status: 'success'
        }, ...prev.slice(0, 9)]);
      } else {
        setWebhookStatus('error');
      }
    } catch (error) {
      console.error('Webhook test failed:', error);
      setWebhookStatus('error');
    } finally {
      setTesting(false);
    }
  };

  const eventTypeLabels: Record<string, { label: string; color: string }> = {
    'message.received': { label: 'Message Received', color: 'text-blue-400' },
    'subscriber.new': { label: 'New Subscriber', color: 'text-green-400' },
    'tip.received': { label: 'Tip Received', color: 'text-yellow-400' },
    'purchase.received': { label: 'Purchase Made', color: 'text-purple-400' },
    'subscription.renewed': { label: 'Subscription Renewed', color: 'text-cyan-400' },
    'subscription.cancelled': { label: 'Subscription Cancelled', color: 'text-red-400' },
    'webhook.test': { label: 'Test Event', color: 'text-gray-400' },
  };

  return (
    <GlassCard className="p-6">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <Webhook className="w-6 h-6 text-purple-400" />
          <h2 className="text-2xl font-semibold text-white">Webhook Configuration</h2>
        </div>
        <p className="text-gray-400 text-sm">
          Configure webhooks to receive real-time events from Fanvue
        </p>
      </div>

      <div className="space-y-6">
        {/* Webhook URL */}
        <div>
          <label className="block text-sm font-medium text-gray-200 mb-2">
            Webhook URL
          </label>
          <div className="flex gap-2">
            <div className="flex-1 px-4 py-3 bg-gray-900/50 backdrop-blur-sm border-2 border-purple-500/30 rounded-lg text-white font-mono text-sm">
              {webhookUrl || 'Loading...'}
            </div>
            <NeonButton
              variant={copied ? 'success' : 'secondary'}
              size="sm"
              onClick={copyWebhookUrl}
              className="min-w-[100px]"
            >
              <Copy className="w-4 h-4 mr-1" />
              <span suppressHydrationWarning>{copied ? 'Copied' : 'Copy'}</span>
            </NeonButton>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Copy this URL and paste it in your Fanvue Developer Area webhook settings
          </p>
        </div>

        {/* Webhook Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-gray-800/30 rounded-lg border border-gray-700/30">
            <p className="text-sm text-gray-400 mb-2">Webhook Status</p>
            <StatusBadge 
              status={webhookStatus} 
              pulse={webhookStatus === 'active'}
            />
          </div>
          <div className="p-4 bg-gray-800/30 rounded-lg border border-gray-700/30">
            <p className="text-sm text-gray-400 mb-2">Events Received</p>
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-purple-400" />
              <p className="text-white font-medium text-lg">{recentEvents.length}</p>
              <span className="text-xs text-gray-500">(last 10)</span>
            </div>
          </div>
        </div>

        {/* Test Webhook */}
        <div className="p-4 bg-purple-900/10 border border-purple-500/30 rounded-lg">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h3 className="font-medium text-white mb-1">Test Connection</h3>
              <p className="text-sm text-gray-400">
                Verify that your webhook endpoint is accessible and responding correctly
              </p>
            </div>
            <NeonButton
              variant="primary"
              size="sm"
              onClick={testWebhook}
              disabled={testing}
            >
              {testing ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-1 animate-spin" />
                  Testing...
                </>
              ) : (
                'Test Webhook'
              )}
            </NeonButton>
          </div>
        </div>

        {/* Setup Instructions */}
        <div className="p-4 bg-blue-900/10 border border-blue-500/30 rounded-lg">
          <h3 className="font-medium text-white mb-3">Setup Instructions</h3>
          <ol className="space-y-2 text-sm text-gray-300">
            <li className="flex gap-2">
              <span className="font-bold text-blue-400 min-w-[20px]">1.</span>
              <span>Go to <a href="https://fanvue.com/developers" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">Fanvue Developer Area</a></span>
            </li>
            <li className="flex gap-2">
              <span className="font-bold text-blue-400 min-w-[20px]">2.</span>
              <span>Navigate to Webhooks settings</span>
            </li>
            <li className="flex gap-2">
              <span className="font-bold text-blue-400 min-w-[20px]">3.</span>
              <span>Copy and paste the webhook URL above</span>
            </li>
            <li className="flex gap-2">
              <span className="font-bold text-blue-400 min-w-[20px]">4.</span>
              <span>Select the events you want to receive (recommended: all events)</span>
            </li>
            <li className="flex gap-2">
              <span className="font-bold text-blue-400 min-w-[20px]">5.</span>
              <span>Save your WEBHOOK_SECRET in your environment variables</span>
            </li>
            <li className="flex gap-2">
              <span className="font-bold text-blue-400 min-w-[20px]">6.</span>
              <span>Click "Test Webhook" above to verify the connection</span>
            </li>
          </ol>
        </div>

        {/* Supported Events */}
        <div>
          <h3 className="font-medium text-white mb-3">Supported Events</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {Object.entries(eventTypeLabels).filter(([key]) => key !== 'webhook.test').map(([event, { label, color }]) => (
              <div key={event} className="p-3 bg-gray-800/30 rounded-lg border border-gray-700/30">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${color.replace('text-', 'bg-')}`} />
                  <span className="text-sm font-medium text-white">{label}</span>
                </div>
                <p className="text-xs text-gray-500 mt-1 ml-4">{event}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Events */}
        {recentEvents.length > 0 && (
          <div>
            <h3 className="font-medium text-white mb-3">Recent Events</h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {recentEvents.map((event) => {
                const eventInfo = eventTypeLabels[event.event] || { label: event.event, color: 'text-gray-400' };
                return (
                  <div key={event.id} className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg border border-gray-700/30">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${event.status === 'success' ? 'bg-green-400' : 'bg-red-400'}`} />
                      <div>
                        <p className={`text-sm font-medium ${eventInfo.color}`}>
                          {eventInfo.label}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(event.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <StatusBadge status={event.status === 'success' ? 'success' : 'error'} />
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Environment Variable Reminder */}
        <div className="p-4 bg-yellow-900/10 border border-yellow-500/30 rounded-lg">
          <h3 className="font-medium text-yellow-300 mb-2 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            Important: Environment Variable Required
          </h3>
          <p className="text-sm text-gray-300">
            Make sure to add <code className="px-2 py-1 bg-gray-800 rounded text-yellow-300 font-mono text-xs">WEBHOOK_SECRET</code> to your <code className="px-2 py-1 bg-gray-800 rounded text-yellow-300 font-mono text-xs">.env.local</code> file.
            This secret should be the same one configured in your Fanvue Developer Area.
          </p>
        </div>
      </div>
    </GlassCard>
  );
}

function AlertCircle({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  );
}
