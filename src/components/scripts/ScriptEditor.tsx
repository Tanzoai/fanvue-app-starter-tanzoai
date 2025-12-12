'use client';

import { useState } from 'react';
import { Save, X, Sparkles, Loader2, Clock, Zap, DollarSign, Image, Video, Info } from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';
import NeonInput from '@/components/ui/NeonInput';
import NeonButton from '@/components/ui/NeonButton';
import PPVPreview from './PPVPreview';

type ScriptCategory = 'welcome' | 'firstMessage' | 'reEngagement' | 'upsell' | 'retention';

interface ScriptData {
  id?: string;
  name: string;
  description: string;
  content: string;
  category: ScriptCategory;
  apiKeyId?: string;
  trigger: {
    type: string;
    delay?: number;
    conditions?: string[];
  };
  status?: 'active' | 'inactive';
}

interface ScriptEditorProps {
  script?: any;
  category: ScriptCategory;
  onSave: (data: any) => void;
  onCancel: () => void;
}

const CATEGORY_TRIGGERS: Record<ScriptCategory, Array<{ value: string; label: string; delay?: boolean }>> = {
  welcome: [
    { value: 'subscription', label: 'After subscription', delay: true },
  ],
  firstMessage: [
    { value: 'firstMessage', label: 'First message from fan', delay: false },
  ],
  reEngagement: [
    { value: 'inactivity', label: 'After inactivity', delay: true },
    { value: 'noPPVPurchase', label: 'No PPV purchase', delay: true },
  ],
  upsell: [
    { value: 'engagement', label: 'Based on engagement', delay: false },
    { value: 'afterPurchase', label: 'After purchase', delay: true },
  ],
  retention: [
    { value: 'loyalFan', label: 'For loyal fans', delay: false },
    { value: 'recurring', label: 'Recurring schedule', delay: true },
  ],
};

export default function ScriptEditor({
  script,
  category,
  onSave,
  onCancel,
}: ScriptEditorProps) {
  const [formData, setFormData] = useState({
    name: script?.name || '',
    description: script?.description || '',
    content: script?.content || '',
    category: script?.category || category,
    apiKeyId: script?.apiKeyId || '',
    triggerType: script?.trigger?.type || CATEGORY_TRIGGERS[category][0]?.value || '',
    triggerDelay: script?.trigger?.delay || 10,
  });

  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [showPPVHelper, setShowPPVHelper] = useState(false);

  const insertPPVCommand = (type: 'photo' | 'video' | 'bundle') => {
    const commands = {
      photo: '[PPV:photo:15:Exclusive photo set 🔥]',
      video: '[PPV:video:25:Hot video just for you 💋]',
      bundle: '[PPV:bundle:50:Premium content bundle 🎁]',
    };
    
    const command = commands[type];
    const textarea = document.querySelector('textarea[name="script-content"]') as HTMLTextAreaElement;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const text = formData.content;
      const newText = text.substring(0, start) + '\n' + command + '\n' + text.substring(end);
      setFormData({ ...formData, content: newText });
      
      // Set cursor position after inserted command
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + command.length + 2, start + command.length + 2);
      }, 0);
    }
  };

  const handleAnalyze = async () => {
    if (!formData.content.trim()) {
      alert('Please enter script content first');
      return;
    }

    setAnalyzing(true);
    setAnalysis(null);

    try {
      // Simulate AI analysis (replace with actual API call)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setAnalysis(
        `This is a ${formData.category} script that:\n` +
        `• Uses a ${formData.content.length > 200 ? 'detailed' : 'concise'} messaging style\n` +
        `• Contains ${formData.content.split('\n').length} paragraphs\n` +
        `• Estimated engagement: High\n` +
        `• Tone: Friendly and personalized`
      );
    } catch (error) {
      console.error('Analysis failed:', error);
      alert('Failed to analyze script');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const scriptData = {
      ...script,
      name: formData.name,
      description: formData.description,
      content: formData.content,
      category: formData.category,
      apiKeyId: formData.apiKeyId,
      trigger: {
        type: formData.triggerType,
        delay: formData.triggerDelay,
      },
    };
    
    onSave(scriptData);
  };

  const currentTriggers = CATEGORY_TRIGGERS[formData.category as ScriptCategory] || [];
  const selectedTrigger = currentTriggers.find(t => t.value === formData.triggerType);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Editor Form */}
      <div>
        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">
              {script ? 'Edit Script' : 'Create New Script'}
            </h2>
            <button
              onClick={onCancel}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
        <NeonInput
          label="Script Name"
          placeholder="e.g., Welcome New Subscriber"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />

        <div>
          <label className="block text-sm font-medium text-gray-200 mb-2">
            Description
          </label>
          <textarea
            className="w-full px-4 py-2.5 bg-gray-900/50 backdrop-blur-sm border-2 border-purple-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all duration-300 min-h-[80px]"
            placeholder="Describe what this script does..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            required
          />
        </div>

        {/* Trigger Configuration */}
        <div className="p-4 bg-purple-900/10 border border-purple-500/30 rounded-lg">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-5 h-5 text-purple-400" />
            <h3 className="font-medium text-white">Trigger Configuration</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Trigger Type
              </label>
              <select
                className="w-full px-4 py-2.5 bg-gray-900/50 backdrop-blur-sm border-2 border-purple-500/30 rounded-lg text-white focus:outline-none focus:border-purple-500 transition-all duration-300"
                value={formData.triggerType}
                onChange={(e) => setFormData({ ...formData, triggerType: e.target.value })}
              >
                {currentTriggers.map((trigger) => (
                  <option key={trigger.value} value={trigger.value}>
                    {trigger.label}
                  </option>
                ))}
              </select>
            </div>

            {selectedTrigger?.delay && (
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  <Clock className="w-4 h-4 inline mr-1" />
                  Delay ({formData.category === 'welcome' ? 'minutes' : 'days'})
                </label>
                <input
                  type="number"
                  min="1"
                  max="365"
                  className="w-full px-4 py-2.5 bg-gray-900/50 backdrop-blur-sm border-2 border-purple-500/30 rounded-lg text-white focus:outline-none focus:border-purple-500 transition-all duration-300"
                  value={formData.triggerDelay}
                  onChange={(e) => setFormData({ ...formData, triggerDelay: parseInt(e.target.value) })}
                />
              </div>
            )}
          </div>
        </div>

        {/* API Key Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-200 mb-2">
            OpenRouter API Key (Optional)
          </label>
          <select
            className="w-full px-4 py-2.5 bg-gray-900/50 backdrop-blur-sm border-2 border-purple-500/30 rounded-lg text-white focus:outline-none focus:border-purple-500 transition-all duration-300"
            value={formData.apiKeyId}
            onChange={(e) => setFormData({ ...formData, apiKeyId: e.target.value })}
          >
            <option value="">Use default API key</option>
            <option value="nsfw-models">NSFW Models</option>
            <option value="general-chat">General Chat</option>
            <option value="premium">Premium Models</option>
          </select>
          <p className="mt-2 text-xs text-gray-500">
            Select which API key to use for AI-powered responses
          </p>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-200">
              Script Content
            </label>
            <NeonButton
              type="button"
              variant="secondary"
              size="sm"
              onClick={handleAnalyze}
              disabled={analyzing || !formData.content.trim()}
              className="flex items-center gap-2"
            >
              {analyzing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Analyze Script
                </>
              )}
            </NeonButton>
          </div>
          <textarea
            name="script-content"
            className="w-full px-4 py-2.5 bg-gray-900/50 backdrop-blur-sm border-2 border-purple-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all duration-300 min-h-[250px] font-mono text-sm"
            placeholder="Paste your complete script here...&#10;&#10;Example:\nHey babe! 👋 Thanks so much for subscribing!\nI'm so excited to have you here...\n\nYou can use variables like {name}, {username}, etc."
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            required
          />
          <div className="mt-3 flex items-center justify-between">
            <p className="text-xs text-gray-500">
              Paste your pre-written script. Use variables: {'{name}'}, {'{username}'}, {'{subscription_tier}'}
            </p>
            <button
              type="button"
              onClick={() => setShowPPVHelper(!showPPVHelper)}
              className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1"
            >
              <DollarSign className="w-3 h-3" />
              {showPPVHelper ? 'Hide' : 'Show'} PPV Commands
            </button>
          </div>
        </div>

        {/* PPV Commands Helper */}
        {showPPVHelper && (
          <div className="p-4 bg-blue-900/10 border border-blue-500/30 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <Info className="w-5 h-5 text-blue-400" />
              <h4 className="font-medium text-white">PPV Commands</h4>
            </div>
            <p className="text-sm text-gray-400 mb-4">
              Click to insert a PPV command into your script. The bot will automatically send the content and wait for payment.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Photo PPV */}
              <button
                type="button"
                onClick={() => insertPPVCommand('photo')}
                className="p-4 bg-gray-800/40 hover:bg-gray-800/60 border-2 border-pink-500/30 hover:border-pink-500/50 rounded-lg transition-all text-left group"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Image className="w-5 h-5 text-pink-400" />
                  <span className="font-medium text-white">Photo Set</span>
                </div>
                <p className="text-xs text-gray-400 mb-2">Send exclusive photos</p>
                <code className="text-xs text-pink-300 bg-gray-900/50 px-2 py-1 rounded block break-all">
                  [PPV:photo:15:Description]
                </code>
              </button>

              {/* Video PPV */}
              <button
                type="button"
                onClick={() => insertPPVCommand('video')}
                className="p-4 bg-gray-800/40 hover:bg-gray-800/60 border-2 border-purple-500/30 hover:border-purple-500/50 rounded-lg transition-all text-left group"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Video className="w-5 h-5 text-purple-400" />
                  <span className="font-medium text-white">Video</span>
                </div>
                <p className="text-xs text-gray-400 mb-2">Send exclusive videos</p>
                <code className="text-xs text-purple-300 bg-gray-900/50 px-2 py-1 rounded block break-all">
                  [PPV:video:25:Description]
                </code>
              </button>

              {/* Bundle PPV */}
              <button
                type="button"
                onClick={() => insertPPVCommand('bundle')}
                className="p-4 bg-gray-800/40 hover:bg-gray-800/60 border-2 border-yellow-500/30 hover:border-yellow-500/50 rounded-lg transition-all text-left group"
              >
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="w-5 h-5 text-yellow-400" />
                  <span className="font-medium text-white">Bundle</span>
                </div>
                <p className="text-xs text-gray-400 mb-2">Photos + Videos bundle</p>
                <code className="text-xs text-yellow-300 bg-gray-900/50 px-2 py-1 rounded block break-all">
                  [PPV:bundle:50:Description]
                </code>
              </button>
            </div>

            {/* Command Syntax Help */}
            <div className="mt-4 p-3 bg-gray-800/30 rounded-lg">
              <h5 className="text-sm font-medium text-white mb-2">Command Syntax:</h5>
              <div className="space-y-2 text-xs text-gray-400">
                <div>
                  <code className="text-green-400">[PPV:type:price:description]</code>
                </div>
                <div className="pl-4 space-y-1">
                  <p>• <span className="text-blue-300">type</span>: photo, video, or bundle</p>
                  <p>• <span className="text-blue-300">price</span>: Amount in $ (number only)</p>
                  <p>• <span className="text-blue-300">description</span>: What they're buying</p>
                </div>
                <div className="mt-2">
                  <p className="text-gray-500">Example:</p>
                  <code className="text-green-400">[PPV:photo:15:Sexy lingerie pics 🔥]</code>
                </div>
              </div>
            </div>

            {/* Payment Flow Info */}
            <div className="mt-4 p-3 bg-green-900/10 border border-green-500/30 rounded-lg">
              <h5 className="text-sm font-medium text-green-300 mb-2">💸 How it works:</h5>
              <ol className="space-y-1 text-xs text-gray-400">
                <li>1. Bot sends the PPV message to the fan</li>
                <li>2. Waits for payment confirmation from Fanvue</li>
                <li>3. If paid: Sends unlock message and continues script</li>
                <li>4. If not paid after X hours: Sends reminder or stops</li>
              </ol>
            </div>
          </div>
        )}

        {/* Analysis Result */}
        {analysis && (
          <div className="p-4 bg-green-900/10 border border-green-500/30 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-green-400" />
              <h4 className="font-medium text-white">AI Analysis</h4>
            </div>
            <p className="text-sm text-gray-300 whitespace-pre-line">{analysis}</p>
          </div>
        )}

        <div className="flex items-center gap-3 pt-4">
          <NeonButton type="submit" variant="primary" className="flex items-center gap-2">
            <Save className="w-4 h-4" />
            Save Script
          </NeonButton>
          <NeonButton type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </NeonButton>
        </div>
      </form>
    </GlassCard>
  </div>

  {/* Live Preview */}
  <div>
    <PPVPreview scriptContent={formData.content} />
  </div>
</div>
  );
}
