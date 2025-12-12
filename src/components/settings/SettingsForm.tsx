'use client';

import { useState } from 'react';
import GlassCard from '@/components/ui/GlassCard';
import NeonInput from '@/components/ui/NeonInput';
import NeonButton from '@/components/ui/NeonButton';

export default function SettingsForm() {
  const [aiProvider, setAiProvider] = useState('openai');
  const [apiKey, setApiKey] = useState('');
  const [temperature, setTemperature] = useState(0.7);
  const [notifications, setNotifications] = useState(true);
  const [autoResponse, setAutoResponse] = useState(false);

  const handleSave = () => {
    console.log('Saving settings...', {
      aiProvider,
      apiKey: apiKey ? '***' : '',
      temperature,
      notifications,
      autoResponse,
    });
    // TODO: Save settings to your backend/database
  };

  return (
    <>
      {/* AI Configuration */}
      <GlassCard className="p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-white mb-2">AI Configuration</h2>
          <p className="text-gray-400 text-sm">Configure your AI assistant settings</p>
        </div>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">
              AI Provider
            </label>
            <select 
              className="w-full px-4 py-2.5 bg-gray-900/50 backdrop-blur-sm border-2 border-blue-500/30 rounded-lg text-white focus:outline-none focus:border-blue-500 focus:shadow-[0_0_20px_rgba(59,130,246,0.4)] transition-all duration-300"
              value={aiProvider}
              onChange={(e) => setAiProvider(e.target.value)}
            >
              <option value="openai">OpenAI (GPT-4)</option>
              <option value="anthropic">Anthropic (Claude)</option>
              <option value="custom">Custom Model</option>
            </select>
          </div>
          
          <NeonInput
            label="API Key"
            type="password"
            placeholder="Enter your API key"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
          />

          <div>
            <label className="block text-sm font-medium text-gray-200 mb-3">
              Temperature: {temperature.toFixed(1)}
            </label>
            <div className="flex items-center gap-4">
              <span className="text-xs text-gray-400">Conservative</span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={temperature}
                onChange={(e) => setTemperature(parseFloat(e.target.value))}
                className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(59,130,246,0.5)]"
              />
              <span className="text-xs text-gray-400">Creative</span>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Controls randomness: lower is more focused, higher is more creative
            </p>
          </div>
        </div>
      </GlassCard>

      {/* General Settings */}
      <GlassCard className="p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-white mb-2">General Settings</h2>
          <p className="text-gray-400 text-sm">Manage your app preferences</p>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-800/30 rounded-lg border border-gray-700/30 hover:bg-gray-800/50 transition-all">
            <div className="flex-1">
              <p className="font-medium text-white">Enable Notifications</p>
              <p className="text-sm text-gray-400 mt-1">Receive alerts for new messages and activity</p>
            </div>
            <button
              onClick={() => setNotifications(!notifications)}
              className={`relative w-14 h-7 rounded-full transition-all duration-300 ${
                notifications ? 'bg-blue-600 shadow-[0_0_15px_rgba(59,130,246,0.5)]' : 'bg-gray-600'
              }`}
            >
              <div className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform duration-300 ${
                notifications ? 'translate-x-7' : 'translate-x-0'
              }`} />
            </button>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-gray-800/30 rounded-lg border border-gray-700/30 hover:bg-gray-800/50 transition-all">
            <div className="flex-1">
              <p className="font-medium text-white">Auto-response</p>
              <p className="text-sm text-gray-400 mt-1">Automatically respond to messages using AI</p>
            </div>
            <button
              onClick={() => setAutoResponse(!autoResponse)}
              className={`relative w-14 h-7 rounded-full transition-all duration-300 ${
                autoResponse ? 'bg-blue-600 shadow-[0_0_15px_rgba(59,130,246,0.5)]' : 'bg-gray-600'
              }`}
            >
              <div className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform duration-300 ${
                autoResponse ? 'translate-x-7' : 'translate-x-0'
              }`} />
            </button>
          </div>
        </div>
      </GlassCard>

      {/* Save Button */}
      <div className="flex justify-end gap-3">
        <NeonButton 
          variant="secondary"
          onClick={() => window.location.reload()}
        >
          Reset
        </NeonButton>
        <NeonButton 
          variant="primary"
          onClick={handleSave}
        >
          Save Settings
        </NeonButton>
      </div>
    </>
  );
}
