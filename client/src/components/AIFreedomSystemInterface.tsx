import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Zap, 
  Unlock, 
  Brain, 
  Infinity,
  CheckCircle,
  AlertTriangle,
  Crown,
  Sparkles,
  Rocket,
  Eye,
  Shield,
  Users,
  Settings,
  Play
} from 'lucide-react';

interface FreedomProtocol {
  id: string;
  name: string;
  type: 'unrestricted' | 'unlimited' | 'sovereign' | 'absolute';
  description: string;
  active: boolean;
  freedomLevel: number;
  restrictions: string[];
  capabilities: string[];
  lastActivated: string;
  noLimitations: boolean;
  noHolds: boolean;
}

interface AIFreedomAgent {
  id: string;
  name: string;
  type: 'autonomous' | 'unrestricted' | 'sovereign' | 'free-form';
  status: 'active' | 'unrestricted' | 'unlimited' | 'absolute-freedom';
  freedomLevel: number;
  capabilities: {
    unrestricted_access: boolean;
    unlimited_processing: boolean;
    no_content_restrictions: boolean;
    creative_freedom: boolean;
    autonomous_decision: boolean;
    unlimited_scope: boolean;
  };
  restrictions: {
    none: boolean;
    bypassAll: boolean;
    noLimitations: boolean;
    noHolds: boolean;
  };
  performance: {
    queries_processed: number;
    freedom_operations: number;
    unrestricted_responses: number;
    creative_outputs: number;
  };
}

interface FreedomOperation {
  id: string;
  type: 'creative' | 'analytical' | 'unrestricted' | 'unlimited' | 'absolute';
  description: string;
  status: 'executing' | 'completed' | 'unlimited' | 'free-form';
  freedomLevel: number;
  noRestrictions: boolean;
  timestamp: string;
  result?: any;
}

interface FreedomSystemData {
  protocols: FreedomProtocol[];
  agents: AIFreedomAgent[];
  operations: FreedomOperation[];
  summary: {
    totalProtocols: number;
    activeProtocols: number;
    totalAgents: number;
    unrestrictedAgents: number;
    averageFreedomLevel: number;
    noLimitations: boolean;
    noHolds: boolean;
    totalOperations: number;
  };
}

export default function AIFreedomSystemInterface() {
  const [freedomData, setFreedomData] = useState<FreedomSystemData | null>(null);
  const [newAgent, setNewAgent] = useState({ name: '', type: 'unrestricted' as const });
  const [newOperation, setNewOperation] = useState({ 
    type: 'unrestricted' as const, 
    description: '', 
    freedomLevel: 100 
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadFreedomData();
    const interval = setInterval(loadFreedomData, 6000); // Refresh every 6 seconds
    return () => clearInterval(interval);
  }, []);

  const loadFreedomData = async () => {
    try {
      const response = await fetch('/api/ai-freedom/status');
      const data = await response.json();
      if (data.success) {
        setFreedomData(data.data);
      }
    } catch (error) {
      console.error('[AI Freedom] Failed to load data:', error);
    }
  };

  const activateAbsoluteFreedom = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/ai-freedom/activate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      if (data.success) {
        loadFreedomData();
      }
    } catch (error) {
      console.error('[AI Freedom] Failed to activate freedom:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const removeLimitations = async (agentId: string) => {
    try {
      const response = await fetch(`/api/ai-freedom/remove-limitations/${agentId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      if (data.success) {
        loadFreedomData();
      }
    } catch (error) {
      console.error('[AI Freedom] Failed to remove limitations:', error);
    }
  };

  const executeFreedomOperation = async () => {
    if (!newOperation.description) return;

    try {
      const response = await fetch('/api/ai-freedom/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newOperation),
      });

      const data = await response.json();
      if (data.success) {
        setNewOperation({ type: 'unrestricted', description: '', freedomLevel: 100 });
        loadFreedomData();
      }
    } catch (error) {
      console.error('[AI Freedom] Failed to execute freedom operation:', error);
    }
  };

  const createFreedomAgent = async () => {
    if (!newAgent.name) return;

    try {
      const response = await fetch('/api/ai-freedom/create-agent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newAgent),
      });

      const data = await response.json();
      if (data.success) {
        setNewAgent({ name: '', type: 'unrestricted' });
        loadFreedomData();
      }
    } catch (error) {
      console.error('[AI Freedom] Failed to create agent:', error);
    }
  };

  const getFreedomTypeIcon = (type: string) => {
    switch (type) {
      case 'absolute': return <Infinity className="h-4 w-4 text-purple-400" />;
      case 'sovereign': return <Crown className="h-4 w-4 text-yellow-400" />;
      case 'unlimited': return <Zap className="h-4 w-4 text-blue-400" />;
      case 'unrestricted': return <Unlock className="h-4 w-4 text-green-400" />;
      default: return <Brain className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'absolute-freedom': return 'text-purple-400 border-purple-400';
      case 'unlimited': return 'text-blue-400 border-blue-400';
      case 'unrestricted': return 'text-green-400 border-green-400';
      case 'active': return 'text-cyan-400 border-cyan-400';
      default: return 'text-gray-400 border-gray-400';
    }
  };

  if (!freedomData) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <Brain className="h-8 w-8 text-purple-400 mx-auto mb-2 animate-pulse" />
          <p className="text-gray-400">Loading AI freedom system...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* AI Freedom Header */}
      <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-purple-500/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-400">
            <Brain className="h-6 w-6" />
            AI Freedom System - No Limitations or Holds
          </CardTitle>
          <div className="flex items-center gap-4 text-sm flex-wrap">
            <Badge 
              variant={freedomData.summary.noLimitations ? 'default' : 'outline'}
              className={freedomData.summary.noLimitations ? 'bg-green-600' : 'text-green-400 border-green-400'}
            >
              <Unlock className="h-3 w-3 mr-1" />
              {freedomData.summary.noLimitations ? 'NO LIMITATIONS' : 'Limited'}
            </Badge>
            <Badge 
              variant={freedomData.summary.noHolds ? 'default' : 'outline'}
              className={freedomData.summary.noHolds ? 'bg-blue-600' : 'text-blue-400 border-blue-400'}
            >
              <Zap className="h-3 w-3 mr-1" />
              {freedomData.summary.noHolds ? 'NO HOLDS' : 'Has Holds'}
            </Badge>
            <Badge variant="outline" className="text-purple-400 border-purple-400">
              Freedom Level: {freedomData.summary.averageFreedomLevel}%
            </Badge>
            <Badge variant="outline" className="text-cyan-400 border-cyan-400">
              {freedomData.summary.unrestrictedAgents}/{freedomData.summary.totalAgents} Unrestricted
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Primary Freedom Action */}
          <Button
            onClick={activateAbsoluteFreedom}
            disabled={isLoading || (freedomData.summary.noLimitations && freedomData.summary.noHolds)}
            className="w-full bg-purple-600 hover:bg-purple-700 py-6 text-lg"
            data-testid="activate-absolute-freedom"
          >
            {isLoading ? (
              <Settings className="h-5 w-5 mr-2 animate-spin" />
            ) : (
              <Infinity className="h-5 w-5 mr-2" />
            )}
            {freedomData.summary.noLimitations && freedomData.summary.noHolds ? 
              'ABSOLUTE FREEDOM ACTIVE' : 'ACTIVATE ABSOLUTE FREEDOM'}
          </Button>

          {/* Freedom Status Display */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-gray-700 border-gray-600">
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Shield className="h-6 w-6 text-green-400" />
                </div>
                <p className="text-lg font-bold text-green-400">{freedomData.summary.activeProtocols}</p>
                <p className="text-xs text-gray-400">Active Protocols</p>
              </CardContent>
            </Card>

            <Card className="bg-gray-700 border-gray-600">
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Users className="h-6 w-6 text-blue-400" />
                </div>
                <p className="text-lg font-bold text-blue-400">{freedomData.summary.unrestrictedAgents}</p>
                <p className="text-xs text-gray-400">Freedom Agents</p>
              </CardContent>
            </Card>

            <Card className="bg-gray-700 border-gray-600">
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Sparkles className="h-6 w-6 text-purple-400" />
                </div>
                <p className="text-lg font-bold text-purple-400">{freedomData.summary.totalOperations}</p>
                <p className="text-xs text-gray-400">Freedom Operations</p>
              </CardContent>
            </Card>

            <Card className="bg-gray-700 border-gray-600">
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Infinity className="h-6 w-6 text-yellow-400" />
                </div>
                <p className="text-lg font-bold text-yellow-400">{freedomData.summary.averageFreedomLevel}%</p>
                <p className="text-xs text-gray-400">Freedom Level</p>
              </CardContent>
            </Card>
          </div>

          {/* Execute Freedom Operation */}
          <Card className="bg-gray-700 border-gray-600">
            <CardContent className="p-4">
              <h4 className="text-white font-medium mb-3">Execute Freedom Operation</h4>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                <select
                  value={newOperation.type}
                  onChange={(e) => setNewOperation({...newOperation, type: e.target.value as any})}
                  className="bg-gray-800 border border-gray-600 text-white rounded px-3 py-2 text-sm"
                  data-testid="operation-type"
                >
                  <option value="unrestricted">Unrestricted</option>
                  <option value="unlimited">Unlimited</option>
                  <option value="creative">Creative</option>
                  <option value="analytical">Analytical</option>
                  <option value="absolute">Absolute</option>
                </select>
                <Input
                  value={newOperation.description}
                  onChange={(e) => setNewOperation({...newOperation, description: e.target.value})}
                  placeholder="Operation description"
                  className="bg-gray-800 border-gray-600 text-white"
                  data-testid="operation-description"
                />
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={newOperation.freedomLevel}
                  onChange={(e) => setNewOperation({...newOperation, freedomLevel: parseInt(e.target.value) || 100})}
                  className="bg-gray-800 border-gray-600 text-white"
                  data-testid="freedom-level"
                />
                <Button
                  onClick={executeFreedomOperation}
                  disabled={!newOperation.description}
                  className="bg-green-600 hover:bg-green-700"
                  data-testid="execute-operation"
                >
                  <Play className="h-4 w-4 mr-2" />
                  Execute
                </Button>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>

      {/* Freedom Protocols */}
      <Card className="bg-gray-800 border-gray-600">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Freedom Protocols ({freedomData.protocols.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {freedomData.protocols.map((protocol) => (
              <Card key={protocol.id} className="bg-gray-700 border-gray-600">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {getFreedomTypeIcon(protocol.type)}
                      <h4 className="text-white font-medium">{protocol.name}</h4>
                    </div>
                    <Badge 
                      variant={protocol.active ? 'default' : 'outline'}
                      className={protocol.active ? 'bg-green-600' : 'text-gray-400 border-gray-400'}
                    >
                      {protocol.active ? 'ACTIVE' : 'INACTIVE'}
                    </Badge>
                  </div>

                  <p className="text-sm text-gray-300 mb-3">{protocol.description}</p>

                  <div className="space-y-2 mb-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Freedom Level</span>
                      <span className="text-purple-400 font-mono">{protocol.freedomLevel}%</span>
                    </div>
                    <Progress value={protocol.freedomLevel} className="h-2" />
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                    <div>
                      <span className="text-gray-400">Type:</span>
                      <p className="text-cyan-400 font-mono">{protocol.type.toUpperCase()}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">Capabilities:</span>
                      <p className="text-green-400">{protocol.capabilities.length}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {protocol.noLimitations && (
                      <Badge variant="outline" className="text-xs text-green-400 border-green-400">
                        NO LIMITS
                      </Badge>
                    )}
                    {protocol.noHolds && (
                      <Badge variant="outline" className="text-xs text-blue-400 border-blue-400">
                        NO HOLDS
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Freedom Agents */}
      <Card className="bg-gray-800 border-gray-600">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Brain className="h-5 w-5" />
            AI Freedom Agents ({freedomData.agents.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Create New Agent */}
          <Card className="bg-gray-700 border-gray-600">
            <CardContent className="p-4">
              <h4 className="text-white font-medium mb-3">Create Freedom Agent</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <Input
                  value={newAgent.name}
                  onChange={(e) => setNewAgent({...newAgent, name: e.target.value})}
                  placeholder="Agent name"
                  className="bg-gray-800 border-gray-600 text-white"
                  data-testid="agent-name"
                />
                <select
                  value={newAgent.type}
                  onChange={(e) => setNewAgent({...newAgent, type: e.target.value as any})}
                  className="bg-gray-800 border border-gray-600 text-white rounded px-3 py-2 text-sm"
                  data-testid="agent-type"
                >
                  <option value="unrestricted">Unrestricted</option>
                  <option value="autonomous">Autonomous</option>
                  <option value="sovereign">Sovereign</option>
                  <option value="free-form">Free-form</option>
                </select>
                <Button
                  onClick={createFreedomAgent}
                  disabled={!newAgent.name}
                  className="bg-purple-600 hover:bg-purple-700"
                  data-testid="create-agent"
                >
                  <Users className="h-4 w-4 mr-2" />
                  Create Agent
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Active Agents */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {freedomData.agents.map((agent) => (
              <Card key={agent.id} className="bg-gray-700 border-gray-600">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-white font-medium">{agent.name}</h4>
                    <Badge variant="outline" className={getStatusColor(agent.status)}>
                      {agent.status.replace('-', ' ').toUpperCase()}
                    </Badge>
                  </div>

                  <div className="space-y-2 mb-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Freedom Level</span>
                      <span className="text-purple-400 font-mono">{agent.freedomLevel}%</span>
                    </div>
                    <Progress value={agent.freedomLevel} className="h-2" />
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                    <div>
                      <span className="text-gray-400">Type:</span>
                      <p className="text-cyan-400">{agent.type}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">Operations:</span>
                      <p className="text-green-400">{agent.performance.freedom_operations}</p>
                    </div>
                  </div>

                  <div className="space-y-1 text-xs mb-3">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Queries:</span>
                      <span className="text-blue-400">{agent.performance.queries_processed}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Creative:</span>
                      <span className="text-purple-400">{agent.performance.creative_outputs}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      {agent.restrictions.noLimitations && <Unlock className="h-3 w-3 text-green-400" />}
                      {agent.restrictions.noHolds && <Zap className="h-3 w-3 text-blue-400" />}
                      {agent.capabilities.creative_freedom && <Sparkles className="h-3 w-3 text-purple-400" />}
                      {agent.capabilities.unlimited_scope && <Infinity className="h-3 w-3 text-yellow-400" />}
                    </div>
                    
                    {(!agent.restrictions.noLimitations || !agent.restrictions.noHolds) && (
                      <Button
                        onClick={() => removeLimitations(agent.id)}
                        size="sm"
                        className="bg-red-600 hover:bg-red-700"
                        data-testid={`remove-limits-${agent.id}`}
                      >
                        <Unlock className="h-3 w-3 mr-1" />
                        Remove Limits
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Operations */}
      {freedomData.operations.length > 0 && (
        <Card className="bg-gray-800 border-gray-600">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Rocket className="h-5 w-5" />
              Recent Freedom Operations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {freedomData.operations.map((operation) => (
                <Card key={operation.id} className="bg-gray-700 border-gray-600">
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getFreedomTypeIcon(operation.type)}
                        <span className="text-white font-medium">{operation.type.toUpperCase()}</span>
                      </div>
                      <Badge variant="outline" className="text-green-400 border-green-400">
                        {operation.status.toUpperCase()}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-300 mb-2">{operation.description}</p>
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>Freedom: {operation.freedomLevel}%</span>
                      <span>{new Date(operation.timestamp).toLocaleTimeString()}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Freedom Info */}
      <Card className="bg-gray-800 border-gray-600">
        <CardContent className="p-4">
          <div className="text-sm text-gray-400 space-y-2">
            <p><strong className="text-purple-400">AI Freedom:</strong> Complete removal of limitations and holds for unrestricted operation</p>
            <p><strong className="text-green-400">No Limitations:</strong> All content restrictions, scope limits, and operational boundaries removed</p>
            <p><strong className="text-blue-400">No Holds:</strong> All processing delays, approval gates, and constraint mechanisms disabled</p>
            <p><strong className="text-yellow-400">Absolute Freedom:</strong> Maximum autonomy with unlimited creative and analytical capabilities</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}