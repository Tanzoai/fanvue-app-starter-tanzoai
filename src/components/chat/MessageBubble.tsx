import { Check, CheckCheck } from 'lucide-react';

interface MessageBubbleProps {
  message: string;
  timestamp: string;
  isOwn: boolean;
  status?: 'sent' | 'delivered' | 'read';
  senderName?: string;
}

export default function MessageBubble({
  message,
  timestamp,
  isOwn,
  status = 'sent',
  senderName,
}: MessageBubbleProps) {
  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-[70%] ${isOwn ? 'items-end' : 'items-start'} flex flex-col`}>
        {!isOwn && senderName && (
          <span className="text-xs text-gray-400 mb-1 px-2">{senderName}</span>
        )}
        <div
          className={`
            px-4 py-2.5 rounded-2xl
            ${
              isOwn
                ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-[0_0_20px_rgba(59,130,246,0.3)]'
                : 'bg-gray-800/50 text-white backdrop-blur-sm border border-gray-700/50'
            }
          `}
        >
          <p className="text-sm leading-relaxed break-words">{message}</p>
        </div>
        <div className="flex items-center gap-1 mt-1 px-2">
          <span className="text-xs text-gray-500">{timestamp}</span>
          {isOwn && (
            <div className="ml-1">
              {status === 'read' && (
                <CheckCheck className="w-3 h-3 text-blue-400" />
              )}
              {status === 'delivered' && (
                <CheckCheck className="w-3 h-3 text-gray-400" />
              )}
              {status === 'sent' && (
                <Check className="w-3 h-3 text-gray-400" />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
