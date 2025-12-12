'use client';

import { useState } from 'react';
import { DollarSign, CheckCircle, Clock, XCircle, RefreshCw } from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';
import StatusBadge from '@/components/ui/StatusBadge';
import NeonButton from '@/components/ui/NeonButton';

export interface PPVItem {
  id: string;
  type: 'photo' | 'video' | 'bundle';
  price: number;
  description: string;
  status: 'sent' | 'paid' | 'refused' | 'expired';
  sentAt: string;
  paidAt?: string;
  expiresAt?: string;
}

interface PPVStatusProps {
  conversationId: string;
  ppvItems: PPVItem[];
  onResend?: (ppvId: string) => void;
}

export default function PPVStatus({ conversationId, ppvItems, onResend }: PPVStatusProps) {
  const [resending, setResending] = useState<string | null>(null);

  const handleResend = async (ppvId: string) => {
    setResending(ppvId);
    try {
      if (onResend) {
        await onResend(ppvId);
      }
    } finally {
      setResending(null);
    }
  };

  const getStatusInfo = (status: PPVItem['status']) => {
    switch (status) {
      case 'sent':
        return {
          badge: <StatusBadge status="inactive" label="Waiting" />,
          icon: <Clock className="w-4 h-4 text-yellow-400" />,
          color: 'text-yellow-400',
        };
      case 'paid':
        return {
          badge: <StatusBadge status="success" label="Paid" />,
          icon: <CheckCircle className="w-4 h-4 text-green-400" />,
          color: 'text-green-400',
        };
      case 'refused':
        return {
          badge: <StatusBadge status="error" label="Refused" />,
          icon: <XCircle className="w-4 h-4 text-red-400" />,
          color: 'text-red-400',
        };
      case 'expired':
        return {
          badge: <StatusBadge status="inactive" label="Expired" />,
          icon: <XCircle className="w-4 h-4 text-gray-400" />,
          color: 'text-gray-400',
        };
    }
  };

  const getTypeEmoji = (type: PPVItem['type']) => {
    switch (type) {
      case 'photo': return '📸';
      case 'video': return '🎥';
      case 'bundle': return '🎁';
    }
  };

  if (ppvItems.length === 0) {
    return null;
  }

  const totalRevenue = ppvItems
    .filter(item => item.status === 'paid')
    .reduce((sum, item) => sum + item.price, 0);

  const conversionRate = ppvItems.length > 0
    ? Math.round((ppvItems.filter(i => i.status === 'paid').length / ppvItems.length) * 100)
    : 0;

  return (
    <GlassCard className="p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-yellow-400" />
          <h3 className="font-semibold text-white">PPV Status</h3>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1">
            <span className="text-gray-400">Revenue:</span>
            <span className="text-green-400 font-bold">${totalRevenue}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-gray-400">Conv.:</span>
            <span className="text-blue-400 font-bold">{conversionRate}%</span>
          </div>
        </div>
      </div>

      <div className="space-y-2 max-h-64 overflow-y-auto">
        {ppvItems.map((item) => {
          const statusInfo = getStatusInfo(item.status);
          
          return (
            <div
              key={item.id}
              className="p-3 bg-gray-800/30 rounded-lg border border-gray-700/30 hover:bg-gray-800/50 transition-all"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">{getTypeEmoji(item.type)}</span>
                    <span className="text-sm font-medium text-white capitalize">
                      {item.type}
                    </span>
                    <span className="text-sm font-bold text-yellow-400">
                      ${item.price}
                    </span>
                  </div>
                  
                  <p className="text-xs text-gray-400 mb-2 truncate">
                    {item.description}
                  </p>

                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span>Sent: {new Date(item.sentAt).toLocaleString()}</span>
                    {item.paidAt && (
                      <span className="text-green-400">
                        Paid: {new Date(item.paidAt).toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  {statusInfo.badge}
                  
                  {(item.status === 'refused' || item.status === 'expired') && onResend && (
                    <NeonButton
                      size="sm"
                      variant="secondary"
                      onClick={() => handleResend(item.id)}
                      disabled={resending === item.id}
                      className="flex items-center gap-1"
                    >
                      {resending === item.id ? (
                        <>
                          <RefreshCw className="w-3 h-3 animate-spin" />
                          <span className="text-xs">Sending...</span>
                        </>
                      ) : (
                        <>
                          <RefreshCw className="w-3 h-3" />
                          <span className="text-xs">Resend</span>
                        </>
                      )}
                    </NeonButton>
                  )}
                </div>
              </div>

              {/* Time remaining for sent PPVs */}
              {item.status === 'sent' && item.expiresAt && (
                <div className="mt-2 pt-2 border-t border-gray-700/30">
                  <div className="flex items-center gap-2 text-xs text-yellow-400">
                    <Clock className="w-3 h-3" />
                    <span>
                      Expires: {new Date(item.expiresAt).toLocaleString()}
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Summary */}
      <div className="mt-3 pt-3 border-t border-gray-700/30">
        <div className="grid grid-cols-4 gap-2 text-center text-xs">
          <div>
            <p className="text-gray-500 mb-1">Total</p>
            <p className="font-bold text-white">{ppvItems.length}</p>
          </div>
          <div>
            <p className="text-gray-500 mb-1">Paid</p>
            <p className="font-bold text-green-400">
              {ppvItems.filter(i => i.status === 'paid').length}
            </p>
          </div>
          <div>
            <p className="text-gray-500 mb-1">Pending</p>
            <p className="font-bold text-yellow-400">
              {ppvItems.filter(i => i.status === 'sent').length}
            </p>
          </div>
          <div>
            <p className="text-gray-500 mb-1">Failed</p>
            <p className="font-bold text-red-400">
              {ppvItems.filter(i => ['refused', 'expired'].includes(i.status)).length}
            </p>
          </div>
        </div>
      </div>
    </GlassCard>
  );
}
