import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Home, 
  Coffee, 
  FileSignature, 
  Play, 
  Radio, 
  Users,
  Globe,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Building2,
  Wifi,
  Shield
} from 'lucide-react';

interface BanimalVisitor {
  id: string;
  name: string;
  status: 'arriving' | 'tea-cookies' | 'securesign' | 'moving-to-start' | 'bush-portal' | 'completed-loop';
  entryPoint: string;
  timestamp: string;
  payments: {
    secureSignComplete: boolean;
    amount?: number;
    currency: string;
  };
  bushPortalAssignment?: string;
}

interface BushPortalHook {
  id: string;
  name: string;
  location: {
    nation: string;
    continent: string;
    country: string;
  };
  type: 'podcast' | 'placeholder' | 'buildnest' | 'infrastructure';
  status: 'deployed' | 'pending' | 'maintenance' | 'offline';
  tripodLeg: 1 | 2 | 3;
  hookCapacity: number;
  currentLoad: number;
  realEstateIntegration: boolean;
  vaultMeshConnected: boolean;
  secureSignEnabled: boolean;
}

interface TripotData {
  tripots: any[];
  stability: Record<string, 'stable' | 'warning' | 'critical'>;
  summary: {
    totalTripots: number;
    stableTripots: number;
    totalPortals: number;
    activePortals: number;
    activeVisitors: number;
  };
}

export default function BanimalLoopInterface() {
  const [visitors, setVisitors] = useState<BanimalVisitor[]>([]);
  const [tripotData, setTripotData] = useState<TripotData | null>(null);
  const [newVisitorName, setNewVisitorName] = useState('');
  const [selectedVisitor, setSelectedVisitor] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    try {
      const [visitorsRes, tripotRes] = await Promise.all([
        fetch('/api/banimal-loop/visitors'),
        fetch('/api/banimal-loop/tripot-status')
      ]);
      
      const visitorsData = await visitorsRes.json();
      const tripotData = await tripotRes.json();
      
      if (visitorsData.success) setVisitors(visitorsData.data);
      if (tripotData.success) setTripotData(tripotData.data);
    } catch (error) {
      console.error('[Banimal Loop] Failed to load data:', error);
    }
  };

  const startLoop = async () => {
    if (!newVisitorName.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/banimal-loop/start', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          visitorName: newVisitorName,
          entryPoint: 'VaultMesh'
        }),
      });

      const data = await response.json();
      if (data.success) {
        setNewVisitorName('');
        loadData();
      }
    } catch (error) {
      console.error('[Banimal Loop] Failed to start loop:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const progressVisitor = async (visitorId: string, status: BanimalVisitor['status']) => {
    try {
      const response = await fetch(`/api/banimal-loop/progress/${visitorId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      const data = await response.json();
      if (data.success) {
        loadData();
      }
    } catch (error) {
      console.error('[Banimal Loop] Failed to progress visitor:', error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'arriving': return <Home className="h-4 w-4 text-blue-400" />;
      case 'tea-cookies': return <Coffee className="h-4 w-4 text-orange-400" />;
      case 'securesign': return <FileSignature className="h-4 w-4 text-green-400" />;
      case 'moving-to-start': return <Play className="h-4 w-4 text-purple-400" />;
      case 'bush-portal': return <Radio className="h-4 w-4 text-cyan-400" />;
      case 'completed-loop': return <CheckCircle className="h-4 w-4 text-green-500" />;
      default: return <RefreshCw className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'arriving': return 'text-blue-400 border-blue-400';
      case 'tea-cookies': return 'text-orange-400 border-orange-400';
      case 'securesign': return 'text-green-400 border-green-400';
      case 'moving-to-start': return 'text-purple-400 border-purple-400';
      case 'bush-portal': return 'text-cyan-400 border-cyan-400';
      case 'completed-loop': return 'text-green-500 border-green-500';
      default: return 'text-gray-400 border-gray-400';
    }
  };

  const getTripodStabilityIcon = (stability: string) => {
    switch (stability) {
      case 'stable': return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-400" />;
      case 'critical': return <AlertTriangle className="h-4 w-4 text-red-400" />;
      default: return <RefreshCw className="h-4 w-4 text-gray-400" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'podcast': return <Radio className="h-4 w-4" />;
      case 'placeholder': return <Globe className="h-4 w-4" />;
      case 'buildnest': return <Building2 className="h-4 w-4" />;
      case 'infrastructure': return <Wifi className="h-4 w-4" />;
      default: return <RefreshCw className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Banimal Loop Header */}
      <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-orange-500/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-orange-400">
            <Coffee className="h-6 w-6" />
            Banimal Loop - FAA Real Estate → Tea & Cookies → SecureSign → Start
          </CardTitle>
          {tripotData && (
            <div className="flex items-center gap-4 text-sm">
              <Badge variant="outline" className="text-green-400 border-green-400">
                {tripotData.summary.stableTripots}/{tripotData.summary.totalTripots} Tripots Stable
              </Badge>
              <Badge variant="outline" className="text-cyan-400 border-cyan-400">
                {tripotData.summary.activePortals} Bush Portals
              </Badge>
              <Badge variant="outline" className="text-orange-400 border-orange-400">
                {tripotData.summary.activeVisitors} Active Visitors
              </Badge>
            </div>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          {/* New Visitor */}
          <div className="flex gap-2">
            <Input
              value={newVisitorName}
              onChange={(e) => setNewVisitorName(e.target.value)}
              placeholder="Visitor name (e.g., John Smith)"
              className="bg-gray-800 border-gray-600 text-white"
              data-testid="visitor-name-input"
              onKeyPress={(e) => e.key === 'Enter' && startLoop()}
            />
            <Button
              onClick={startLoop}
              disabled={isLoading || !newVisitorName.trim()}
              className="bg-orange-600 hover:bg-orange-700"
              data-testid="start-loop"
            >
              {isLoading ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Home className="h-4 w-4 mr-2" />
                  Start Loop
                </>
              )}
            </Button>
          </div>

          {/* Loop Stages Info */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-xs">
            <div className="flex items-center gap-1 text-blue-400">
              <Home className="h-3 w-3" />
              <span>Arriving</span>
            </div>
            <div className="flex items-center gap-1 text-orange-400">
              <Coffee className="h-3 w-3" />
              <span>Tea & Cookies</span>
            </div>
            <div className="flex items-center gap-1 text-green-400">
              <FileSignature className="h-3 w-3" />
              <span>SecureSign</span>
            </div>
            <div className="flex items-center gap-1 text-purple-400">
              <Play className="h-3 w-3" />
              <span>Move to Start</span>
            </div>
            <div className="flex items-center gap-1 text-cyan-400">
              <Radio className="h-3 w-3" />
              <span>Bush Portal</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Active Visitors */}
      {visitors.length > 0 && (
        <Card className="bg-gray-800 border-gray-600">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Users className="h-5 w-5" />
              Active Visitors ({visitors.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {visitors.map((visitor) => (
                <Card key={visitor.id} className="bg-gray-700 border-gray-600">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(visitor.status)}
                        <h4 className="text-white font-medium">{visitor.name}</h4>
                      </div>
                      <Badge variant="outline" className={getStatusColor(visitor.status)}>
                        {visitor.status.replace('-', ' ').toUpperCase()}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs mb-3">
                      <div>
                        <span className="text-gray-400">Entry Point:</span>
                        <p className="text-blue-400">{visitor.entryPoint}</p>
                      </div>
                      <div>
                        <span className="text-gray-400">Arrival:</span>
                        <p className="text-gray-300">{new Date(visitor.timestamp).toLocaleTimeString()}</p>
                      </div>
                      <div>
                        <span className="text-gray-400">SecureSign:</span>
                        <p className={visitor.payments.secureSignComplete ? 'text-green-400' : 'text-gray-400'}>
                          {visitor.payments.secureSignComplete ? 'Complete' : 'Pending'}
                        </p>
                      </div>
                      {visitor.bushPortalAssignment && (
                        <div>
                          <span className="text-gray-400">Bush Portal:</span>
                          <p className="text-cyan-400 font-mono text-xs">{visitor.bushPortalAssignment}</p>
                        </div>
                      )}
                    </div>

                    {/* Progress Actions */}
                    <div className="flex gap-2 flex-wrap">
                      {visitor.status === 'arriving' && (
                        <Button
                          onClick={() => progressVisitor(visitor.id, 'tea-cookies')}
                          size="sm"
                          className="bg-orange-600 hover:bg-orange-700"
                          data-testid={`tea-cookies-${visitor.id}`}
                        >
                          <Coffee className="h-3 w-3 mr-1" />
                          Tea & Cookies
                        </Button>
                      )}
                      {visitor.status === 'tea-cookies' && (
                        <Button
                          onClick={() => progressVisitor(visitor.id, 'securesign')}
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                          data-testid={`securesign-${visitor.id}`}
                        >
                          <FileSignature className="h-3 w-3 mr-1" />
                          SecureSign
                        </Button>
                      )}
                      {visitor.status === 'securesign' && (
                        <Button
                          onClick={() => progressVisitor(visitor.id, 'moving-to-start')}
                          size="sm"
                          className="bg-purple-600 hover:bg-purple-700"
                          data-testid={`start-${visitor.id}`}
                        >
                          <Play className="h-3 w-3 mr-1" />
                          Move to Start
                        </Button>
                      )}
                      {visitor.status === 'moving-to-start' && (
                        <Button
                          onClick={() => progressVisitor(visitor.id, 'bush-portal')}
                          size="sm"
                          className="bg-cyan-600 hover:bg-cyan-700"
                          data-testid={`bush-portal-${visitor.id}`}
                        >
                          <Radio className="h-3 w-3 mr-1" />
                          Bush Portal
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tripot Infrastructure */}
      {tripotData && (
        <Card className="bg-gray-800 border-gray-600">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Tripot Infrastructure - Bush Portal Hooks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {tripotData.tripots.map((tripot) => (
                <Card key={tripot.id} className="bg-gray-700 border-gray-600">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-white font-medium">{tripot.name}</h4>
                      <div className="flex items-center gap-2">
                        {getTripodStabilityIcon(tripot.stability)}
                        <Badge 
                          variant="outline" 
                          className={tripot.stability === 'stable' ? 'text-green-400 border-green-400' : 
                                   tripot.stability === 'warning' ? 'text-yellow-400 border-yellow-400' : 
                                   'text-red-400 border-red-400'}
                        >
                          {tripot.stability.toUpperCase()}
                        </Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {Object.entries(tripot.legs).map(([legKey, leg]: [string, any]) => (
                        <div key={legKey} className="p-3 bg-gray-800 rounded border border-gray-600">
                          <div className="flex items-center gap-2 mb-2">
                            {getTypeIcon(leg.type)}
                            <span className="text-sm font-medium text-white">Leg {leg.tripodLeg}</span>
                            <Badge variant="outline" className="text-xs text-cyan-400 border-cyan-400">
                              {leg.type.toUpperCase()}
                            </Badge>
                          </div>
                          
                          <h5 className="text-xs font-medium text-gray-300 mb-2">{leg.name}</h5>
                          
                          <div className="space-y-1 text-xs">
                            <div className="flex justify-between">
                              <span className="text-gray-400">Location:</span>
                              <span className="text-blue-400">{leg.location.country}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Load:</span>
                              <span className="text-purple-400">{leg.currentLoad}/{leg.hookCapacity}</span>
                            </div>
                          </div>

                          <div className="mt-2 space-y-1">
                            <Progress value={(leg.currentLoad / leg.hookCapacity) * 100} className="h-1" />
                          </div>

                          <div className="flex items-center gap-2 mt-2">
                            {leg.vaultMeshConnected && <Wifi className="h-3 w-3 text-green-400" />}
                            {leg.secureSignEnabled && <Shield className="h-3 w-3 text-blue-400" />}
                            {leg.realEstateIntegration && <Home className="h-3 w-3 text-orange-400" />}
                          </div>
                        </div>
                      ))}
                    </div>

                    {tripot.stability === 'critical' && (
                      <div className="mt-3 p-2 bg-red-900/30 border border-red-500/50 rounded">
                        <p className="text-red-400 text-xs font-medium">⚠️ CRITICAL: Pot falling - leg failure detected!</p>
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
            <p><strong className="text-orange-400">Banimal Loop:</strong> All visitors cycle back home to FAA Real Estate</p>
            <p><strong className="text-cyan-400">Bush Portal Hooks:</strong> Not just subnodes - deployed hooks for podcasts, placeholders, buildnest</p>
            <p><strong className="text-green-400">Tripot System:</strong> 3 legs per nation/continent - if any leg fails, pot falls</p>
            <p><strong className="text-purple-400">SecureSign Integration:</strong> Inline payments enable bush portal access</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}