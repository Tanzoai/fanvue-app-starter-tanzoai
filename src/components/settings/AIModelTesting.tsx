'use client';

import { useState } from 'react';
import { Brain, Loader2, Zap, DollarSign, Send } from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';
import NeonButton from '@/components/ui/NeonButton';
import NeonInput from '@/components/ui/NeonInput';
import StatusBadge from '@/components/ui/StatusBadge';

interface OpenRouterModel {
  id: string;
  name: string;
  pricing: {
    prompt: string;
    completion: string;
  };
  context_length: number;
  description?: string;
}

interface ModelTestResult {
  response: string;
  responseTime: number;
  estimatedCost: number;
}

export default function AIModelTesting() {
  const [apiKey, setApiKey] = useState('');
  const [models, setModels] = useState<OpenRouterModel[]>([]);
  const [selectedModel, setSelectedModel] = useState('');
  const [testMessage, setTestMessage] = useState('');
  const [testResult, setTestResult] = useState<ModelTestResult | null>(null);
  const [loadingModels, setLoadingModels] = useState(false);
  const [testing, setTesting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchModels = async () => {
    if (!apiKey.trim()) {
      setError('Please enter an API key first');
      return;
    }

    setLoadingModels(true);
    setError(null);

    try {
      const response = await fetch('/api/openrouter/models', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ apiKey }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch models');
      }

      const data = await response.json();
      setModels(data.models || []);
      
      if (data.models && data.models.length > 0) {
        setSelectedModel(data.models[0].id);
      }
    } catch (err) {
      console.error('Error fetching models:', err);
      setError('Failed to fetch models. Check your API key.');
    } finally {
      setLoadingModels(false);
    }
  };

  const testModel = async () => {
    if (!selectedModel || !testMessage.trim()) {
      setError('Please select a model and enter a test message');
      return;
    }

    setTesting(true);
    setError(null);
    setTestResult(null);

    const startTime = Date.now();

    try {
      const response = await fetch('/api/openrouter/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          apiKey,
          model: selectedModel,
          message: testMessage,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to test model');
      }

      const data = await response.json();
      const responseTime = Date.now() - startTime;

      setTestResult({
        response: data.response,
        responseTime,
        estimatedCost: data.cost || 0,
      });
    } catch (err) {
      console.error('Error testing model:', err);
      setError('Failed to test model. Please try again.');
    } finally {
      setTesting(false);
    }
  };

  const selectedModelData = models.find(m => m.id === selectedModel);

  return (
    <GlassCard className="p-6">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <Brain className="w-6 h-6 text-purple-400" />
          <h2 className="text-2xl font-semibold text-white">AI Model Testing</h2>
        </div>
        <p className="text-gray-400 text-sm">
          Test OpenRouter models and manage your API keys
        </p>
      </div>

      <div className="space-y-6">
        {/* API Key Input */}
        <div>
          <label className="block text-sm font-medium text-gray-200 mb-2">
            OpenRouter API Key
          </label>
          <div className="flex gap-2">
            <NeonInput
              type="password"
              placeholder="sk-or-v1-..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="flex-1"
            />
            <NeonButton
              variant="primary"
              onClick={fetchModels}
              disabled={loadingModels || !apiKey.trim()}
            >
              {loadingModels ? (
                <>
                  <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                  Loading...
                </>
              ) : (
                'Get Models'
              )}
            </NeonButton>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Enter your OpenRouter API key to fetch available models
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="p-4 bg-red-900/20 border border-red-500/30 rounded-lg">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Models List */}
        {models.length > 0 && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Available Models ({models.length})
              </label>
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="w-full px-4 py-3 bg-gray-900/50 backdrop-blur-sm border-2 border-purple-500/30 rounded-lg text-white focus:border-purple-500/60 focus:outline-none transition-colors"
              >
                {models.map((model) => (
                  <option key={model.id} value={model.id}>
                    {model.name} - Prompt: ${model.pricing.prompt}/1K tokens
                  </option>
                ))}
              </select>
            </div>

            {/* Selected Model Details */}
            {selectedModelData && (
              <div className="p-4 bg-purple-900/10 border border-purple-500/30 rounded-lg">
                <h3 className="font-medium text-white mb-2">{selectedModelData.name}</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-green-400" />
                    <div>
                      <p className="text-xs text-gray-400">Prompt</p>
                      <p className="text-sm text-white font-medium">
                        ${selectedModelData.pricing.prompt}/1K
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-blue-400" />
                    <div>
                      <p className="text-xs text-gray-400">Completion</p>
                      <p className="text-sm text-white font-medium">
                        ${selectedModelData.pricing.completion}/1K
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-yellow-400" />
                    <div>
                      <p className="text-xs text-gray-400">Context</p>
                      <p className="text-sm text-white font-medium">
                        {selectedModelData.context_length.toLocaleString()} tokens
                      </p>
                    </div>
                  </div>
                </div>
                {selectedModelData.description && (
                  <p className="text-xs text-gray-400 mt-3">
                    {selectedModelData.description}
                  </p>
                )}
              </div>
            )}

            {/* Test Model Section */}
            <div className="p-4 bg-blue-900/10 border border-blue-500/30 rounded-lg">
              <h3 className="font-medium text-white mb-3">Test Model</h3>
              <div className="space-y-3">
                <NeonInput
                  placeholder="Type your test message here..."
                  value={testMessage}
                  onChange={(e) => setTestMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      testModel();
                    }
                  }}
                />
                <NeonButton
                  variant="primary"
                  onClick={testModel}
                  disabled={testing || !testMessage.trim()}
                  className="w-full"
                >
                  {testing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                      Testing...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-1" />
                      Test Model
                    </>
                  )}
                </NeonButton>
              </div>

              {/* Test Result */}
              {testResult && (
                <div className="mt-4 p-4 bg-gray-800/30 rounded-lg border border-gray-700/30">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-white">Response</h4>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <StatusBadge status="success" />
                        <span className="text-xs text-gray-400">
                          {testResult.responseTime}ms
                        </span>
                      </div>
                      <span className="text-xs text-green-400">
                        ~${testResult.estimatedCost.toFixed(6)}
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-300 text-sm whitespace-pre-wrap">
                    {testResult.response}
                  </p>
                </div>
              )}
            </div>
          </>
        )}

        {/* Initial Help */}
        {models.length === 0 && !loadingModels && (
          <div className="p-6 bg-gray-800/20 border border-gray-700/30 rounded-lg text-center">
            <Brain className="w-12 h-12 text-purple-400 mx-auto mb-3" />
            <p className="text-gray-400 text-sm">
              Enter your OpenRouter API key above to get started
            </p>
          </div>
        )}
      </div>
    </GlassCard>
  );
}
