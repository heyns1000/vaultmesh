import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Globe, 
  Home, 
  Rocket, 
  Building2, 
  Link,
  CheckCircle,
  Clock,
  AlertTriangle,
  MapPin,
  Users,
  Wifi,
  Shield,
  Play,
  Settings
} from 'lucide-react';

interface CountryDeployment {
  id: string;
  country: string;
  countryCode: string;
  continent: string;
  region: string;
  status: 'planned' | 'deploying' | 'active' | 'maintenance' | 'offline';
  faaHousingConnected: boolean;
  mainAppHooked: boolean;
  deploymentProgress: number;
  infrastructure: {
    bushPortals: number;
    tripotStability: 'stable' | 'warning' | 'critical';
    vaultMeshNodes: number;
    secureSignEnabled: boolean;
  };
  housing: {
    units: number;
    occupancy: number;
    realEstateIntegration: boolean;
  };
  deployment: {
    startDate: string;
    estimatedCompletion: string;
    actualCompletion?: string;
    resources: string[];
    stakeholders: string[];
  };
}

interface MainAppHook {
  id: string;
  name: string;
  version: string;
  status: 'standalone' | 'hooked' | 'deploying' | 'error';
  hookPoints: {
    faaHousing: boolean;
    banimalLoop: boolean;
    vaultMesh: boolean;
    secureSign: boolean;
    bushPortals: boolean;
  };
  globalConnections: number;
  lastUpdated: string;
}

interface GlobalDeploymentData {
  deployments: CountryDeployment[];
  progress: {
    overall: number;
    byContinent: Record<string, number>;
    summary: {
      totalCountries: number;
      deploying: number;
      active: number;
      planned: number;
      hookedToMain: number;
      faaConnected: number;
    };
  };
  mainApp: MainAppHook;
  project: any;
}

export default function GlobalDeploymentInterface() {
  const [deploymentData, setDeploymentData] = useState<GlobalDeploymentData | null>(null);
  const [selectedContinent, setSelectedContinent] = useState<string>('all');
  const [newCountry, setNewCountry] = useState({ country: '', countryCode: '', continent: '' });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadDeploymentData();
    const interval = setInterval(loadDeploymentData, 10000); // Refresh every 10 seconds
    return () => clearInterval(interval);
  }, []);

  const loadDeploymentData = async () => {
    try {
      const response = await fetch('/api/global-deployment/status');
      const data = await response.json();
      if (data.success) {
        setDeploymentData(data.data);
      }
    } catch (error) {
      console.error('[Global Deployment] Failed to load data:', error);
    }
  };

  const hookMainApp = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/global-deployment/hook-main-app', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });

      const data = await response.json();
      if (data.success) {
        loadDeploymentData();
      }
    } catch (error) {
      console.error('[Global Deployment] Failed to hook main app:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const deployToCountry = async (countryCode: string) => {
    try {
      const response = await fetch(`/api/global-deployment/deploy/${countryCode}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      if (data.success) {
        loadDeploymentData();
      }
    } catch (error) {
      console.error('[Global Deployment] Failed to deploy to country:', error);
    }
  };

  const addCountry = async () => {
    if (!newCountry.country || !newCountry.countryCode || !newCountry.continent) return;

    try {
      const response = await fetch('/api/global-deployment/add-country', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCountry),
      });

      const data = await response.json();
      if (data.success) {
        setNewCountry({ country: '', countryCode: '', continent: '' });
        loadDeploymentData();
      }
    } catch (error) {
      console.error('[Global Deployment] Failed to add country:', error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'deploying': return <Rocket className="h-4 w-4 text-blue-400" />;
      case 'planned': return <Clock className="h-4 w-4 text-gray-400" />;
      case 'maintenance': return <Settings className="h-4 w-4 text-yellow-400" />;
      case 'offline': return <AlertTriangle className="h-4 w-4 text-red-400" />;
      default: return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-400 border-green-400';
      case 'deploying': return 'text-blue-400 border-blue-400';
      case 'planned': return 'text-gray-400 border-gray-400';
      case 'maintenance': return 'text-yellow-400 border-yellow-400';
      case 'offline': return 'text-red-400 border-red-400';
      default: return 'text-gray-400 border-gray-400';
    }
  };

  const getTripodStabilityIcon = (stability: string) => {
    switch (stability) {
      case 'stable': return <CheckCircle className="h-3 w-3 text-green-400" />;
      case 'warning': return <AlertTriangle className="h-3 w-3 text-yellow-400" />;
      case 'critical': return <AlertTriangle className="h-3 w-3 text-red-400" />;
      default: return <AlertTriangle className="h-3 w-3 text-gray-400" />;
    }
  };

  const filteredDeployments = deploymentData?.deployments.filter(deployment => 
    selectedContinent === 'all' || deployment.continent === selectedContinent
  ) || [];

  if (!deploymentData) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <Globe className="h-8 w-8 text-cyan-400 mx-auto mb-2 animate-pulse" />
          <p className="text-gray-400">Loading global deployment data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Global Deployment Header */}
      <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-cyan-500/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-cyan-400">
            <Globe className="h-6 w-6" />
            Global Deployment - FAA Housing → 120 Countries
          </CardTitle>
          <div className="flex items-center gap-4 text-sm">
            <Badge variant="outline" className="text-green-400 border-green-400">
              {deploymentData.progress.summary.totalCountries}/120 Countries
            </Badge>
            <Badge variant="outline" className="text-blue-400 border-blue-400">
              {deploymentData.progress.summary.deploying} Deploying
            </Badge>
            <Badge variant="outline" className="text-cyan-400 border-cyan-400">
              {deploymentData.progress.summary.active} Active
            </Badge>
            <Badge 
              variant={deploymentData.mainApp.status === 'hooked' ? 'default' : 'outline'}
              className={deploymentData.mainApp.status === 'hooked' ? 'bg-green-600' : 'text-yellow-400 border-yellow-400'}
            >
              Main App: {deploymentData.mainApp.status.toUpperCase()}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Main App Hook Status */}
          <Card className="bg-gray-700 border-gray-600">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Link className="h-5 w-5 text-cyan-400" />
                  <h4 className="text-white font-medium">{deploymentData.mainApp.name}</h4>
                </div>
                {deploymentData.mainApp.status !== 'hooked' && (
                  <Button
                    onClick={hookMainApp}
                    disabled={isLoading}
                    size="sm"
                    className="bg-cyan-600 hover:bg-cyan-700"
                    data-testid="hook-main-app"
                  >
                    {isLoading ? 'Hooking...' : 'Hook Standalone'}
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-xs">
                {Object.entries(deploymentData.mainApp.hookPoints).map(([key, connected]) => (
                  <div key={key} className="flex items-center gap-1">
                    {connected ? (
                      <CheckCircle className="h-3 w-3 text-green-400" />
                    ) : (
                      <AlertTriangle className="h-3 w-3 text-gray-400" />
                    )}
                    <span className={connected ? 'text-green-400' : 'text-gray-400'}>
                      {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Global Progress */}
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-300">Global Deployment Progress</span>
              <span className="text-cyan-400 font-mono">{deploymentData.progress.overall}%</span>
            </div>
            <Progress value={deploymentData.progress.overall} className="h-3" />
          </div>

          {/* Continental Progress */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {Object.entries(deploymentData.progress.byContinent).map(([continent, progress]) => (
              <div key={continent} className="space-y-2">
                <div className="flex items-center gap-1">
                  <MapPin className="h-3 w-3 text-cyan-400" />
                  <span className="text-xs text-gray-300">{continent}</span>
                </div>
                <Progress value={progress} className="h-2" />
                <span className="text-xs text-gray-400">{progress}%</span>
              </div>
            ))}
          </div>

          {/* Continent Filter */}
          <div className="flex gap-2 flex-wrap">
            {['all', 'North America', 'Europe', 'Asia', 'Africa', 'South America', 'Oceania'].map((continent) => (
              <Button
                key={continent}
                onClick={() => setSelectedContinent(continent)}
                variant={selectedContinent === continent ? 'default' : 'outline'}
                size="sm"
                className={selectedContinent === continent ? 'bg-cyan-600' : 'border-gray-600'}
                data-testid={`filter-${continent.replace(' ', '-').toLowerCase()}`}
              >
                {continent === 'all' ? 'All Continents' : continent}
              </Button>
            ))}
          </div>

          {/* Add New Country */}
          <Card className="bg-gray-700 border-gray-600">
            <CardContent className="p-4">
              <h4 className="text-white font-medium mb-3">Add Country to Deployment</h4>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                <Input
                  value={newCountry.country}
                  onChange={(e) => setNewCountry({...newCountry, country: e.target.value})}
                  placeholder="Country name"
                  className="bg-gray-800 border-gray-600 text-white"
                  data-testid="country-name"
                />
                <Input
                  value={newCountry.countryCode}
                  onChange={(e) => setNewCountry({...newCountry, countryCode: e.target.value.toUpperCase()})}
                  placeholder="Code (e.g., US)"
                  className="bg-gray-800 border-gray-600 text-white"
                  maxLength={2}
                  data-testid="country-code"
                />
                <Input
                  value={newCountry.continent}
                  onChange={(e) => setNewCountry({...newCountry, continent: e.target.value})}
                  placeholder="Continent"
                  className="bg-gray-800 border-gray-600 text-white"
                  data-testid="continent"
                />
                <Button
                  onClick={addCountry}
                  disabled={!newCountry.country || !newCountry.countryCode || !newCountry.continent}
                  className="bg-green-600 hover:bg-green-700"
                  data-testid="add-country"
                >
                  <Globe className="h-4 w-4 mr-2" />
                  Add Country
                </Button>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>

      {/* Country Deployments */}
      <Card className="bg-gray-800 border-gray-600">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Country Deployments ({filteredDeployments.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDeployments.map((deployment) => (
              <Card key={deployment.id} className="bg-gray-700 border-gray-600">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{deployment.countryCode}</span>
                      <h4 className="text-white font-medium">{deployment.country}</h4>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(deployment.status)}
                      <Badge variant="outline" className={getStatusColor(deployment.status)}>
                        {deployment.status.toUpperCase()}
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-2 mb-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Progress</span>
                      <span className="text-cyan-400 font-mono">{deployment.deploymentProgress}%</span>
                    </div>
                    <Progress value={deployment.deploymentProgress} className="h-2" />
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs mb-3">
                    <div>
                      <span className="text-gray-400">Housing Units:</span>
                      <p className="text-blue-400">{deployment.housing.units}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">Occupancy:</span>
                      <p className="text-green-400">{deployment.housing.occupancy}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">Bush Portals:</span>
                      <p className="text-purple-400">{deployment.infrastructure.bushPortals}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">VaultMesh Nodes:</span>
                      <p className="text-cyan-400">{deployment.infrastructure.vaultMeshNodes}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {deployment.faaHousingConnected && <Home className="h-3 w-3 text-orange-400" />}
                      {deployment.mainAppHooked && <Link className="h-3 w-3 text-cyan-400" />}
                      {deployment.infrastructure.secureSignEnabled && <Shield className="h-3 w-3 text-green-400" />}
                      {getTripodStabilityIcon(deployment.infrastructure.tripotStability)}
                    </div>
                    
                    {deployment.status === 'planned' && (
                      <Button
                        onClick={() => deployToCountry(deployment.countryCode)}
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700"
                        data-testid={`deploy-${deployment.countryCode}`}
                      >
                        <Play className="h-3 w-3 mr-1" />
                        Deploy
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Deployment Info */}
      <Card className="bg-gray-800 border-gray-600">
        <CardContent className="p-4">
          <div className="text-sm text-gray-400 space-y-2">
            <p><strong className="text-cyan-400">Main App Standalone:</strong> VaultMesh core hooked independently for global deployment</p>
            <p><strong className="text-orange-400">FAA Housing Base:</strong> Central deployment hub driving projects to 120 countries</p>
            <p><strong className="text-green-400">Country Integration:</strong> Each country gets full infrastructure with housing, portals, and VaultMesh</p>
            <p><strong className="text-purple-400">Global Scale:</strong> Coordinated deployment across all continents with progress tracking</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}