'use client';

import { useState, useEffect } from 'react';
import { DollarSign, CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';
import StatusBadge from '@/components/ui/StatusBadge';
import { parsePPVCommands, processScriptWithPPV, validatePPVCommand } from '@/lib/ppv-handler';

interface PPVPreviewProps {
  scriptContent: string;
}

export default function PPVPreview({ scriptContent }: PPVPreviewProps) {
  const [segments, setSegments] = useState<any[]>([]);
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    if (!scriptContent.trim()) {
      setSegments([]);
      setErrors([]);
      return;
    }

    // Parse and validate PPV commands
    const commands = parsePPVCommands(scriptContent);
    const validationErrors: string[] = [];

    commands.forEach((cmd, index) => {
      const validation = validatePPVCommand(cmd.rawCommand);
      if (!validation.valid && validation.error) {
        validationErrors.push(`Command ${index + 1}: ${validation.error}`);
      }
    });

    setErrors(validationErrors);

    // Process script into segments
    const processedSegments = processScriptWithPPV(scriptContent);
    setSegments(processedSegments);
  }, [scriptContent]);

  if (!scriptContent.trim()) {
    return null;
  }

  return (
    <GlassCard className="p-6">
      <div className="flex items-center gap-3 mb-4">
        <DollarSign className="w-6 h-6 text-yellow-400" />
        <h3 className="text-xl font-semibold text-white">Script Flow Preview</h3>
      </div>

      {/* Validation Errors */}
      {errors.length > 0 && (
        <div className="mb-4 p-4 bg-red-900/20 border border-red-500/30 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="w-5 h-5 text-red-400" />
            <h4 className="font-medium text-red-300">Validation Errors</h4>
          </div>
          <ul className="space-y-1">
            {errors.map((error, index) => (
              <li key={index} className="text-sm text-red-300">
                • {error}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Script Segments */}
      <div className="space-y-4">
        {segments.map((segment, index) => {
          if (segment.type === 'message') {
            return (
              <div
                key={index}
                className="p-4 bg-gray-800/30 border border-gray-700/30 rounded-lg"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 bg-blue-500/20 rounded-full flex items-center justify-center text-blue-400 text-xs font-bold">
                    {index + 1}
                  </div>
                  <span className="text-sm text-gray-400">Regular Message</span>
                </div>
                <p className="text-white text-sm whitespace-pre-wrap">{segment.content}</p>
              </div>
            );
          }

          if (segment.type === 'ppv' && segment.ppvCommand) {
            const { ppvCommand } = segment;
            return (
              <div
                key={index}
                className="p-4 bg-yellow-900/10 border-2 border-yellow-500/30 rounded-lg"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-yellow-500/20 rounded-full flex items-center justify-center text-yellow-400 text-xs font-bold">
                      {index + 1}
                    </div>
                    <span className="text-sm font-medium text-yellow-300">
                      PPV: {ppvCommand.type}
                    </span>
                  </div>
                  <StatusBadge status="inactive" label={`$${ppvCommand.price}`} />
                </div>

                {/* PPV Details */}
                <div className="space-y-2 mb-3">
                  <p className="text-white text-sm whitespace-pre-wrap">{segment.content}</p>
                  
                  {ppvCommand.description && (
                    <div className="flex items-start gap-2 text-xs text-gray-400">
                      <span className="font-medium">Description:</span>
                      <span>{ppvCommand.description}</span>
                    </div>
                  )}

                  {ppvCommand.type === 'BUNDLE' && (
                    <div className="flex items-center gap-4 text-xs text-gray-400">
                      {ppvCommand.photos && (
                        <span>📸 {ppvCommand.photos} photos</span>
                      )}
                      {ppvCommand.videos && (
                        <span>🎥 {ppvCommand.videos} videos</span>
                      )}
                    </div>
                  )}
                </div>

                {/* Payment Flow */}
                <div className="pt-3 border-t border-yellow-500/20">
                  <p className="text-xs text-gray-500 mb-2">Payment Flow:</p>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="flex items-center gap-1 text-yellow-300">
                      <Clock className="w-3 h-3" />
                      <span>Wait for payment</span>
                    </div>
                    <div className="flex items-center gap-1 text-green-300">
                      <CheckCircle className="w-3 h-3" />
                      <span>If paid: Continue</span>
                    </div>
                    <div className="flex items-center gap-1 text-red-300">
                      <XCircle className="w-3 h-3" />
                      <span>If not: Remind</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          }

          return null;
        })}
      </div>

      {/* Summary */}
      {segments.length > 0 && (
        <div className="mt-4 p-4 bg-purple-900/10 border border-purple-500/30 rounded-lg">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-xs text-gray-400 mb-1">Total Segments</p>
              <p className="text-lg font-bold text-white">{segments.length}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-1">Messages</p>
              <p className="text-lg font-bold text-blue-400">
                {segments.filter(s => s.type === 'message').length}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-1">PPV Commands</p>
              <p className="text-lg font-bold text-yellow-400">
                {segments.filter(s => s.type === 'ppv').length}
              </p>
            </div>
          </div>
        </div>
      )}
    </GlassCard>
  );
}
