import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  MessageCircle, 
  Send, 
  Users,
  Wifi,
  WifiOff,
  Clock,
  Crown,
  Zap,
  CheckCircle,
  AlertTriangle,
  Signal
} from 'lucide-react';

interface VipChatMessage {
  id: string;
  userId: string;
  username: string;
  message: string;
  timestamp: string;
  messageType: 'text' | 'system' | 'vip' | 'alert';
  vipLevel: 'standard' | 'premium' | 'platinum' | 'diamond';
  syncTime: number;
  connectionId: string;
}

interface VipChatUser {
  id: string;
  username: string;
  vipLevel: 'standard' | 'premium' | 'platinum' | 'diamond';
  connectionId: string;
  lastSeen: string;
  syncLatency: number;
  connectionStatus: 'connected' | 'syncing' | 'dropped' | 'reconnecting';
}

interface ChatConnection {
  id: string;
  userId: string;
  syncLatency: number;
  vipLevel: string;
  lastPing: string;
}

interface VipChatData {
  users: VipChatUser[];
  connections: ChatConnection[];
  summary: {
    totalRooms: number;
    activeUsers: number;
    totalUsers: number;
    activeConnections: number;
    averageSyncLatency: number;
    droppedConnections: number;
    vipBreakdown: {
      standard: number;
      premium: number;
      platinum: number;
      diamond: number;
    };
  };
}

export default function VipChatInterface() {
  const [messages, setMessages] = useState<VipChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [chatData, setChatData] = useState<VipChatData | null>(null);
  const [username, setUsername] = useState('VIP_User');
  const [vipLevel, setVipLevel] = useState<'standard' | 'premium' | 'platinum' | 'diamond'>('premium');
  const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'connecting' | 'connected' | 'syncing'>('disconnected');
  const [syncLatency, setSyncLatency] = useState(0);
  const [wsConnected, setWsConnected] = useState(false);
  
  const wsRef = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const syncTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    loadChatData();
    const interval = setInterval(loadChatData, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current);
      }
    };
  }, []);

  const loadChatData = async () => {
    try {
      const response = await fetch('/api/vip-chat/status');
      const data = await response.json();
      if (data.success) {
        setChatData(data.data);
      }
    } catch (error) {
      console.error('[VIP Chat] Failed to load data:', error);
    }
  };

  const loadMessages = async () => {
    try {
      const response = await fetch('/api/vip-chat/messages?limit=50');
      const data = await response.json();
      if (data.success) {
        setMessages(data.data);
      }
    } catch (error) {
      console.error('[VIP Chat] Failed to load messages:', error);
    }
  };

  const connectWebSocket = () => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return;
    
    setConnectionStatus('connecting');
    
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    
    try {
      wsRef.current = new WebSocket(wsUrl);
      
      wsRef.current.onopen = () => {
        console.log('[VIP Chat] WebSocket connected');
        setConnectionStatus('connected');
        setWsConnected(true);
        
        // Join VIP chat
        wsRef.current?.send(JSON.stringify({
          type: 'vip-chat-join',
          userId: `user-${Date.now()}`,
          username,
          vipLevel
        }));
        
        loadMessages();
      };
      
      wsRef.current.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);
          const receiveTime = Date.now();
          
          if (payload.type === 'vip-chat-message') {
            setMessages(prev => [...prev, payload.data]);
            
            // Calculate sync latency
            const latency = receiveTime - payload.syncTime;
            setSyncLatency(latency);
            
            // Check if sync exceeds 9 seconds
            if (latency > 9000) {
              setConnectionStatus('syncing');
              console.warn('[VIP Chat] Sync latency exceeded 9 seconds:', latency);
            } else {
              setConnectionStatus('connected');
            }
          }
          
          if (payload.type === 'vip-chat-history') {
            setMessages(payload.data);
          }
          
          if (payload.type === 'vip-chat-sent') {
            // Message sent confirmation
            console.log('[VIP Chat] Message sent:', payload.data);
          }
          
        } catch (error) {
          console.error('[VIP Chat] Message parsing error:', error);
        }
      };
      
      wsRef.current.onerror = (error) => {
        console.error('[VIP Chat] WebSocket error:', error);
        setConnectionStatus('disconnected');
        setWsConnected(false);
      };
      
      wsRef.current.onclose = () => {
        console.log('[VIP Chat] WebSocket disconnected');
        setConnectionStatus('disconnected');
        setWsConnected(false);
        
        // Auto-reconnect after 3 seconds
        setTimeout(() => {
          if (connectionStatus !== 'connected') {
            connectWebSocket();
          }
        }, 3000);
      };
      
    } catch (error) {
      console.error('[VIP Chat] WebSocket connection error:', error);
      setConnectionStatus('disconnected');
      setWsConnected(false);
    }
  };

  const sendMessage = () => {
    if (!newMessage.trim() || !wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      return;
    }
    
    const sendTime = Date.now();
    
    wsRef.current.send(JSON.stringify({
      type: 'vip-chat-send',
      message: newMessage.trim(),
      sendTime
    }));
    
    setNewMessage('');
    
    // Start sync timeout monitoring
    if (syncTimeoutRef.current) {
      clearTimeout(syncTimeoutRef.current);
    }
    
    syncTimeoutRef.current = setTimeout(() => {
      if (syncLatency > 9000) {
        setConnectionStatus('syncing');
        console.warn('[VIP Chat] Message sync exceeded 9 seconds');
      }
    }, 9500);
  };

  const sendMessageFallback = async () => {
    if (!newMessage.trim()) return;
    
    try {
      const response = await fetch('/api/vip-chat/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: `user-${Date.now()}`,
          username,
          message: newMessage.trim(),
          vipLevel
        }),
      });

      const data = await response.json();
      if (data.success) {
        setNewMessage('');
        loadMessages();
      }
    } catch (error) {
      console.error('[VIP Chat] Fallback send error:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const getVipLevelIcon = (level: string) => {
    switch (level) {
      case 'diamond': return <Crown className="h-4 w-4 text-blue-400" />;
      case 'platinum': return <Crown className="h-4 w-4 text-gray-300" />;
      case 'premium': return <Crown className="h-4 w-4 text-yellow-400" />;
      case 'standard': return <Users className="h-4 w-4 text-green-400" />;
      default: return <Users className="h-4 w-4 text-gray-400" />;
    }
  };

  const getVipLevelColor = (level: string) => {
    switch (level) {
      case 'diamond': return 'text-blue-400 border-blue-400';
      case 'platinum': return 'text-gray-300 border-gray-300';
      case 'premium': return 'text-yellow-400 border-yellow-400';
      case 'standard': return 'text-green-400 border-green-400';
      default: return 'text-gray-400 border-gray-400';
    }
  };

  const getConnectionIcon = () => {
    switch (connectionStatus) {
      case 'connected': return <Wifi className="h-4 w-4 text-green-400" />;
      case 'connecting': return <Signal className="h-4 w-4 text-yellow-400 animate-pulse" />;
      case 'syncing': return <Clock className="h-4 w-4 text-orange-400 animate-spin" />;
      case 'disconnected': return <WifiOff className="h-4 w-4 text-red-400" />;
      default: return <WifiOff className="h-4 w-4 text-gray-400" />;
    }
  };

  const getConnectionColor = () => {
    switch (connectionStatus) {
      case 'connected': return 'text-green-400 border-green-400';
      case 'connecting': return 'text-yellow-400 border-yellow-400';
      case 'syncing': return 'text-orange-400 border-orange-400';
      case 'disconnected': return 'text-red-400 border-red-400';
      default: return 'text-gray-400 border-gray-400';
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  return (
    <div className="space-y-6">
      {/* VIP Chat Header */}
      <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-cyan-500/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-cyan-400">
            <MessageCircle className="h-6 w-6" />
            VIP Integrated Chat - 9 Second Max Sync
          </CardTitle>
          <div className="flex items-center gap-4 text-sm flex-wrap">
            <Badge variant="outline" className={getConnectionColor()}>
              {getConnectionIcon()}
              <span className="ml-1">{connectionStatus.toUpperCase()}</span>
            </Badge>
            <Badge variant="outline" className="text-purple-400 border-purple-400">
              <Clock className="h-3 w-3 mr-1" />
              Sync: {syncLatency}ms
            </Badge>
            {chatData && (
              <>
                <Badge variant="outline" className="text-green-400 border-green-400">
                  <Users className="h-3 w-3 mr-1" />
                  {chatData.summary.activeUsers} Active
                </Badge>
                <Badge variant="outline" className="text-blue-400 border-blue-400">
                  Avg Sync: {chatData.summary.averageSyncLatency}ms
                </Badge>
              </>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* User Setup */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
            <Input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              className="bg-gray-800 border-gray-600 text-white"
              data-testid="username-input"
            />
            <select
              value={vipLevel}
              onChange={(e) => setVipLevel(e.target.value as any)}
              className="bg-gray-800 border border-gray-600 text-white rounded px-3 py-2 text-sm"
              data-testid="vip-level"
            >
              <option value="standard">Standard</option>
              <option value="premium">Premium</option>
              <option value="platinum">Platinum</option>
              <option value="diamond">Diamond</option>
            </select>
            <Button
              onClick={connectWebSocket}
              disabled={connectionStatus === 'connected' || connectionStatus === 'connecting'}
              className="bg-green-600 hover:bg-green-700"
              data-testid="connect-chat"
            >
              {connectionStatus === 'connecting' ? (
                <Signal className="h-4 w-4 mr-2 animate-pulse" />
              ) : (
                <Wifi className="h-4 w-4 mr-2" />
              )}
              {connectionStatus === 'connected' ? 'Connected' : 'Connect Chat'}
            </Button>
            <Button
              onClick={loadMessages}
              variant="outline"
              className="border-gray-600"
              data-testid="refresh-messages"
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>

          {/* Sync Warning */}
          {syncLatency > 9000 && (
            <div className="p-3 bg-orange-900/30 border border-orange-500/50 rounded">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-orange-400" />
                <span className="text-orange-400 font-medium">Sync Exceeded 9 Seconds</span>
              </div>
              <p className="text-orange-300 text-sm mt-1">
                Connection sync time: {syncLatency}ms. Attempting to maintain VIP connection quality.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Chat Messages */}
      <Card className="bg-gray-800 border-gray-600">
        <CardHeader>
          <CardTitle className="text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              VIP Chat Messages
            </div>
            {wsConnected && (
              <Badge className="bg-green-600">
                <Zap className="h-3 w-3 mr-1" />
                LIVE
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Messages Container */}
          <div className="h-96 overflow-y-auto bg-gray-900 rounded p-4 mb-4 space-y-3">
            {messages.length === 0 ? (
              <div className="text-center text-gray-400 py-8">
                <MessageCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No messages yet. Start the VIP conversation!</p>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.messageType === 'system' ? 'opacity-75' : ''}`}
                >
                  <div className="flex-shrink-0">
                    {getVipLevelIcon(message.vipLevel)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-white">{message.username}</span>
                      <Badge variant="outline" className={`text-xs ${getVipLevelColor(message.vipLevel)}`}>
                        {message.vipLevel.toUpperCase()}
                      </Badge>
                      <span className="text-xs text-gray-400">{formatTime(message.timestamp)}</span>
                    </div>
                    <p className="text-gray-300 break-words">{message.message}</p>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div className="flex gap-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your VIP message..."
              className="bg-gray-700 border-gray-600 text-white flex-1"
              data-testid="message-input"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  wsConnected ? sendMessage() : sendMessageFallback();
                }
              }}
            />
            <Button
              onClick={wsConnected ? sendMessage : sendMessageFallback}
              disabled={!newMessage.trim()}
              className="bg-cyan-600 hover:bg-cyan-700"
              data-testid="send-message"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>

          {/* Connection Status */}
          <div className="flex justify-between items-center mt-3 text-xs text-gray-400">
            <span>
              {wsConnected ? 'WebSocket connected' : 'Using HTTP fallback'} | 
              Sync: {syncLatency}ms {syncLatency <= 9000 ? '✓' : '⚠️'}
            </span>
            <span>VIP {vipLevel} | Max sync: 9000ms</span>
          </div>
        </CardContent>
      </Card>

      {/* Chat Statistics */}
      {chatData && (
        <Card className="bg-gray-800 border-gray-600">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Users className="h-5 w-5" />
              VIP Chat Statistics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-400">{chatData.summary.activeUsers}</p>
                <p className="text-xs text-gray-400">Active Users</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-400">{chatData.summary.averageSyncLatency}ms</p>
                <p className="text-xs text-gray-400">Avg Sync Time</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-400">{chatData.summary.activeConnections}</p>
                <p className="text-xs text-gray-400">Live Connections</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-orange-400">{chatData.summary.droppedConnections}</p>
                <p className="text-xs text-gray-400">Dropped Conns</p>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <h4 className="text-white font-medium">VIP Level Distribution</h4>
              <div className="grid grid-cols-4 gap-2 text-xs">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-400 rounded"></div>
                  <span className="text-gray-400">Standard: {chatData.summary.vipBreakdown.standard}</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-yellow-400 rounded"></div>
                  <span className="text-gray-400">Premium: {chatData.summary.vipBreakdown.premium}</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-gray-300 rounded"></div>
                  <span className="text-gray-400">Platinum: {chatData.summary.vipBreakdown.platinum}</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-blue-400 rounded"></div>
                  <span className="text-gray-400">Diamond: {chatData.summary.vipBreakdown.diamond}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Chat Info */}
      <Card className="bg-gray-800 border-gray-600">
        <CardContent className="p-4">
          <div className="text-sm text-gray-400 space-y-2">
            <p><strong className="text-cyan-400">VIP Chat System:</strong> Real-time integrated chat with 9-second maximum sync time</p>
            <p><strong className="text-green-400">WebSocket Connection:</strong> Live messaging with automatic reconnection</p>
            <p><strong className="text-orange-400">Sync Monitoring:</strong> Prevents connection drops with latency tracking</p>
            <p><strong className="text-purple-400">VIP Levels:</strong> Standard, Premium, Platinum, Diamond user tiers</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}