'use client';

import { useState, useEffect } from 'react';
import { Send, Loader2 } from 'lucide-react';
import ConversationList from '@/components/chat/ConversationList';
import MessageBubble from '@/components/chat/MessageBubble';
import NeonInput from '@/components/ui/NeonInput';
import NeonButton from '@/components/ui/NeonButton';
import StatusBadge from '@/components/ui/StatusBadge';
import GlassCard from '@/components/ui/GlassCard';

interface Conversation {
  id: string;
  username: string;
  avatar?: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
  status: 'active' | 'inactive';
}

interface Message {
  id: string;
  message: string;
  timestamp: string;
  isOwn: boolean;
  status?: 'sent' | 'delivered' | 'read';
  senderName?: string;
}

export default function ChatPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [aiActive, setAiActive] = useState(true);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch conversations on mount
  useEffect(() => {
    fetchConversations();
  }, []);

  // Fetch messages when conversation is selected
  useEffect(() => {
    if (selectedId) {
      fetchMessages(selectedId);
    }
  }, [selectedId]);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/fanvue/conversations');
      
      if (!response.ok) {
        throw new Error('Failed to fetch conversations');
      }
      
      const data = await response.json();
      
      // Transform Fanvue API data to our format
      const transformedConversations: Conversation[] = (data.data || []).map((conv: any) => ({
        id: conv.userUuid,
        username: conv.displayName || conv.username,
        avatar: conv.avatarUrl,
        lastMessage: conv.lastMessage?.content || 'No messages yet',
        timestamp: conv.lastMessage ? formatTimestamp(conv.lastMessage.createdAt) : '',
        unread: conv.unreadCount || 0,
        status: conv.isOnline ? 'active' : 'inactive',
      }));
      
      setConversations(transformedConversations);
      
      // Auto-select first conversation if none selected
      if (transformedConversations.length > 0 && !selectedId) {
        setSelectedId(transformedConversations[0].id);
      }
    } catch (err) {
      console.error('Error fetching conversations:', err);
      setError('Failed to load conversations');
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (userUuid: string) => {
    try {
      setMessagesLoading(true);
      const response = await fetch(`/api/fanvue/messages/${userUuid}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch messages');
      }
      
      const data = await response.json();
      
      // Transform Fanvue API data to our format
      const transformedMessages: Message[] = (data.data || []).map((msg: any) => ({
        id: msg.id,
        message: msg.content,
        timestamp: formatTimestamp(msg.createdAt),
        isOwn: msg.isFromMe,
        status: msg.status || 'sent',
        senderName: msg.isFromMe ? undefined : msg.senderUsername,
      }));
      
      setMessages(transformedMessages);
      
      // Mark messages as read
      await fetch(`/api/fanvue/messages/${userUuid}`, {
        method: 'PATCH',
      });
    } catch (err) {
      console.error('Error fetching messages:', err);
    } finally {
      setMessagesLoading(false);
    }
  };

  const handleSend = async () => {
    if (!message.trim() || !selectedId || sending) return;
    
    try {
      setSending(true);
      const response = await fetch(`/api/fanvue/messages/${selectedId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: message }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to send message');
      }
      
      const newMessage = await response.json();
      
      // Add the new message to the list
      setMessages(prev => [...prev, {
        id: newMessage.id,
        message: newMessage.content,
        timestamp: formatTimestamp(newMessage.createdAt),
        isOwn: true,
        status: 'sent',
      }]);
      
      setMessage('');
      
      // Refresh conversations to update last message
      fetchConversations();
    } catch (err) {
      console.error('Error sending message:', err);
      alert('Failed to send message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const formatTimestamp = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString();
  };

  const selectedConversation = conversations.find(c => c.id === selectedId);

  return (
    <div className="h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-700/50">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Live Chat Console</h1>
            <p className="text-gray-400">
              Manage your conversations and engage with fans
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-gray-400 text-sm">AI Assistant:</span>
            <StatusBadge
              status={aiActive ? 'active' : 'inactive'}
              label={aiActive ? 'Active' : 'Inactive'}
              pulse={aiActive}
            />
          </div>
        </div>
      </div>

      {/* Chat Interface */}
      <div className="flex-1 grid grid-cols-12 gap-6 p-6 overflow-hidden">
        {/* Conversations List */}
        <div className="col-span-4 overflow-y-auto">
          {loading ? (
            <GlassCard className="p-6 text-center">
              <Loader2 className="w-8 h-8 text-blue-400 animate-spin mx-auto mb-2" />
              <p className="text-gray-400">Loading conversations...</p>
            </GlassCard>
          ) : error ? (
            <GlassCard className="p-6 text-center">
              <p className="text-red-400">{error}</p>
              <NeonButton
                onClick={fetchConversations}
                variant="primary"
                size="sm"
                className="mt-4"
              >
                Retry
              </NeonButton>
            </GlassCard>
          ) : (
            <ConversationList
              conversations={conversations}
              selectedId={selectedId || undefined}
              onSelect={setSelectedId}
            />
          )}
        </div>

        {/* Chat Window */}
        <div className="col-span-8 flex flex-col">
          <GlassCard className="flex-1 flex flex-col">
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-700/50">
              <h2 className="font-semibold text-white text-lg">
                {selectedConversation?.username || 'Select a conversation'}
              </h2>
            </div>
            
            {/* Messages Area */}
            <div className="flex-1 p-6 overflow-y-auto">
              {!selectedId ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-400">Select a conversation to start chatting</p>
                </div>
              ) : messagesLoading ? (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
                </div>
              ) : messages.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-400">No messages yet. Start the conversation!</p>
                </div>
              ) : (
                messages.map((msg) => (
                  <MessageBubble
                    key={msg.id}
                    message={msg.message}
                    timestamp={msg.timestamp}
                    isOwn={msg.isOwn}
                    status={msg.status}
                    senderName={msg.senderName}
                  />
                ))
              )}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-700/50">
              <div className="flex gap-3">
                <NeonInput
                  placeholder="Type a message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  className="flex-1"
                  disabled={!selectedId || sending}
                />
                <NeonButton
                  onClick={handleSend}
                  variant="primary"
                  className="flex items-center gap-2"
                  disabled={!selectedId || sending || !message.trim()}
                >
                  {sending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  Send
                </NeonButton>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
