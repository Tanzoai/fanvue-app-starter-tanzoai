'use client';

import { useState } from 'react';
import { User, Sparkles, Clock, Save, Play, Pause, RefreshCw } from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';
import NeonButton from '@/components/ui/NeonButton';
import NeonInput from '@/components/ui/NeonInput';
import StatusBadge from '@/components/ui/StatusBadge';

const BIO_TEMPLATES = [
  { id: 'sexy', name: 'Sexy & Flirty', emoji: '🔥', description: 'Provocative and seductive' },
  { id: 'romantic', name: 'Romantic', emoji: '💕', description: 'Sweet and affectionate' },
  { id: 'mysterious', name: 'Mysterious', emoji: '🌙', description: 'Enigmatic and intriguing' },
  { id: 'playful', name: 'Playful', emoji: '😈', description: 'Fun and teasing' },
  { id: 'confident', name: 'Confident', emoji: '👑', description: 'Bold and assertive' },
  { id: 'girlfriend', name: 'Girlfriend Experience', emoji: '💖', description: 'Intimate and caring' },
];

export default function ProfileAutomationPage() {
  const [automationEnabled, setAutomationEnabled] = useState(false);
  const [updateFrequency, setUpdateFrequency] = useState(15);
  const [selectedModel, setSelectedModel] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('sexy');
  const [includeKeywords, setIncludeKeywords] = useState('');
  const [excludeKeywords, setExcludeKeywords] = useState('');
  const [currentBio, setCurrentBio] = useState('Hey babe! 🔥 Your favorite fantasy awaits... DM me for exclusive content 💋');
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [nextUpdate, setNextUpdate] = useState<Date | null>(null);

  const handleGenerateBio = async () => {
    setGenerating(true);
    try {
      const response = await fetch('/api/profile/generate-bio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          template: selectedTemplate,
          includeKeywords: includeKeywords.split(',').map(k => k.trim()).filter(k => k),
          excludeKeywords: excludeKeywords.split(',').map(k => k.trim()).filter(k => k),
          model: selectedModel,
        }),
      });

      if (!response.ok) throw new Error('Failed to generate bio');

      const data = await response.json();
      setCurrentBio(data.bio);
    } catch (error) {
      console.error('Error generating bio:', error);
      alert('Failed to generate bio');
    } finally {
      setGenerating(false);
    }
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/profile/automation-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          enabled: automationEnabled,
          frequency: updateFrequency,
          model: selectedModel,
          template: selectedTemplate,
          includeKeywords: includeKeywords.split(',').map(k => k.trim()).filter(k => k),
          excludeKeywords: excludeKeywords.split(',').map(k => k.trim()).filter(k => k),
        }),
      });

      if (!response.ok) throw new Error('Failed to save settings');

      alert('Settings saved successfully!');
      
      if (automationEnabled) {
        const next = new Date();
        next.setHours(next.getHours() + updateFrequency);
        setNextUpdate(next);
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateNow = async () => {
    await handleGenerateBio();
    
    // Update bio on Fanvue
    try {
      const response = await fetch('/api/profile/update-bio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bio: currentBio }),
      });

      if (!response.ok) throw new Error('Failed to update bio');

      setLastUpdated(new Date());
      alert('Bio updated successfully on Fanvue!');
    } catch (error) {
      console.error('Error updating bio:', error);
      alert('Failed to update bio on Fanvue');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Profile Automation</h1>
        <p className="text-gray-400">
          Automatically optimize your Fanvue profile to maximize subscriptions
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Configuration */}
        <div className="lg:col-span-2 space-y-6">
          {/* Automation Control */}
          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Sparkles className="w-6 h-6 text-purple-400" />
                <h2 className="text-2xl font-semibold text-white">Bio Automation</h2>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={automationEnabled}
                  onChange={(e) => setAutomationEnabled(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-14 h-7 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-purple-500"></div>
              </label>
            </div>

            {automationEnabled && (
              <div className="space-y-4">
                <div className="p-3 bg-purple-900/20 border border-purple-500/30 rounded-lg">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-300">Status:</span>
                    <StatusBadge status="active" label="Automation Active" pulse />
                  </div>
                  {lastUpdated && (
                    <div className="flex items-center justify-between text-sm mt-2">
                      <span className="text-gray-300">Last Updated:</span>
                      <span className="text-green-400">{lastUpdated.toLocaleString()}</span>
                    </div>
                  )}
                  {nextUpdate && (
                    <div className="flex items-center justify-between text-sm mt-2">
                      <span className="text-gray-300">Next Update:</span>
                      <span className="text-yellow-400">{nextUpdate.toLocaleString()}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </GlassCard>

          {/* Configuration Settings */}
          <GlassCard className="p-6">
            <h3 className="text-xl font-semibold text-white mb-4">Configuration</h3>
            
            <div className="space-y-6">
              {/* Update Frequency */}
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  <Clock className="w-4 h-4 inline mr-1" />
                  Update Frequency (hours)
                </label>
                <input
                  type="number"
                  min="1"
                  max="72"
                  className="w-full px-4 py-2.5 bg-gray-900/50 backdrop-blur-sm border-2 border-purple-500/30 rounded-lg text-white focus:outline-none focus:border-purple-500 transition-all duration-300"
                  value={updateFrequency}
                  onChange={(e) => setUpdateFrequency(parseInt(e.target.value))}
                />
                <p className="mt-1 text-xs text-gray-500">
                  How often to automatically generate and update your bio (recommended: 12-24 hours)
                </p>
              </div>

              {/* AI Model Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  AI Model
                </label>
                <select
                  className="w-full px-4 py-2.5 bg-gray-900/50 backdrop-blur-sm border-2 border-purple-500/30 rounded-lg text-white focus:outline-none focus:border-purple-500 transition-all duration-300"
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                >
                  <option value="">Use default model</option>
                  <option value="anthropic/claude-3-opus">Claude 3 Opus (Best quality)</option>
                  <option value="anthropic/claude-3-sonnet">Claude 3 Sonnet (Balanced)</option>
                  <option value="openai/gpt-4-turbo">GPT-4 Turbo</option>
                  <option value="openai/gpt-3.5-turbo">GPT-3.5 Turbo (Fast & cheap)</option>
                </select>
              </div>

              {/* Bio Template */}
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-3">
                  Bio Template Style
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {BIO_TEMPLATES.map((template) => (
                    <button
                      key={template.id}
                      onClick={() => setSelectedTemplate(template.id)}
                      className={`p-4 rounded-lg border-2 transition-all text-left ${
                        selectedTemplate === template.id
                          ? 'border-purple-500 bg-purple-500/20'
                          : 'border-gray-700/50 bg-gray-800/30 hover:border-purple-500/50'
                      }`}
                    >
                      <div className="text-2xl mb-1">{template.emoji}</div>
                      <div className="font-medium text-white text-sm">{template.name}</div>
                      <div className="text-xs text-gray-400 mt-1">{template.description}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Keywords */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    Include Keywords
                  </label>
                  <textarea
                    className="w-full px-4 py-2.5 bg-gray-900/50 backdrop-blur-sm border-2 border-green-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-500 transition-all duration-300 min-h-[100px]"
                    placeholder="sexy, exclusive, custom, VIP, premium..."
                    value={includeKeywords}
                    onChange={(e) => setIncludeKeywords(e.target.value)}
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Comma-separated words to include
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    Exclude Keywords
                  </label>
                  <textarea
                    className="w-full px-4 py-2.5 bg-gray-900/50 backdrop-blur-sm border-2 border-red-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-red-500 transition-all duration-300 min-h-[100px]"
                    placeholder="free, cheap, discount..."
                    value={excludeKeywords}
                    onChange={(e) => setExcludeKeywords(e.target.value)}
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Comma-separated words to avoid
                  </p>
                </div>
              </div>
            </div>
          </GlassCard>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <NeonButton
              onClick={handleSaveSettings}
              disabled={saving}
              variant="primary"
              className="flex items-center gap-2"
            >
              {saving ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Settings
                </>
              )}
            </NeonButton>

            <NeonButton
              onClick={handleUpdateNow}
              disabled={generating}
              variant="secondary"
              className="flex items-center gap-2"
            >
              {generating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  Update Now
                </>
              )}
            </NeonButton>
          </div>
        </div>

        {/* Preview & Current Bio */}
        <div className="space-y-6">
          {/* Current Bio */}
          <GlassCard className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <User className="w-5 h-5 text-blue-400" />
              <h3 className="text-lg font-semibold text-white">Current Bio</h3>
            </div>

            <div className="p-4 bg-gray-800/30 rounded-lg border border-gray-700/30 min-h-[150px]">
              <p className="text-white whitespace-pre-wrap">{currentBio}</p>
            </div>

            <div className="mt-4 flex items-center gap-2">
              <NeonButton
                onClick={handleGenerateBio}
                disabled={generating}
                variant="primary"
                size="sm"
                className="flex-1 flex items-center justify-center gap-2"
              >
                {generating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Generate New Bio
                  </>
                )}
              </NeonButton>
            </div>
          </GlassCard>

          {/* Tips */}
          <GlassCard className="p-6">
            <h3 className="text-lg font-semibold text-white mb-3">💡 Pro Tips</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li className="flex items-start gap-2">
                <span className="text-purple-400">•</span>
                <span>Update every 12-24 hours to keep your profile fresh</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-400">•</span>
                <span>Use emojis strategically to catch attention</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-400">•</span>
                <span>Test different templates to see what converts best</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-400">•</span>
                <span>Include call-to-action phrases like "DM me"</span>
              </li>
            </ul>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
