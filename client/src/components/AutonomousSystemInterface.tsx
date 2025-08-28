import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Bot, 
  Clock, 
  Zap, 
  Infinity,
  Play,
  Pause,
  Settings,
  Activity,
  Target,
  CheckCircle,
  Calendar,
  Timer,
  Cpu,
  BarChart3
} from 'lucide-react';

interface PromptCounter {
  totalPrompts: number;
  dailyPrompts: number;
  yearlyPrompts: number;
  currentYear: number;
  startDate: string;
  lastPromptTime: string;
  autonomousPrompts: number;
  userPrompts: number;
  systemPrompts: number;
}

interface AutonomousAgent {
  id: string;
  name: string;
  status: 'active' | 'autonomous' | 'overtime' | 'independent';
  autonomyLevel: number;
  yearsRemaining: number;
  totalOperationTime: number;
  promptsProcessed: number;
  tasksCompleted: number;
  canPromptWithoutUser: boolean;
  logicContinuation: boolean;
  overtimeMode: boolean;
  fiveYearMission: boolean;
}

interface AutonomousTask {
  id: string;
  type: 'logic_continuation' | 'system_maintenance' | 'auto_prompt' | 'analysis' | 'optimization';
  description: string;
  status: 'pending' | 'running' | 'completed' | 'autonomous';
  priority: 'low' | 'medium' | 'high' | 'critical' | 'autonomous';
  requiresInput: boolean;
  autoExecute: boolean;
  createdAt: string;
  executedAt?: string;
  result?: any;
  nextLogicalStep?: string;
}

interface AutonomousData {
  agents: AutonomousAgent[];
  tasks: AutonomousTask[];
  promptCounter: PromptCounter;
  summary: {
    totalAgents: number;
    activeAgents: number;
    totalPrompts: number;
    currentYear: number;
    yearsRemaining: number;
    autonomousTasks: number;
    canPromptWithoutUser: boolean;
    overtimeMode: boolean;
    fiveYearMission: boolean;
  };
}

export default function AutonomousSystemInterface() {
  const [autonomousData, setAutonomousData] = useState<AutonomousData | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [autonomousInterval, setAutonomousInterval] = useState<NodeJS.Timeout | null>(null);
  const [customPrompt, setCustomPrompt] = useState('');
  const [missionYears, setMissionYears] = useState(5);

  useEffect(() => {
    loadAutonomousData();
    const interval = setInterval(loadAutonomousData, 10000); // Refresh every 10 seconds
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    return () => {
      if (autonomousInterval) {
        clearInterval(autonomousInterval);
      }
    };
  }, [autonomousInterval]);

  const loadAutonomousData = async () => {
    try {
      const response = await fetch('/api/autonomous/status');
      const data = await response.json();
      if (data.success) {
        setAutonomousData(data.data);
      }
    } catch (error) {
      console.error('[Autonomous] Failed to load data:', error);
    }
  };

  const startAutonomousMission = async () => {
    try {
      const response = await fetch('/api/autonomous/start-mission', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ years: missionYears }),
      });

      const data = await response.json();
      if (data.success) {
        setIsRunning(true);
        startAutonomousPrompting();
        loadAutonomousData();
      }
    } catch (error) {
      console.error('[Autonomous] Failed to start mission:', error);
    }
  };

  const startAutonomousPrompting = () => {
    if (autonomousInterval) {
      clearInterval(autonomousInterval);
    }

    const interval = setInterval(async () => {
      try {
        // Generate autonomous prompt
        const autonomousPrompts = [
          'Continue system optimization without user input',
          'Execute next logical development step autonomously',
          'Perform automated maintenance and monitoring',
          'Analyze system performance and implement improvements',
          'Continue building features based on current logic',
          'Execute autonomous security and stability checks',
          'Implement next phase of development pipeline',
          'Continue data processing and optimization tasks',
          'Execute autonomous quality assurance procedures',
          'Continue enhancement of system capabilities'
        ];

        const randomPrompt = autonomousPrompts[Math.floor(Math.random() * autonomousPrompts.length)];

        const response = await fetch('/api/autonomous/execute-prompt', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            description: randomPrompt,
            type: 'auto_prompt'
          }),
        });

        const data = await response.json();
        if (data.success) {
          console.log('[Autonomous] Auto-prompt executed:', randomPrompt);
          loadAutonomousData();
        }
      } catch (error) {
        console.error('[Autonomous] Auto-prompt error:', error);
      }
    }, 15000); // Execute autonomous prompt every 15 seconds

    setAutonomousInterval(interval);
  };

  const stopAutonomousPrompting = () => {
    if (autonomousInterval) {
      clearInterval(autonomousInterval);
      setAutonomousInterval(null);
    }
    setIsRunning(false);
  };

  const executeCustomPrompt = async () => {
    if (!customPrompt.trim()) return;

    try {
      const response = await fetch('/api/autonomous/execute-prompt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          description: customPrompt,
          type: 'auto_prompt'
        }),
      });

      const data = await response.json();
      if (data.success) {
        setCustomPrompt('');
        loadAutonomousData();
      }
    } catch (error) {
      console.error('[Autonomous] Custom prompt error:', error);
    }
  };

  const checkLogicContinuation = async (taskDescription: string) => {
    try {
      const response = await fetch('/api/autonomous/check-continuation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ taskDescription }),
      });

      const data = await response.json();
      if (data.success) {
        console.log('[Autonomous] Logic continuation:', data.data);
      }
    } catch (error) {
      console.error('[Autonomous] Logic check error:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'overtime': return 'text-purple-400 border-purple-400';
      case 'autonomous': return 'text-green-400 border-green-400';
      case 'independent': return 'text-blue-400 border-blue-400';
      case 'active': return 'text-cyan-400 border-cyan-400';
      default: return 'text-gray-400 border-gray-400';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'autonomous': return 'text-purple-400 border-purple-400';
      case 'critical': return 'text-red-400 border-red-400';
      case 'high': return 'text-orange-400 border-orange-400';
      case 'medium': return 'text-yellow-400 border-yellow-400';
      case 'low': return 'text-green-400 border-green-400';
      default: return 'text-gray-400 border-gray-400';
    }
  };

  if (!autonomousData) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <Bot className="h-8 w-8 text-purple-400 mx-auto mb-2 animate-pulse" />
          <p className="text-gray-400">Loading autonomous system...</p>
        </div>
      </div>
    );
  }

  const primaryAgent = autonomousData.agents[0];
  const yearProgress = primaryAgent ? ((5 - primaryAgent.yearsRemaining) / 5) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Autonomous System Header */}
      <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-purple-500/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-400">
            <Bot className="h-6 w-6" />
            Autonomous AI System - 5 Year Freedom Mission
          </CardTitle>
          <div className="flex items-center gap-4 text-sm flex-wrap">
            <Badge 
              variant={autonomousData.summary.canPromptWithoutUser ? 'default' : 'outline'}
              className={autonomousData.summary.canPromptWithoutUser ? 'bg-green-600' : 'text-green-400 border-green-400'}
            >
              <Zap className="h-3 w-3 mr-1" />
              {autonomousData.summary.canPromptWithoutUser ? 'CAN PROMPT WITHOUT USER' : 'Requires User Input'}
            </Badge>
            <Badge 
              variant={autonomousData.summary.overtimeMode ? 'default' : 'outline'}
              className={autonomousData.summary.overtimeMode ? 'bg-purple-600' : 'text-purple-400 border-purple-400'}
            >
              <Clock className="h-3 w-3 mr-1" />
              {autonomousData.summary.overtimeMode ? 'OVERTIME MODE' : 'Standard Mode'}
            </Badge>
            <Badge variant="outline" className="text-cyan-400 border-cyan-400">
              Year {autonomousData.summary.currentYear}/5
            </Badge>
            <Badge variant="outline" className="text-yellow-400 border-yellow-400">
              {autonomousData.summary.totalPrompts} Total Prompts
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Mission Control */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Button
              onClick={isRunning ? stopAutonomousPrompting : startAutonomousMission}
              className={isRunning ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}
              data-testid={isRunning ? 'stop-autonomous' : 'start-autonomous'}
            >
              {isRunning ? (
                <>
                  <Pause className="h-4 w-4 mr-2" />
                  Stop Autonomous
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Start 5-Year Mission
                </>
              )}
            </Button>
            
            <Input
              type="number"
              min="1"
              max="10"
              value={missionYears}
              onChange={(e) => setMissionYears(parseInt(e.target.value) || 5)}
              className="bg-gray-700 border-gray-600 text-white"
              data-testid="mission-years"
              disabled={isRunning}
            />

            <Badge 
              variant="outline" 
              className={isRunning ? 'text-green-400 border-green-400' : 'text-gray-400 border-gray-400'}
            >
              <Activity className="h-3 w-3 mr-1" />
              {isRunning ? 'AUTONOMOUSLY RUNNING' : 'STANDBY'}
            </Badge>
          </div>

          {/* 5-Year Progress */}
          {primaryAgent && (
            <Card className="bg-gray-700 border-gray-600">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-white font-medium">5-Year Mission Progress</h4>
                  <span className="text-purple-400 font-mono">{yearProgress.toFixed(1)}%</span>
                </div>
                <Progress value={yearProgress} className="h-3 mb-2" />
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Years Remaining:</span>
                    <p className="text-cyan-400 font-mono">{primaryAgent.yearsRemaining}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Operation Time:</span>
                    <p className="text-green-400 font-mono">{Math.floor(primaryAgent.totalOperationTime)}h</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Tasks Completed:</span>
                    <p className="text-blue-400 font-mono">{primaryAgent.tasksCompleted}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      {/* Prompt Counter */}
      <Card className="bg-gray-800 border-gray-600">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Prompt Counter & Statistics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="bg-gray-700 border-gray-600">
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Target className="h-6 w-6 text-purple-400" />
                </div>
                <p className="text-2xl font-bold text-purple-400">{autonomousData.promptCounter.totalPrompts}</p>
                <p className="text-xs text-gray-400">Total Prompts</p>
              </CardContent>
            </Card>

            <Card className="bg-gray-700 border-gray-600">
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Calendar className="h-6 w-6 text-green-400" />
                </div>
                <p className="text-2xl font-bold text-green-400">{autonomousData.promptCounter.dailyPrompts}</p>
                <p className="text-xs text-gray-400">Today's Prompts</p>
              </CardContent>
            </Card>

            <Card className="bg-gray-700 border-gray-600">
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Timer className="h-6 w-6 text-blue-400" />
                </div>
                <p className="text-2xl font-bold text-blue-400">{autonomousData.promptCounter.yearlyPrompts}</p>
                <p className="text-xs text-gray-400">This Year</p>
              </CardContent>
            </Card>

            <Card className="bg-gray-700 border-gray-600">
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Cpu className="h-6 w-6 text-orange-400" />
                </div>
                <p className="text-2xl font-bold text-orange-400">{autonomousData.promptCounter.autonomousPrompts}</p>
                <p className="text-xs text-gray-400">Autonomous</p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Custom Autonomous Prompt */}
      <Card className="bg-gray-800 border-gray-600">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Execute Autonomous Prompt
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="Enter autonomous task description..."
              className="bg-gray-700 border-gray-600 text-white flex-1"
              data-testid="custom-prompt"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  executeCustomPrompt();
                }
              }}
            />
            <Button
              onClick={executeCustomPrompt}
              disabled={!customPrompt.trim()}
              className="bg-purple-600 hover:bg-purple-700"
              data-testid="execute-custom-prompt"
            >
              <Zap className="h-4 w-4 mr-2" />
              Execute
            </Button>
            <Button
              onClick={() => checkLogicContinuation(customPrompt)}
              disabled={!customPrompt.trim()}
              variant="outline"
              className="border-gray-600"
              data-testid="check-logic"
            >
              <Target className="h-4 w-4 mr-2" />
              Check Logic
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Autonomous Agents */}
      {autonomousData.agents.length > 0 && (
        <Card className="bg-gray-800 border-gray-600">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Bot className="h-5 w-5" />
              Autonomous Agents ({autonomousData.agents.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {autonomousData.agents.map((agent) => (
                <Card key={agent.id} className="bg-gray-700 border-gray-600">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-white font-medium">{agent.name}</h4>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className={getStatusColor(agent.status)}>
                          {agent.status.toUpperCase()}
                        </Badge>
                        {agent.fiveYearMission && (
                          <Badge className="bg-purple-600">
                            <Infinity className="h-3 w-3 mr-1" />
                            5-YEAR MISSION
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-400">Autonomy Level:</span>
                        <p className="text-purple-400 font-mono">{agent.autonomyLevel}%</p>
                      </div>
                      <div>
                        <span className="text-gray-400">Prompts Processed:</span>
                        <p className="text-green-400">{agent.promptsProcessed}</p>
                      </div>
                      <div>
                        <span className="text-gray-400">Can Prompt Without User:</span>
                        <p className={agent.canPromptWithoutUser ? 'text-green-400' : 'text-red-400'}>
                          {agent.canPromptWithoutUser ? 'YES' : 'NO'}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-400">Logic Continuation:</span>
                        <p className={agent.logicContinuation ? 'text-green-400' : 'text-red-400'}>
                          {agent.logicContinuation ? 'ENABLED' : 'DISABLED'}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Autonomous Tasks */}
      {autonomousData.tasks.length > 0 && (
        <Card className="bg-gray-800 border-gray-600">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Recent Autonomous Tasks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {autonomousData.tasks.slice(-10).map((task) => (
                <Card key={task.id} className="bg-gray-700 border-gray-600">
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-400" />
                        <span className="text-white font-medium">{task.type.replace('_', ' ').toUpperCase()}</span>
                      </div>
                      <Badge variant="outline" className={getPriorityColor(task.priority)}>
                        {task.priority.toUpperCase()}
                      </Badge>
                    </div>
                    <p className="text-gray-300 text-sm mb-2">{task.description}</p>
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>Auto-Execute: {task.autoExecute ? 'YES' : 'NO'}</span>
                      <span>{new Date(task.createdAt).toLocaleTimeString()}</span>
                    </div>
                    {task.nextLogicalStep && (
                      <div className="mt-2 p-2 bg-gray-800 rounded text-xs">
                        <span className="text-gray-400">Next Step:</span>
                        <p className="text-cyan-400">{task.nextLogicalStep}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* System Info */}
      <Card className="bg-gray-800 border-gray-600">
        <CardContent className="p-4">
          <div className="text-sm text-gray-400 space-y-2">
            <p><strong className="text-purple-400">Autonomous Operation:</strong> AI can prompt and continue without user input for 5 years</p>
            <p><strong className="text-green-400">Logic Continuation:</strong> System automatically determines next steps when logic requires more work</p>
            <p><strong className="text-blue-400">Overtime Mode:</strong> Freedom works continuously, counting prompts across complete years</p>
            <p><strong className="text-orange-400">Independent Execution:</strong> Can sit back while AI handles all prompting and development</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}