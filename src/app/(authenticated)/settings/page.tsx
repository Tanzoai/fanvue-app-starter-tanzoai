import { CheckCircle, AlertCircle } from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';
import NeonButton from '@/components/ui/NeonButton';
import StatusBadge from '@/components/ui/StatusBadge';
import { getCurrentUser } from '@/lib/fanvue';
import { getSession } from '@/lib/session';
import SettingsForm from '@/components/settings/SettingsForm';
import WebhookConfiguration from '@/components/settings/WebhookConfiguration';
import AIModelTesting from '@/components/settings/AIModelTesting';
import PPVConfiguration from '@/components/settings/PPVConfiguration';

export default async function SettingsPage() {
  // Get real Fanvue user and session data
  const user = await getCurrentUser();
  const session = await getSession();
  
  const fanvueConnected = !!user && !!session;
  const tokenExpiresAt = session ? new Date(session.expiresAt) : null;
  const hasRefreshToken = !!session?.refreshToken;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Settings</h1>
        <p className="text-gray-400">
          Configure your OAuth connections and AI preferences
        </p>
      </div>

      <div className="space-y-6 max-w-4xl">
        {/* OAuth Configuration */}
        <GlassCard className="p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-white mb-2">OAuth Configuration</h2>
            <p className="text-gray-400 text-sm">Manage your Fanvue connection</p>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-3">
                Fanvue Connection
              </label>
              <div className="flex items-center justify-between p-5 bg-gray-800/40 border-2 border-green-500/30 rounded-lg">
                <div className="flex items-center gap-3">
                  {fanvueConnected ? (
                    <CheckCircle className="w-6 h-6 text-green-400" />
                  ) : (
                    <AlertCircle className="w-6 h-6 text-red-400" />
                  )}
                  <div>
                    <StatusBadge 
                      status={fanvueConnected ? 'active' : 'error'} 
                      pulse={fanvueConnected}
                    />
                    <p className="text-sm text-gray-400 mt-1">
                      {fanvueConnected 
                        ? `Connected as @${user?.handle}` 
                        : 'Not connected'}
                    </p>
                  </div>
                </div>
                <form action="/api/oauth/logout" method="POST">
                  <NeonButton 
                    variant="danger"
                    size="sm"
                    type="submit"
                  >
                    Disconnect
                  </NeonButton>
                </form>
              </div>
            </div>

            {/* Session Info */}
            {session && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="p-4 bg-gray-800/30 rounded-lg border border-gray-700/30">
                  <p className="text-sm text-gray-400 mb-1">Token Expires</p>
                  <p className="text-white font-medium text-sm">
                    {tokenExpiresAt?.toLocaleString()}
                  </p>
                </div>
                <div className="p-4 bg-gray-800/30 rounded-lg border border-gray-700/30">
                  <p className="text-sm text-gray-400 mb-1">Refresh Token</p>
                  <p className="text-white font-medium">
                    {hasRefreshToken ? (
                      <StatusBadge status="success" label="Available" />
                    ) : (
                      <StatusBadge status="error" label="Not Available" />
                    )}
                  </p>
                </div>
              </div>
            )}
          </div>
        </GlassCard>

        {/* Webhook Configuration */}
        <WebhookConfiguration />

        {/* AI Model Testing */}
        <AIModelTesting />

        {/* PPV Configuration */}
        <PPVConfiguration />

        {/* AI Configuration and General Settings */}
        <SettingsForm />
      </div>
    </div>
  );
}
