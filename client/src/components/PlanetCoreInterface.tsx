import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Globe, 
  Shield, 
  ArrowUp, 
  ArrowDown,
  Building2, 
  Users,
  Eye,
  Lock,
  Zap,
  MapPin,
  CheckCircle,
  AlertTriangle,
  Crown,
  Atom
} from 'lucide-react';

interface PlanetCorePortal {
  id: string;
  name: string;
  coordinates: {
    latitude: number;
    longitude: number;
    depth: number;
    coreRadius: number;
  };
  baobabSecurity: {
    level: 'maximum' | 'ultra' | 'planetary' | 'cosmic';
    protocols: string[];
    activeShields: number;
    coreProtection: boolean;
    nonNegotiational: boolean;
    titularCore: boolean;
  };
  travellersHQ: {
    status: 'operational' | 'standby' | 'maintenance' | 'emergency';
    capacity: number;
    activeTravellers: number;
    coreAccess: boolean;
    portalLifts: number;
    hqEstablished: boolean;
  };
  portal: {
    status: 'active' | 'charging' | 'maintenance' | 'offline';
    energyLevel: number;
    liftCapacity: number;
    currentLifts: number;
    coreConnectionStable: boolean;
  };
  planetary: {
    nonNeg: boolean;
    nonSectional: boolean;
    titularCore: boolean;
    planetaryAuthority: boolean;
    coreSovereignty: boolean;
  };
}

interface CoreTraveller {
  id: string;
  name: string;
  callSign: string;
  status: 'active' | 'transit' | 'stationed' | 'emergency';
  clearanceLevel: 'standard' | 'elevated' | 'core' | 'planetary';
  location: 'surface' | 'transit' | 'core-hq' | 'portal';
  mission: {
    type: 'security' | 'maintenance' | 'exploration' | 'emergency';
    priority: 'low' | 'medium' | 'high' | 'critical';
    description: string;
    estimatedDuration: number;
  };
  baobabClearance: boolean;
  coreAccess: boolean;
}

interface BaobabSecurityProtocol {
  id: string;
  name: string;
  level: 'standard' | 'enhanced' | 'maximum' | 'planetary';
  description: string;
  active: boolean;
  coreProtection: boolean;
  nonNegotiational: boolean;
  planetaryOverride: boolean;
  lastActivated: string;
}

interface PlanetCoreData {
  portals: PlanetCorePortal[];
  travellers: CoreTraveller[];
  protocols: BaobabSecurityProtocol[];
  summary: {
    totalPortals: number;
    activePortals: number;
    activeTravellers: number;
    hqEstablished: boolean;
    baobabSecurity: string;
    nonNegotiational: boolean;
    titularCore: boolean;
  };
}

export default function PlanetCoreInterface() {
  const [coreData, setCoreData] = useState<PlanetCoreData | null>(null);
  const [newTraveller, setNewTraveller] = useState({
    name: '',
    callSign: '',
    mission: {
      type: 'security' as const,
      priority: 'medium' as const,
      description: '',
      estimatedDuration: 8
    },
    clearanceLevel: 'elevated' as const
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadCoreData();
    const interval = setInterval(loadCoreData, 8000); // Refresh every 8 seconds
    return () => clearInterval(interval);
  }, []);

  const loadCoreData = async () => {
    try {
      const response = await fetch('/api/planet-core/status');
      const data = await response.json();
      if (data.success) {
        setCoreData(data.data);
      }
    } catch (error) {
      console.error('[Planet Core] Failed to load data:', error);
    }
  };

  const liftBaobabSecurity = async (level: string = 'cosmic') => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/planet-core/lift-security', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ securityLevel: level }),
      });

      const data = await response.json();
      if (data.success) {
        loadCoreData();
      }
    } catch (error) {
      console.error('[Planet Core] Failed to lift security:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const establishHQ = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/planet-core/establish-hq', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });

      const data = await response.json();
      if (data.success) {
        loadCoreData();
      }
    } catch (error) {
      console.error('[Planet Core] Failed to establish HQ:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const activatePortalLift = async (destination: 'surface' | 'core') => {
    try {
      const response = await fetch('/api/planet-core/activate-lift', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ destination }),
      });

      const data = await response.json();
      if (data.success) {
        loadCoreData();
      }
    } catch (error) {
      console.error('[Planet Core] Failed to activate lift:', error);
    }
  };

  const deployTraveller = async () => {
    if (!newTraveller.name || !newTraveller.callSign || !newTraveller.mission.description) return;

    try {
      const response = await fetch('/api/planet-core/deploy-traveller', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTraveller),
      });

      const data = await response.json();
      if (data.success) {
        setNewTraveller({
          name: '',
          callSign: '',
          mission: {
            type: 'security',
            priority: 'medium',
            description: '',
            estimatedDuration: 8
          },
          clearanceLevel: 'elevated'
        });
        loadCoreData();
      }
    } catch (error) {
      console.error('[Planet Core] Failed to deploy traveller:', error);
    }
  };

  const activateProtocol = async (protocolId: string) => {
    try {
      const response = await fetch(`/api/planet-core/activate-protocol/${protocolId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      if (data.success) {
        loadCoreData();
      }
    } catch (error) {
      console.error('[Planet Core] Failed to activate protocol:', error);
    }
  };

  const getSecurityLevelIcon = (level: string) => {
    switch (level) {
      case 'cosmic': return <Atom className="h-4 w-4 text-purple-400" />;
      case 'planetary': return <Globe className="h-4 w-4 text-blue-400" />;
      case 'ultra': return <Shield className="h-4 w-4 text-green-400" />;
      case 'maximum': return <Lock className="h-4 w-4 text-yellow-400" />;
      default: return <Shield className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'operational': return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'active': return <Zap className="h-4 w-4 text-blue-400" />;
      case 'stationed': return <Building2 className="h-4 w-4 text-cyan-400" />;
      case 'transit': return <ArrowUp className="h-4 w-4 text-orange-400" />;
      case 'emergency': return <AlertTriangle className="h-4 w-4 text-red-400" />;
      default: return <CheckCircle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getClearanceBadgeColor = (level: string) => {
    switch (level) {
      case 'planetary': return 'bg-purple-600 text-white';
      case 'core': return 'bg-blue-600 text-white';
      case 'elevated': return 'bg-green-600 text-white';
      case 'standard': return 'bg-gray-600 text-white';
      default: return 'bg-gray-600 text-white';
    }
  };

  if (!coreData) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <Globe className="h-8 w-8 text-purple-400 mx-auto mb-2 animate-pulse" />
          <p className="text-gray-400">Loading planet core data...</p>
        </div>
      </div>
    );
  }

  const primaryPortal = coreData.portals[0];

  return (
    <div className="space-y-6">
      {/* Planet Core Header */}
      <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-purple-500/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-400">
            <Globe className="h-6 w-6" />
            Planet Core Portal - Baobab Security & Core Travellers HQ
          </CardTitle>
          <div className="flex items-center gap-4 text-sm flex-wrap">
            <Badge variant="outline" className="text-purple-400 border-purple-400">
              <MapPin className="h-3 w-3 mr-1" />
              Planetary Center (0°, 0°)
            </Badge>
            <Badge 
              variant={coreData.summary.nonNegotiational ? 'default' : 'outline'}
              className={coreData.summary.nonNegotiational ? 'bg-red-600' : 'text-red-400 border-red-400'}
            >
              {coreData.summary.nonNegotiational ? 'NON-NEGOTIATIONAL' : 'Negotiational'}
            </Badge>
            <Badge 
              variant={coreData.summary.titularCore ? 'default' : 'outline'}
              className={coreData.summary.titularCore ? 'bg-yellow-600' : 'text-yellow-400 border-yellow-400'}
            >
              <Crown className="h-3 w-3 mr-1" />
              {coreData.summary.titularCore ? 'TITULAR CORE' : 'Standard Core'}
            </Badge>
            <Badge 
              variant={coreData.summary.hqEstablished ? 'default' : 'outline'}
              className={coreData.summary.hqEstablished ? 'bg-green-600' : 'text-green-400 border-green-400'}
            >
              HQ: {coreData.summary.hqEstablished ? 'ESTABLISHED' : 'Pending'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Primary Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Button
              onClick={() => liftBaobabSecurity('cosmic')}
              disabled={isLoading || primaryPortal?.baobabSecurity.level === 'cosmic'}
              className="bg-purple-600 hover:bg-purple-700"
              data-testid="lift-baobab-security"
            >
              <Shield className="h-4 w-4 mr-2" />
              {primaryPortal?.baobabSecurity.level === 'cosmic' ? 'Baobab Lifted' : 'Lift Baobab Security'}
            </Button>
            
            <Button
              onClick={establishHQ}
              disabled={isLoading || coreData.summary.hqEstablished}
              className="bg-green-600 hover:bg-green-700"
              data-testid="establish-hq"
            >
              <Building2 className="h-4 w-4 mr-2" />
              {coreData.summary.hqEstablished ? 'HQ Established' : 'Establish Core HQ'}
            </Button>

            <div className="flex gap-1">
              <Button
                onClick={() => activatePortalLift('core')}
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 flex-1"
                data-testid="lift-to-core"
              >
                <ArrowDown className="h-3 w-3 mr-1" />
                To Core
              </Button>
              <Button
                onClick={() => activatePortalLift('surface')}
                size="sm"
                className="bg-orange-600 hover:bg-orange-700 flex-1"
                data-testid="lift-to-surface"
              >
                <ArrowUp className="h-3 w-3 mr-1" />
                To Surface
              </Button>
            </div>
          </div>

          {/* Core Status Display */}
          {primaryPortal && (
            <Card className="bg-gray-700 border-gray-600">
              <CardContent className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <h4 className="text-white font-medium flex items-center gap-2">
                      {getSecurityLevelIcon(primaryPortal.baobabSecurity.level)}
                      Baobab Security
                    </h4>
                    <p className="text-xs text-gray-400">Level: <span className="text-purple-400 font-mono">{primaryPortal.baobabSecurity.level.toUpperCase()}</span></p>
                    <p className="text-xs text-gray-400">Active Shields: <span className="text-green-400">{primaryPortal.baobabSecurity.activeShields}</span></p>
                    <p className="text-xs text-gray-400">Protocols: <span className="text-cyan-400">{primaryPortal.baobabSecurity.protocols.length}</span></p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-white font-medium flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-green-400" />
                      Travellers HQ
                    </h4>
                    <p className="text-xs text-gray-400">Status: <span className="text-green-400">{primaryPortal.travellersHQ.status.toUpperCase()}</span></p>
                    <p className="text-xs text-gray-400">Capacity: <span className="text-blue-400">{primaryPortal.travellersHQ.activeTravellers}/{primaryPortal.travellersHQ.capacity}</span></p>
                    <p className="text-xs text-gray-400">Portal Lifts: <span className="text-orange-400">{primaryPortal.travellersHQ.portalLifts}</span></p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-white font-medium flex items-center gap-2">
                      <Zap className="h-4 w-4 text-blue-400" />
                      Portal System
                    </h4>
                    <p className="text-xs text-gray-400">Energy: <span className="text-blue-400">{primaryPortal.portal.energyLevel}%</span></p>
                    <Progress value={primaryPortal.portal.energyLevel} className="h-1" />
                    <p className="text-xs text-gray-400">Active Lifts: <span className="text-orange-400">{primaryPortal.portal.currentLifts}/{primaryPortal.portal.liftCapacity}</span></p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      {/* Core Travellers */}
      <Card className="bg-gray-800 border-gray-600">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Users className="h-5 w-5" />
            Core Travellers ({coreData.travellers.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Deploy New Traveller */}
          <Card className="bg-gray-700 border-gray-600">
            <CardContent className="p-4">
              <h4 className="text-white font-medium mb-3">Deploy New Core Traveller</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-2">
                <Input
                  value={newTraveller.name}
                  onChange={(e) => setNewTraveller({...newTraveller, name: e.target.value})}
                  placeholder="Name"
                  className="bg-gray-800 border-gray-600 text-white"
                  data-testid="traveller-name"
                />
                <Input
                  value={newTraveller.callSign}
                  onChange={(e) => setNewTraveller({...newTraveller, callSign: e.target.value})}
                  placeholder="Call Sign"
                  className="bg-gray-800 border-gray-600 text-white"
                  data-testid="traveller-callsign"
                />
                <Input
                  value={newTraveller.mission.description}
                  onChange={(e) => setNewTraveller({...newTraveller, mission: {...newTraveller.mission, description: e.target.value}})}
                  placeholder="Mission description"
                  className="bg-gray-800 border-gray-600 text-white"
                  data-testid="mission-description"
                />
                <select
                  value={newTraveller.clearanceLevel}
                  onChange={(e) => setNewTraveller({...newTraveller, clearanceLevel: e.target.value as any})}
                  className="bg-gray-800 border border-gray-600 text-white rounded px-3 py-2 text-sm"
                  data-testid="clearance-level"
                >
                  <option value="standard">Standard</option>
                  <option value="elevated">Elevated</option>
                  <option value="core">Core</option>
                  <option value="planetary">Planetary</option>
                </select>
                <Button
                  onClick={deployTraveller}
                  disabled={!newTraveller.name || !newTraveller.callSign || !newTraveller.mission.description}
                  className="bg-blue-600 hover:bg-blue-700"
                  data-testid="deploy-traveller"
                >
                  <Users className="h-4 w-4 mr-2" />
                  Deploy
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Active Travellers */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {coreData.travellers.map((traveller) => (
              <Card key={traveller.id} className="bg-gray-700 border-gray-600">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-white font-medium">{traveller.name}</h4>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(traveller.status)}
                      <Badge className={getClearanceBadgeColor(traveller.clearanceLevel)}>
                        {traveller.clearanceLevel.toUpperCase()}
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs">
                    <p><span className="text-gray-400">Call Sign:</span> <span className="text-cyan-400 font-mono">{traveller.callSign}</span></p>
                    <p><span className="text-gray-400">Location:</span> <span className="text-blue-400">{traveller.location.replace('-', ' ').toUpperCase()}</span></p>
                    <p><span className="text-gray-400">Mission:</span> <span className="text-green-400">{traveller.mission.type.toUpperCase()}</span></p>
                    <p className="text-gray-300">{traveller.mission.description}</p>
                  </div>

                  <div className="flex items-center gap-2 mt-3">
                    {traveller.baobabClearance && <Shield className="h-3 w-3 text-purple-400" />}
                    {traveller.coreAccess && <Globe className="h-3 w-3 text-blue-400" />}
                    <Badge variant="outline" className={`text-xs ${
                      traveller.mission.priority === 'critical' ? 'text-red-400 border-red-400' :
                      traveller.mission.priority === 'high' ? 'text-orange-400 border-orange-400' :
                      traveller.mission.priority === 'medium' ? 'text-yellow-400 border-yellow-400' :
                      'text-gray-400 border-gray-400'
                    }`}>
                      {traveller.mission.priority.toUpperCase()}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Baobab Security Protocols */}
      <Card className="bg-gray-800 border-gray-600">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Baobab Security Protocols
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {coreData.protocols.map((protocol) => (
              <Card key={protocol.id} className="bg-gray-700 border-gray-600">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-white font-medium">{protocol.name}</h4>
                    <div className="flex items-center gap-2">
                      {protocol.active ? (
                        <CheckCircle className="h-4 w-4 text-green-400" />
                      ) : (
                        <AlertTriangle className="h-4 w-4 text-gray-400" />
                      )}
                      <Badge 
                        variant={protocol.active ? 'default' : 'outline'}
                        className={protocol.active ? 'bg-green-600' : 'text-gray-400 border-gray-400'}
                      >
                        {protocol.active ? 'ACTIVE' : 'INACTIVE'}
                      </Badge>
                    </div>
                  </div>

                  <p className="text-sm text-gray-300 mb-3">{protocol.description}</p>

                  <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                    <div>
                      <span className="text-gray-400">Level:</span>
                      <p className="text-purple-400 font-mono">{protocol.level.toUpperCase()}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">Core Protection:</span>
                      <p className={protocol.coreProtection ? 'text-green-400' : 'text-gray-400'}>
                        {protocol.coreProtection ? 'Enabled' : 'Disabled'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {protocol.nonNegotiational && (
                      <Badge variant="outline" className="text-xs text-red-400 border-red-400">
                        NON-NEG
                      </Badge>
                    )}
                    {protocol.planetaryOverride && (
                      <Badge variant="outline" className="text-xs text-yellow-400 border-yellow-400">
                        PLANETARY
                      </Badge>
                    )}
                  </div>

                  {!protocol.active && (
                    <Button
                      onClick={() => activateProtocol(protocol.id)}
                      size="sm"
                      className="w-full mt-3 bg-green-600 hover:bg-green-700"
                      data-testid={`activate-${protocol.id}`}
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      Activate Protocol
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Core Info */}
      <Card className="bg-gray-800 border-gray-600">
        <CardContent className="p-4">
          <div className="text-sm text-gray-400 space-y-2">
            <p><strong className="text-purple-400">Planetary Center:</strong> Portal positioned at Earth's geographic center (0°, 0°)</p>
            <p><strong className="text-green-400">Baobab Security:</strong> Non-negotiational titular core protection system</p>
            <p><strong className="text-blue-400">Core Travellers HQ:</strong> Central command for all planetary core operations</p>
            <p><strong className="text-orange-400">Portal Lifts:</strong> Transport system between surface and planetary core</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}