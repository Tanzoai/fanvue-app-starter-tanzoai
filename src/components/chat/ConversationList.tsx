import { User } from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';
import StatusBadge from '@/components/ui/StatusBadge';

interface Conversation {
  id: string;
  username: string;
  avatar?: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
  status: 'active' | 'inactive';
}

interface ConversationListProps {
  conversations: Conversation[];
  selectedId?: string;
  onSelect: (id: string) => void;
}

export default function ConversationList({
  conversations,
  selectedId,
  onSelect,
}: ConversationListProps) {
  return (
    <div className="space-y-2">
      {conversations.length === 0 ? (
        <GlassCard className="p-6 text-center">
          <p className="text-gray-400">No conversations yet</p>
        </GlassCard>
      ) : (
        conversations.map((conversation, index) => (
          <GlassCard
            key={conversation.id || (conversation as any).uuid || `conversation-${index}`}
            className={`p-4 cursor-pointer transition-all ${
              selectedId === conversation.id
                ? 'bg-blue-500/20 border-blue-500/50'
                : ''
            }`}
            hover
            onClick={() => onSelect(conversation.id)}
          >
            <div className="flex items-start gap-3">
              {/* Avatar */}
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                {conversation.avatar ? (
                  <img
                    src={conversation.avatar}
                    alt={conversation.username}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <User className="w-6 h-6 text-white" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-semibold text-white truncate">
                    {conversation.username}
                  </h4>
                  <span className="text-xs text-gray-400 flex-shrink-0 ml-2">
                    {conversation.timestamp}
                  </span>
                </div>
                <p className="text-sm text-gray-400 truncate mb-2">
                  {conversation.lastMessage}
                </p>
                <div className="flex items-center justify-between">
                  <StatusBadge
                    status={conversation.status}
                    pulse={conversation.status === 'active'}
                  />
                  {conversation.unread > 0 && (
                    <div className="bg-blue-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-[0_0_10px_rgba(59,130,246,0.5)]">
                      {conversation.unread}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </GlassCard>
        ))
      )}
    </div>
  );
}
