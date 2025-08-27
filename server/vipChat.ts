/**
 * VaultMesh VIP Integrated Chat System
 * File: QN-VIP-CHAT-101-2025
 * Real-time chat with 9-second sync for VIP users
 */

import { Request, Response } from 'express';
import { WebSocket } from 'ws';

// VIP Chat Types
export interface VipChatMessage {
  id: string;
  userId: string;
  username: string;
  message: string;
  timestamp: Date;
  messageType: 'text' | 'system' | 'vip' | 'alert';
  vipLevel: 'standard' | 'premium' | 'platinum' | 'diamond';
  syncTime: number; // milliseconds
  connectionId: string;
}

export interface VipChatRoom {
  id: string;
  name: string;
  type: 'vip' | 'system' | 'global' | 'private';
  vipOnly: boolean;
  maxSyncTime: number; // 9 seconds max
  activeUsers: Map<string, VipChatUser>;
  messages: VipChatMessage[];
  lastActivity: Date;
}

export interface VipChatUser {
  id: string;
  username: string;
  vipLevel: 'standard' | 'premium' | 'platinum' | 'diamond';
  connectionId: string;
  lastSeen: Date;
  syncLatency: number;
  connectionStatus: 'connected' | 'syncing' | 'dropped' | 'reconnecting';
  ws?: WebSocket;
}

export interface ChatConnection {
  id: string;
  userId: string;
  ws: WebSocket;
  lastPing: Date;
  syncLatency: number;
  vipLevel: string;
}

// Storage
const vipChatRooms: Map<string, VipChatRoom> = new Map();
const vipChatUsers: Map<string, VipChatUser> = new Map();
const activeConnections: Map<string, ChatConnection> = new Map();
const messageHistory: VipChatMessage[] = [];

// Initialize VIP Chat Room
const vipMainRoom: VipChatRoom = {
  id: 'vip-main-001',
  name: 'VIP Main Chat',
  type: 'vip',
  vipOnly: true,
  maxSyncTime: 9000, // 9 seconds max
  activeUsers: new Map(),
  messages: [],
  lastActivity: new Date()
};

vipChatRooms.set(vipMainRoom.id, vipMainRoom);

// Chat Functions
export function createVipChatMessage(
  userId: string,
  username: string,
  message: string,
  vipLevel: VipChatUser['vipLevel'] = 'standard',
  connectionId: string
): VipChatMessage {
  const id = `msg-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
  
  const chatMessage: VipChatMessage = {
    id,
    userId,
    username,
    message,
    timestamp: new Date(),
    messageType: vipLevel === 'standard' ? 'text' : 'vip',
    vipLevel,
    syncTime: Date.now(),
    connectionId
  };
  
  // Add to room and history
  const room = vipChatRooms.get('vip-main-001');
  if (room) {
    room.messages.push(chatMessage);
    room.lastActivity = new Date();
    
    // Keep only last 100 messages
    if (room.messages.length > 100) {
      room.messages = room.messages.slice(-100);
    }
  }
  
  messageHistory.push(chatMessage);
  if (messageHistory.length > 1000) {
    messageHistory.splice(0, messageHistory.length - 1000);
  }
  
  console.log(`[VIP Chat] Message created: ${username} - ${message.substring(0, 50)}...`);
  return chatMessage;
}

export function addVipUser(
  userId: string,
  username: string,
  vipLevel: VipChatUser['vipLevel'] = 'standard',
  ws?: WebSocket
): VipChatUser {
  const connectionId = `conn-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
  
  const user: VipChatUser = {
    id: userId,
    username,
    vipLevel,
    connectionId,
    lastSeen: new Date(),
    syncLatency: 0,
    connectionStatus: 'connected',
    ws
  };
  
  vipChatUsers.set(userId, user);
  
  // Add to main VIP room
  const room = vipChatRooms.get('vip-main-001');
  if (room) {
    room.activeUsers.set(userId, user);
  }
  
  // Track connection
  if (ws) {
    const connection: ChatConnection = {
      id: connectionId,
      userId,
      ws,
      lastPing: new Date(),
      syncLatency: 0,
      vipLevel
    };
    activeConnections.set(connectionId, connection);
  }
  
  console.log(`[VIP Chat] User added: ${username} (${vipLevel})`);
  return user;
}

export function broadcastToVipUsers(message: VipChatMessage, excludeUserId?: string): number {
  let broadcastCount = 0;
  const startTime = Date.now();
  
  activeConnections.forEach((connection, connectionId) => {
    if (excludeUserId && connection.userId === excludeUserId) return;
    if (!connection.ws || connection.ws.readyState !== WebSocket.OPEN) return;
    
    try {
      const syncPayload = {
        type: 'vip-chat-message',
        data: message,
        syncTime: Date.now(),
        maxSyncTime: 9000,
        connectionId
      };
      
      connection.ws.send(JSON.stringify(syncPayload));
      connection.lastPing = new Date();
      broadcastCount++;
      
      // Calculate sync latency
      const syncLatency = Date.now() - startTime;
      connection.syncLatency = syncLatency;
      
      // Update user sync latency
      const user = vipChatUsers.get(connection.userId);
      if (user) {
        user.syncLatency = syncLatency;
        user.lastSeen = new Date();
        user.connectionStatus = syncLatency > 9000 ? 'dropped' : 'connected';
      }
      
    } catch (error) {
      console.error(`[VIP Chat] Broadcast error for connection ${connectionId}:`, error);
      // Remove failed connection
      activeConnections.delete(connectionId);
    }
  });
  
  console.log(`[VIP Chat] Broadcasted to ${broadcastCount} VIP users in ${Date.now() - startTime}ms`);
  return broadcastCount;
}

export function handleVipChatConnection(ws: WebSocket, userId: string, username: string, vipLevel: string = 'standard') {
  const user = addVipUser(userId, username, vipLevel as any, ws);
  
  // Send welcome message
  const welcomeMessage = createVipChatMessage(
    'system',
    'VaultMesh System',
    `${username} joined VIP chat (${vipLevel})`,
    'standard',
    user.connectionId
  );
  
  broadcastToVipUsers(welcomeMessage);
  
  // Send recent messages to new user
  const room = vipChatRooms.get('vip-main-001');
  if (room && room.messages.length > 0) {
    const recentMessages = room.messages.slice(-20); // Last 20 messages
    ws.send(JSON.stringify({
      type: 'vip-chat-history',
      data: recentMessages,
      syncTime: Date.now()
    }));
  }
  
  // Setup ping/pong for connection monitoring
  const pingInterval = setInterval(() => {
    if (ws.readyState === WebSocket.OPEN) {
      const connection = Array.from(activeConnections.values()).find(c => c.userId === userId);
      if (connection) {
        const pingTime = Date.now();
        ws.ping();
        
        // Check if sync time exceeded 9 seconds
        const syncLatency = Date.now() - connection.lastPing.getTime();
        if (syncLatency > 9000) {
          console.log(`[VIP Chat] Connection ${userId} exceeding 9sec sync - attempting reconnect`);
          user.connectionStatus = 'reconnecting';
          broadcastToVipUsers(createVipChatMessage(
            'system',
            'VaultMesh System',
            `${username} reconnecting (sync exceeded 9s)`,
            'standard',
            user.connectionId
          ));
        }
      }
    } else {
      clearInterval(pingInterval);
    }
  }, 3000); // Ping every 3 seconds
  
  // Handle messages
  ws.on('message', (data) => {
    try {
      const payload = JSON.parse(data.toString());
      
      if (payload.type === 'vip-chat-send') {
        const message = createVipChatMessage(
          userId,
          username,
          payload.message,
          vipLevel as any,
          user.connectionId
        );
        
        // Broadcast to all VIP users
        broadcastToVipUsers(message, userId);
        
        // Send confirmation back to sender
        ws.send(JSON.stringify({
          type: 'vip-chat-sent',
          data: message,
          syncTime: Date.now()
        }));
      }
      
    } catch (error) {
      console.error('[VIP Chat] Message parsing error:', error);
    }
  });
  
  // Handle disconnect
  ws.on('close', () => {
    clearInterval(pingInterval);
    
    // Remove from active connections
    const connection = Array.from(activeConnections.entries()).find(([_, c]) => c.userId === userId);
    if (connection) {
      activeConnections.delete(connection[0]);
    }
    
    // Update user status
    user.connectionStatus = 'dropped';
    user.lastSeen = new Date();
    
    // Remove from room
    const room = vipChatRooms.get('vip-main-001');
    if (room) {
      room.activeUsers.delete(userId);
    }
    
    // Broadcast disconnect
    const disconnectMessage = createVipChatMessage(
      'system',
      'VaultMesh System',
      `${username} disconnected`,
      'standard',
      user.connectionId
    );
    
    broadcastToVipUsers(disconnectMessage);
    
    console.log(`[VIP Chat] User disconnected: ${username}`);
  });
  
  console.log(`[VIP Chat] WebSocket connection established for ${username}`);
}

// Route Handlers
export const vipChatRoutes = {
  // Get chat status
  getChatStatus: async (req: Request, res: Response) => {
    try {
      const rooms = Array.from(vipChatRooms.values());
      const users = Array.from(vipChatUsers.values());
      const connections = Array.from(activeConnections.values());
      
      const summary = {
        totalRooms: rooms.length,
        activeUsers: users.filter(u => u.connectionStatus === 'connected').length,
        totalUsers: users.length,
        activeConnections: connections.length,
        averageSyncLatency: connections.length > 0 ? 
          Math.round(connections.reduce((sum, c) => sum + c.syncLatency, 0) / connections.length) : 0,
        droppedConnections: users.filter(u => u.connectionStatus === 'dropped').length,
        vipBreakdown: {
          standard: users.filter(u => u.vipLevel === 'standard').length,
          premium: users.filter(u => u.vipLevel === 'premium').length,
          platinum: users.filter(u => u.vipLevel === 'platinum').length,
          diamond: users.filter(u => u.vipLevel === 'diamond').length
        }
      };
      
      res.json({
        success: true,
        data: {
          rooms,
          users,
          connections: connections.map(c => ({
            id: c.id,
            userId: c.userId,
            syncLatency: c.syncLatency,
            vipLevel: c.vipLevel,
            lastPing: c.lastPing
          })),
          summary
        },
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('[VIP Chat] Get status error:', error);
      res.status(500).json({ 
        error: 'Failed to get chat status',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  },

  // Get recent messages
  getMessages: async (req: Request, res: Response) => {
    try {
      const { limit = 50, roomId = 'vip-main-001' } = req.query;
      
      const room = vipChatRooms.get(roomId as string);
      if (!room) {
        return res.status(404).json({ error: 'Chat room not found' });
      }
      
      const messages = room.messages.slice(-(limit as number));
      
      res.json({
        success: true,
        data: messages,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('[VIP Chat] Get messages error:', error);
      res.status(500).json({ 
        error: 'Failed to get messages',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  },

  // Send message via API (fallback)
  sendMessage: async (req: Request, res: Response) => {
    try {
      const { userId, username, message, vipLevel = 'standard' } = req.body;
      
      if (!userId || !username || !message) {
        return res.status(400).json({ 
          error: 'Missing required fields: userId, username, message' 
        });
      }
      
      const user = vipChatUsers.get(userId) || addVipUser(userId, username, vipLevel);
      
      const chatMessage = createVipChatMessage(
        userId,
        username,
        message,
        vipLevel,
        user.connectionId
      );
      
      const broadcastCount = broadcastToVipUsers(chatMessage);
      
      res.json({
        success: true,
        data: chatMessage,
        broadcastCount,
        message: 'Message sent to VIP chat',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('[VIP Chat] Send message error:', error);
      res.status(500).json({ 
        error: 'Failed to send message',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  },

  // Join VIP chat room
  joinRoom: async (req: Request, res: Response) => {
    try {
      const { userId, username, vipLevel = 'standard' } = req.body;
      
      if (!userId || !username) {
        return res.status(400).json({ 
          error: 'Missing required fields: userId, username' 
        });
      }
      
      const user = addVipUser(userId, username, vipLevel);
      
      res.json({
        success: true,
        data: user,
        message: 'Joined VIP chat room',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('[VIP Chat] Join room error:', error);
      res.status(500).json({ 
        error: 'Failed to join chat room',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
};