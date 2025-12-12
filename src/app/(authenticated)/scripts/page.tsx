'use client';

import { useState } from 'react';
import { Plus, MessageSquare, Sparkles, TrendingUp, DollarSign, Heart } from 'lucide-react';
import ScriptCard from '@/components/scripts/ScriptCard';
import ScriptEditor from '@/components/scripts/ScriptEditor';
import NeonButton from '@/components/ui/NeonButton';
import GlassCard from '@/components/ui/GlassCard';

type ScriptCategory = 'welcome' | 'firstMessage' | 'reEngagement' | 'upsell' | 'retention';

interface Script {
  id: string;
  name: string;
  description: string;
  content: string;
  category: ScriptCategory;
  status: 'active' | 'inactive';
  apiKeyId?: string;
  trigger: {
    type: string;
    delay?: number;
    conditions?: string[];
  };
  stats: {
    triggered: number;
    successRate: number;
    lastRun?: string;
  };
}

const SCRIPT_CATEGORIES = [
  {
    id: 'welcome' as ScriptCategory,
    name: 'Welcome Script',
    icon: MessageSquare,
    color: 'blue',
    description: 'Automatically sent 10 minutes after a user subscribes',
    triggerInfo: 'Triggers 10 min after subscription',
  },
  {
    id: 'firstMessage' as ScriptCategory,
    name: 'First Message Script',
    icon: Sparkles,
    color: 'purple',
    description: 'Sent when a fan sends their first message',
    triggerInfo: 'Triggers on first fan message',
  },
  {
    id: 'reEngagement' as ScriptCategory,
    name: 'Re-engagement Script',
    icon: TrendingUp,
    color: 'green',
    description: 'Sent when a fan is inactive for X days or hasn\'t paid for PPV',
    triggerInfo: 'Triggers after inactivity period',
  },
  {
    id: 'upsell' as ScriptCategory,
    name: 'Upsell Script',
    icon: DollarSign,
    color: 'yellow',
    description: 'Promote paid content (PPV) and custom photos/videos',
    triggerInfo: 'Triggers based on engagement level',
  },
  {
    id: 'retention' as ScriptCategory,
    name: 'Retention Script',
    icon: Heart,
    color: 'pink',
    description: 'Keep regular fans engaged with exclusive content',
    triggerInfo: 'Triggers for loyal subscribers',
  },
];

const mockScripts: Script[] = [
  {
    id: '1',
    name: 'Welcome New Subscriber',
    description: 'Greet new subscribers with a personalized welcome',
    content: 'Hey! 👋 Thanks for subscribing! I\'m so excited to have you here...',
    category: 'welcome',
    status: 'active',
    trigger: {
      type: 'subscription',
      delay: 10, // minutes
    },
    stats: {
      triggered: 245,
      successRate: 98,
      lastRun: '2 min ago',
    },
  },
  {
    id: '2',
    name: 'First Message Response',
    description: 'Auto-respond to the first message from a new fan',
    content: 'Hey babe! 💕 So happy you messaged me first...',
    category: 'firstMessage',
    status: 'active',
    trigger: {
      type: 'firstMessage',
    },
    stats: {
      triggered: 156,
      successRate: 92,
      lastRun: '15 min ago',
    },
  },
  {
    id: '3',
    name: 'Re-engage Inactive Fans',
    description: 'Bring back fans who haven\'t interacted in 7 days',
    content: 'Hey! I missed you... 😘',
    category: 'reEngagement',
    status: 'active',
    trigger: {
      type: 'inactivity',
      delay: 7, // days
    },
    stats: {
      triggered: 89,
      successRate: 65,
      lastRun: '1 hour ago',
    },
  },
  {
    id: '4',
    name: 'PPV Photo Set Promotion',
    description: 'Promote exclusive photo sets to engaged fans',
    content: 'I just posted something special... 🔥',
    category: 'upsell',
    status: 'inactive',
    trigger: {
      type: 'engagement',
      conditions: ['active_last_3_days'],
    },
    stats: {
      triggered: 178,
      successRate: 45,
      lastRun: '3 hours ago',
    },
  },
];

export default function ScriptsPage() {
  const [scripts, setScripts] = useState<Script[]>(mockScripts);
  const [activeCategory, setActiveCategory] = useState<ScriptCategory>('welcome');
  const [showEditor, setShowEditor] = useState(false);
  const [editingScript, setEditingScript] = useState<Script | undefined>();

  const filteredScripts = scripts.filter(s => s.category === activeCategory);
  const activeCategoryData = SCRIPT_CATEGORIES.find(c => c.id === activeCategory);

  const handleToggle = (id: string) => {
    setScripts(scripts.map(script => 
      script.id === id 
        ? { ...script, status: script.status === 'active' ? 'inactive' : 'active' }
        : script
    ));
  };

  const handleEdit = (id: string) => {
    const script = scripts.find(s => s.id === id);
    if (script) {
      setEditingScript(script);
      setShowEditor(true);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this script?')) {
      setScripts(scripts.filter(s => s.id !== id));
    }
  };

  const handleDuplicate = (id: string) => {
    const script = scripts.find(s => s.id === id);
    if (script) {
      const newScript: Script = {
        ...script,
        id: Date.now().toString(),
        name: `${script.name} (Copy)`,
        status: 'inactive',
      };
      setScripts([...scripts, newScript]);
    }
  };

  const handleNewScript = () => {
    setEditingScript(undefined);
    setShowEditor(true);
  };

  const getCategoryStats = (category: ScriptCategory) => {
    const categoryScripts = scripts.filter(s => s.category === category);
    const activeCount = categoryScripts.filter(s => s.status === 'active').length;
    const totalTriggered = categoryScripts.reduce((sum, s) => sum + s.stats.triggered, 0);
    return { total: categoryScripts.length, active: activeCount, triggered: totalTriggered };
  };

  const getColorClasses = (color: string) => {
    const colors: Record<string, { border: string; bg: string; text: string }> = {
      blue: { border: 'border-blue-500/30', bg: 'bg-blue-500/10', text: 'text-blue-400' },
      purple: { border: 'border-purple-500/30', bg: 'bg-purple-500/10', text: 'text-purple-400' },
      green: { border: 'border-green-500/30', bg: 'bg-green-500/10', text: 'text-green-400' },
      yellow: { border: 'border-yellow-500/30', bg: 'bg-yellow-500/10', text: 'text-yellow-400' },
      pink: { border: 'border-pink-500/30', bg: 'bg-pink-500/10', text: 'text-pink-400' },
    };
    return colors[color] || colors.blue;
  };

  const handleSave = (data: any) => {
    console.log('Saving script:', data);
    setShowEditor(false);
    setEditingScript(undefined);
  };

  const handleCancel = () => {
    setShowEditor(false);
    setEditingScript(undefined);
  };

  if (showEditor) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8">
        <ScriptEditor
          script={editingScript}
          category={activeCategory}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Scripts Manager</h1>
        <p className="text-gray-400">
          Create and manage automated messaging scripts by category
        </p>
      </div>

      {/* Category Tabs */}
      <div className="mb-6">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {SCRIPT_CATEGORIES.map((category) => {
            const stats = getCategoryStats(category.id);
            const colors = getColorClasses(category.color);
            const Icon = category.icon;
            const isActive = activeCategory === category.id;

            return (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`
                  flex items-center gap-3 px-6 py-4 rounded-lg border-2 transition-all flex-shrink-0
                  ${isActive 
                    ? `${colors.border} ${colors.bg} backdrop-blur-sm` 
                    : 'border-gray-700/30 bg-gray-800/20 hover:bg-gray-800/40'
                  }
                `}
              >
                <Icon className={`w-5 h-5 ${isActive ? colors.text : 'text-gray-400'}`} />
                <div className="text-left">
                  <div className="flex items-center gap-2">
                    <span className={`font-medium ${isActive ? 'text-white' : 'text-gray-300'}`}>
                      {category.name}
                    </span>
                    {stats.total > 0 && (
                      <span className={`text-xs px-2 py-0.5 rounded-full ${colors.bg} ${colors.text}`}>
                        {stats.active}/{stats.total}
                      </span>
                    )}
                  </div>
                  {isActive && (
                    <p className="text-xs text-gray-400 mt-1">
                      {stats.triggered} triggered
                    </p>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Category Info */}
      {activeCategoryData && (
        <GlassCard className="p-6 mb-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                {(() => {
                  const Icon = activeCategoryData.icon;
                  const colors = getColorClasses(activeCategoryData.color);
                  return <Icon className={`w-6 h-6 ${colors.text}`} />;
                })()}
                <h2 className="text-2xl font-semibold text-white">{activeCategoryData.name}</h2>
              </div>
              <p className="text-gray-400 mb-2">{activeCategoryData.description}</p>
              <p className="text-sm text-gray-500">📍 {activeCategoryData.triggerInfo}</p>
            </div>
            <NeonButton
              onClick={handleNewScript}
              variant="primary"
              className="flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              New Script
            </NeonButton>
          </div>
        </GlassCard>
      )}

      {/* Scripts Grid */}
      {filteredScripts.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredScripts.map((script) => (
            <ScriptCard
              key={script.id}
              script={script}
              onToggle={handleToggle}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onDuplicate={handleDuplicate}
            />
          ))}
        </div>
      ) : (
        <GlassCard className="p-12 text-center">
          <div className="max-w-md mx-auto">
            {(() => {
              const Icon = activeCategoryData?.icon || MessageSquare;
              const colors = getColorClasses(activeCategoryData?.color || 'blue');
              return <Icon className={`w-16 h-16 ${colors.text} mx-auto mb-4`} />;
            })()}
            <h3 className="text-xl font-semibold text-white mb-2">
              No {activeCategoryData?.name} yet
            </h3>
            <p className="text-gray-400 mb-6">
              Create your first script to automate your messaging workflow
            </p>
            <NeonButton
              onClick={handleNewScript}
              variant="primary"
              className="flex items-center gap-2 mx-auto"
            >
              <Plus className="w-5 h-5" />
              Create First Script
            </NeonButton>
          </div>
        </GlassCard>
      )}
    </div>
  );
}
