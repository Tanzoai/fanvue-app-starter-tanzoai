import { Play, Pause, Edit, Trash2, Copy, Zap } from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';
import StatusBadge from '@/components/ui/StatusBadge';
import NeonButton from '@/components/ui/NeonButton';

interface Script {
  id: string;
  name: string;
  description: string;
  content: string;
  status: 'active' | 'inactive';
  category: string;
  stats: {
    triggered: number;
    successRate: number;
    lastRun?: string;
  };
  trigger?: {
    type: string;
    delay?: number;
    conditions?: string[];
  };
}

interface ScriptCardProps {
  script: Script;
  onToggle: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
}

export default function ScriptCard({
  script,
  onToggle,
  onEdit,
  onDelete,
  onDuplicate,
}: ScriptCardProps) {
  return (
    <GlassCard className="p-6" hover>
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white mb-1">{script.name}</h3>
          <p className="text-sm text-gray-400 mb-3">{script.description}</p>
          <div className="flex items-center gap-3">
            <StatusBadge status={script.status} pulse={script.status === 'active'} />
            <span className="text-xs text-gray-500 px-2 py-1 bg-gray-800/50 rounded-full border border-gray-700/50">
              {script.category}
            </span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-4 p-3 bg-gray-900/30 rounded-lg border border-gray-700/30">
        <div>
          <p className="text-xs text-gray-500">Triggered</p>
          <p className="text-sm text-white font-medium">{script.stats.triggered}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Success Rate</p>
          <p className="text-sm text-white font-medium">{script.stats.successRate}%</p>
        </div>
        {script.stats.lastRun && (
          <div>
            <p className="text-xs text-gray-500">Last Run</p>
            <p className="text-sm text-white font-medium">{script.stats.lastRun}</p>
          </div>
        )}
      </div>

      {/* Trigger Info */}
      {script.trigger && (
        <div className="mb-4 p-2 bg-purple-900/10 border border-purple-500/30 rounded-lg flex items-center gap-2">
          <Zap className="w-4 h-4 text-purple-400" />
          <p className="text-xs text-gray-300">
            Triggers: {script.trigger.type}
            {script.trigger.delay && ` (${script.trigger.delay} ${script.trigger.type === 'subscription' ? 'min' : 'days'})`}
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-2">
        <NeonButton
          size="sm"
          variant={script.status === 'active' ? 'danger' : 'success'}
          onClick={() => onToggle(script.id)}
          className="flex items-center gap-2"
        >
          {script.status === 'active' ? (
            <>
              <Pause className="w-4 h-4" />
              Pause
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              Start
            </>
          )}
        </NeonButton>
        <button
          onClick={() => onEdit(script.id)}
          className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all"
          title="Edit"
        >
          <Edit className="w-4 h-4" />
        </button>
        <button
          onClick={() => onDuplicate(script.id)}
          className="p-2 text-gray-400 hover:text-green-400 hover:bg-green-500/10 rounded-lg transition-all"
          title="Duplicate"
        >
          <Copy className="w-4 h-4" />
        </button>
        <button
          onClick={() => onDelete(script.id)}
          className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all ml-auto"
          title="Delete"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </GlassCard>
  );
}
