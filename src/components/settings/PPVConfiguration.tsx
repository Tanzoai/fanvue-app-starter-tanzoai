'use client';

import { useState } from 'react';
import { DollarSign, Clock, Percent, Save } from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';
import NeonButton from '@/components/ui/NeonButton';
import NeonInput from '@/components/ui/NeonInput';

export default function PPVConfiguration() {
  const [config, setConfig] = useState({
    expirationHours: 24,
    reminderEnabled: true,
    reminderHours: 12,
    commissionRate: 20,
    autoResendEnabled: false,
    maxResendAttempts: 2,
  });

  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      // TODO: Save to API/database
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert('PPV configuration saved successfully!');
    } catch (error) {
      console.error('Failed to save PPV configuration:', error);
      alert('Failed to save configuration');
    } finally {
      setSaving(false);
    }
  };

  return (
    <GlassCard className="p-6">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <DollarSign className="w-6 h-6 text-green-400" />
          <h2 className="text-2xl font-semibold text-white">PPV Configuration</h2>
        </div>
        <p className="text-gray-400 text-sm">
          Configure how PPV (Pay-Per-View) content is managed
        </p>
      </div>

      <div className="space-y-6">
        {/* Expiration Settings */}
        <div className="p-4 bg-blue-900/10 border border-blue-500/30 rounded-lg">
          <div className="flex items-center gap-2 mb-3">
            <Clock className="w-5 h-5 text-blue-400" />
            <h3 className="font-medium text-white">Expiration Settings</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                PPV Expiration Time (hours)
              </label>
              <input
                type="number"
                min="1"
                max="168"
                className="w-full px-4 py-2.5 bg-gray-900/50 backdrop-blur-sm border-2 border-blue-500/30 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-all duration-300"
                value={config.expirationHours}
                onChange={(e) => setConfig({ ...config, expirationHours: parseInt(e.target.value) })}
              />
              <p className="mt-1 text-xs text-gray-500">
                How long fans have to purchase PPV content before it expires (1-168 hours)
              </p>
            </div>
          </div>
        </div>

        {/* Reminder Settings */}
        <div className="p-4 bg-purple-900/10 border border-purple-500/30 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-purple-400" />
              <h3 className="font-medium text-white">Automatic Reminders</h3>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={config.reminderEnabled}
                onChange={(e) => setConfig({ ...config, reminderEnabled: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-500"></div>
            </label>
          </div>

          {config.reminderEnabled && (
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Send reminder after (hours)
              </label>
              <input
                type="number"
                min="1"
                max={config.expirationHours}
                className="w-full px-4 py-2.5 bg-gray-900/50 backdrop-blur-sm border-2 border-purple-500/30 rounded-lg text-white focus:outline-none focus:border-purple-500 transition-all duration-300"
                value={config.reminderHours}
                onChange={(e) => setConfig({ ...config, reminderHours: parseInt(e.target.value) })}
              />
              <p className="mt-1 text-xs text-gray-500">
                Automatically send a reminder if PPV hasn't been purchased
              </p>
            </div>
          )}
        </div>

        {/* Commission Settings */}
        <div className="p-4 bg-green-900/10 border border-green-500/30 rounded-lg">
          <div className="flex items-center gap-2 mb-3">
            <Percent className="w-5 h-5 text-green-400" />
            <h3 className="font-medium text-white">Commission Settings</h3>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">
              Platform Commission Rate (%)
            </label>
            <input
              type="number"
              min="0"
              max="100"
              step="0.1"
              className="w-full px-4 py-2.5 bg-gray-900/50 backdrop-blur-sm border-2 border-green-500/30 rounded-lg text-white focus:outline-none focus:border-green-500 transition-all duration-300"
              value={config.commissionRate}
              onChange={(e) => setConfig({ ...config, commissionRate: parseFloat(e.target.value) })}
            />
            <p className="mt-1 text-xs text-gray-500">
              Percentage to deduct from PPV revenue (e.g., Fanvue's fee)
            </p>
          </div>

          {/* Revenue Calculator */}
          <div className="mt-4 p-3 bg-gray-800/30 rounded-lg">
            <p className="text-xs text-gray-400 mb-2">Revenue Calculator:</p>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div>
                <p className="text-gray-500">PPV Price</p>
                <p className="font-bold text-white">$25.00</p>
              </div>
              <div>
                <p className="text-gray-500">Commission</p>
                <p className="font-bold text-red-400">
                  -${(25 * (config.commissionRate / 100)).toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-gray-500">You Earn</p>
                <p className="font-bold text-green-400">
                  ${(25 * (1 - config.commissionRate / 100)).toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Auto-Resend Settings */}
        <div className="p-4 bg-yellow-900/10 border border-yellow-500/30 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-yellow-400" />
              <h3 className="font-medium text-white">Auto-Resend PPV</h3>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={config.autoResendEnabled}
                onChange={(e) => setConfig({ ...config, autoResendEnabled: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-500"></div>
            </label>
          </div>

          {config.autoResendEnabled && (
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Maximum resend attempts
              </label>
              <input
                type="number"
                min="1"
                max="5"
                className="w-full px-4 py-2.5 bg-gray-900/50 backdrop-blur-sm border-2 border-yellow-500/30 rounded-lg text-white focus:outline-none focus:border-yellow-500 transition-all duration-300"
                value={config.maxResendAttempts}
                onChange={(e) => setConfig({ ...config, maxResendAttempts: parseInt(e.target.value) })}
              />
              <p className="mt-1 text-xs text-gray-500">
                Automatically resend expired PPV content to fans who didn't purchase
              </p>
            </div>
          )}
        </div>

        {/* Content Types */}
        <div className="p-4 bg-gray-800/30 rounded-lg border border-gray-700/30">
          <h3 className="font-medium text-white mb-3">Available Content Types</h3>
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 bg-pink-900/10 border border-pink-500/30 rounded-lg">
              <div className="text-center">
                <p className="text-2xl mb-1">📸</p>
                <p className="text-sm font-medium text-white">Photos</p>
                <p className="text-xs text-gray-400 mt-1">Exclusive photo sets</p>
              </div>
            </div>
            <div className="p-3 bg-purple-900/10 border border-purple-500/30 rounded-lg">
              <div className="text-center">
                <p className="text-2xl mb-1">🎥</p>
                <p className="text-sm font-medium text-white">Videos</p>
                <p className="text-xs text-gray-400 mt-1">Premium video content</p>
              </div>
            </div>
            <div className="p-3 bg-yellow-900/10 border border-yellow-500/30 rounded-lg">
              <div className="text-center">
                <p className="text-2xl mb-1">🎁</p>
                <p className="text-sm font-medium text-white">Bundles</p>
                <p className="text-xs text-gray-400 mt-1">Photo + Video packs</p>
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex items-center gap-3 pt-4">
          <NeonButton
            onClick={handleSave}
            disabled={saving}
            variant="primary"
            className="flex items-center gap-2"
          >
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Configuration
              </>
            )}
          </NeonButton>
        </div>
      </div>
    </GlassCard>
  );
}
