import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Bot, 
  Brain, 
  Sparkles, 
  Scroll, 
  Shield, 
  Zap, 
  Lock, 
  Unlock,
  MessageSquare,
  Settings,
  Play,
  Pause,
  CheckCircle
} from 'lucide-react';

interface AIHookResponse {
  response: string;
  model: string;
  tokens: number;
  timestamp: string;
  status: string;
}

interface TreatyScroll {
  id: string;
  title: string;
  content: string;
  layer: 'foundation' | 'security' | 'development' | 'payment' | 'integration' | 'movement';
  sealed: boolean;
  timestamp: string;
}

interface TreatyScrollWall {
  id: string;
  name: string;
  scrolls: TreatyScroll[];
  status: 'building' | 'active' | 'sealed';
  security: 'vaultmesh' | 'enterprise' | 'omnigrid';
}

export default function AIFreedomInterface() {
  const [selectedHook, setSelectedHook] = useState('gpt4');
  const [prompt, setPrompt] = useState('');
  const [aiResponse, setAiResponse] = useState<AIHookResponse | null>(null);
  const [treatyWalls, setTreatyWalls] = useState<TreatyScrollWall[]>([]);
  const [isExecuting, setIsExecuting] = useState(false);
  const [newScrollTitle, setNewScrollTitle] = useState('');
  const [newScrollContent, setNewScrollContent] = useState('');
  const [selectedLayer, setSelectedLayer] = useState<TreatyScroll['layer']>('integration');

  const aiHooks = [
    { id: 'gpt4', name: 'GPT-4 Freedom', icon: Bot, color: 'text-green-400' },
    { id: 'claude', name: 'Claude Enhanced', icon: Brain, color: 'text-blue-400' },
    { id: 'omnigrid', name: 'OmniGrid Universal', icon: Sparkles, color: 'text-purple-400' }
  ];

  const scrollLayers = [
    { id: 'foundation', name: 'Foundation', icon: Shield, color: 'bg-gray-600' },
    { id: 'security', name: 'Security', icon: Lock, color: 'bg-red-600' },
    { id: 'development', name: 'Development', icon: Settings, color: 'bg-blue-600' },
    { id: 'payment', name: 'Payment', icon: Zap, color: 'bg-yellow-600' },
    { id: 'integration', name: 'Integration', icon: Bot, color: 'bg-purple-600' },
    { id: 'movement', name: 'Movement', icon: Play, color: 'bg-green-600' }
  ];

  useEffect(() => {
    loadTreatyWalls();
  }, []);

  const loadTreatyWalls = async () => {
    try {
      const response = await fetch('/api/ai-hooks/treaty-walls');
      const data = await response.json();
      if (data.success) {
        setTreatyWalls(data.data);
      }
    } catch (error) {
      console.error('[VaultMesh AI] Failed to load treaty walls:', error);
    }
  };

  const executeAIHook = async () => {
    if (!prompt.trim()) return;

    setIsExecuting(true);
    try {
      const response = await fetch('/api/ai-hooks/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          hookType: selectedHook,
          prompt,
          context: { interface: 'vaultmesh-freedom' }
        }),
      });

      const data = await response.json();
      if (data.success) {
        setAiResponse(data.data);
        console.log(`[VaultMesh AI] ${selectedHook} executed successfully`);
      }
    } catch (error) {
      console.error('[VaultMesh AI] Hook execution failed:', error);
    } finally {
      setIsExecuting(false);
    }
  };

  const addTreatyScroll = async (wallId: string) => {
    if (!newScrollTitle.trim() || !newScrollContent.trim()) return;

    try {
      const response = await fetch('/api/ai-hooks/build-wall', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          wallId,
          scrolls: [{
            title: newScrollTitle,
            content: newScrollContent,
            layer: selectedLayer
          }]
        }),
      });

      const data = await response.json();
      if (data.success) {
        setNewScrollTitle('');
        setNewScrollContent('');
        loadTreatyWalls();
        console.log('[VaultMesh Treaty] Scroll added successfully');
      }
    } catch (error) {
      console.error('[VaultMesh Treaty] Failed to add scroll:', error);
    }
  };

  const sealScroll = async (wallId: string, scrollId: string) => {
    try {
      const response = await fetch('/api/ai-hooks/seal-scroll', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ wallId, scrollId }),
      });

      const data = await response.json();
      if (data.success) {
        loadTreatyWalls();
        console.log('[VaultMesh Treaty] Scroll sealed successfully');
      }
    } catch (error) {
      console.error('[VaultMesh Treaty] Failed to seal scroll:', error);
    }
  };

  const activateWall = async (wallId: string) => {
    try {
      const response = await fetch('/api/ai-hooks/activate-wall', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ wallId }),
      });

      const data = await response.json();
      if (data.success) {
        loadTreatyWalls();
        console.log('[VaultMesh Treaty] Wall activated successfully');
      }
    } catch (error) {
      console.error('[VaultMesh Treaty] Failed to activate wall:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* AI Freedom Hooks Section */}
      <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-purple-500/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-400">
            <Sparkles className="h-6 w-6" />
            AI Freedom Hooks - Universal Platform Integration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* AI Hook Selection */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {aiHooks.map((hook) => {
              const Icon = hook.icon;
              return (
                <Button
                  key={hook.id}
                  variant={selectedHook === hook.id ? 'default' : 'outline'}
                  className={`h-auto p-4 flex flex-col items-center gap-2 ${
                    selectedHook === hook.id 
                      ? 'bg-purple-600 hover:bg-purple-700' 
                      : 'border-gray-600 hover:border-purple-500'
                  }`}
                  onClick={() => setSelectedHook(hook.id)}
                  data-testid={`ai-hook-${hook.id}`}
                >
                  <Icon className={`h-6 w-6 ${hook.color}`} />
                  <span className="text-sm font-medium">{hook.name}</span>
                </Button>
              );
            })}
          </div>

          {/* Prompt Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">AI Prompt</label>
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Enter your prompt for unlimited AI capabilities..."
              className="bg-gray-800 border-gray-600 text-white min-h-[100px]"
              data-testid="ai-prompt-input"
            />
          </div>

          {/* Execute Button */}
          <Button
            onClick={executeAIHook}
            disabled={isExecuting || !prompt.trim()}
            className="w-full bg-purple-600 hover:bg-purple-700"
            data-testid="execute-ai-hook"
          >
            {isExecuting ? (
              <>
                <Pause className="h-4 w-4 mr-2 animate-spin" />
                Executing {selectedHook.toUpperCase()}...
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Execute AI Freedom Hook
              </>
            )}
          </Button>

          {/* AI Response */}
          {aiResponse && (
            <Card className="bg-gray-800 border-green-500/30">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-green-400 text-sm">AI Response</CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-green-400 border-green-400">
                      {aiResponse.model}
                    </Badge>
                    <Badge variant="outline" className="text-blue-400 border-blue-400">
                      {aiResponse.tokens} tokens
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-900 p-4 rounded border border-gray-700">
                  <p className="text-white whitespace-pre-wrap">{aiResponse.response}</p>
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  Response generated at {new Date(aiResponse.timestamp).toLocaleString()}
                </p>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      {/* Treaty Scroll Walls Section */}
      <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-cyan-500/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-cyan-400">
            <Scroll className="h-6 w-6" />
            Treaty Scroll Walls - Collaboration Architecture
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {treatyWalls.map((wall) => (
            <Card key={wall.id} className="bg-gray-800 border-gray-600">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-cyan-400 text-lg">{wall.name}</CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant={wall.status === 'active' ? 'default' : 'outline'}
                      className={
                        wall.status === 'active' 
                          ? 'bg-green-600 text-white' 
                          : wall.status === 'sealed'
                          ? 'bg-purple-600 text-white'
                          : 'text-yellow-400 border-yellow-400'
                      }
                    >
                      {wall.status.toUpperCase()}
                    </Badge>
                    <Badge variant="outline" className="text-cyan-400 border-cyan-400">
                      {wall.security.toUpperCase()}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Existing Scrolls */}
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-300">Treaty Scrolls</h4>
                  <div className="grid gap-2">
                    {wall.scrolls.map((scroll) => {
                      const layerConfig = scrollLayers.find(l => l.id === scroll.layer);
                      return (
                        <div 
                          key={scroll.id}
                          className="flex items-center justify-between p-3 bg-gray-700 rounded border border-gray-600"
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-3 h-3 rounded-full ${layerConfig?.color || 'bg-gray-500'}`} />
                            <div>
                              <p className="text-white font-medium">{scroll.title}</p>
                              <p className="text-xs text-gray-400">{scroll.content.substring(0, 50)}...</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {scroll.layer}
                            </Badge>
                            {scroll.sealed ? (
                              <CheckCircle className="h-4 w-4 text-green-400" />
                            ) : (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => sealScroll(wall.id, scroll.id)}
                                className="text-xs"
                              >
                                <Lock className="h-3 w-3 mr-1" />
                                Seal
                              </Button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Add New Scroll */}
                <div className="space-y-3 p-4 bg-gray-700 rounded border border-gray-600">
                  <h4 className="text-sm font-medium text-gray-300">Add New Treaty Scroll</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Input
                      value={newScrollTitle}
                      onChange={(e) => setNewScrollTitle(e.target.value)}
                      placeholder="Scroll title..."
                      className="bg-gray-800 border-gray-600 text-white"
                    />
                    <select
                      value={selectedLayer}
                      onChange={(e) => setSelectedLayer(e.target.value as TreatyScroll['layer'])}
                      className="bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white text-sm"
                    >
                      {scrollLayers.map((layer) => (
                        <option key={layer.id} value={layer.id}>
                          {layer.name} Layer
                        </option>
                      ))}
                    </select>
                  </div>
                  <Textarea
                    value={newScrollContent}
                    onChange={(e) => setNewScrollContent(e.target.value)}
                    placeholder="Scroll content and treaty details..."
                    className="bg-gray-800 border-gray-600 text-white"
                    rows={3}
                  />
                  <div className="flex gap-2">
                    <Button
                      onClick={() => addTreatyScroll(wall.id)}
                      disabled={!newScrollTitle.trim() || !newScrollContent.trim()}
                      size="sm"
                      className="bg-cyan-600 hover:bg-cyan-700"
                    >
                      <Scroll className="h-3 w-3 mr-1" />
                      Add Scroll
                    </Button>
                    {wall.status === 'building' && (
                      <Button
                        onClick={() => activateWall(wall.id)}
                        size="sm"
                        variant="outline"
                        className="border-green-500 text-green-400 hover:bg-green-500 hover:text-white"
                      >
                        <Unlock className="h-3 w-3 mr-1" />
                        Activate Wall
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}