import { useEffect, useState } from 'react';
import { useRouteAnalytics } from '@/hooks/useRouteAnalytics';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart3, Globe, Clock, Users, TrendingUp, Download, RefreshCw } from 'lucide-react';
import URLIntegrityMonitor from './URLIntegrityMonitor';
import URLBackupRestoreSystem from './URLBackupRestoreSystem';

interface ServerAnalytics {
  totalRoutes: number;
  totalVisits: number;
  averageResponseTime: number;
  routes: any[];
  lastUpdated: string;
}

export default function AnalyticsDashboard() {
  const { analytics, exportAnalytics, clearAnalytics } = useRouteAnalytics();
  const [serverAnalytics, setServerAnalytics] = useState<ServerAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch server-side analytics
  const fetchServerAnalytics = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/analytics/metrics');
      if (response.ok) {
        const data = await response.json();
        setServerAnalytics(data);
      }
    } catch (error) {
      console.error('Failed to fetch server analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchServerAnalytics();
    const interval = setInterval(fetchServerAnalytics, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  // Calculate client-side metrics
  const clientMetrics = {
    totalPageViews: analytics.totalPageViews,
    uniqueSessions: analytics.uniqueSessions,
    routeCount: Object.keys(analytics.routes).length,
    topRoutes: Object.values(analytics.routes)
      .sort((a, b) => b.visits - a.visits)
      .slice(0, 5),
    recentActivity: Object.values(analytics.routes)
      .sort((a, b) => new Date(b.lastVisit).getTime() - new Date(a.lastVisit).getTime())
      .slice(0, 5)
  };

  // URL Performance Calculator
  const getPerformanceScore = (route: any) => {
    const factors = {
      visits: Math.min(route.visits / 10, 1) * 30, // Max 30 points for visits
      averageTime: route.averageTime > 0 ? Math.min(30000 / route.averageTime, 1) * 25 : 0, // Max 25 points for speed
      bounceRate: (1 - route.bounceRate) * 25, // Max 25 points for engagement
      referrerDiversity: Math.min(Object.keys(route.referrers).length / 3, 1) * 20 // Max 20 points for traffic sources
    };
    
    return Math.round(Object.values(factors).reduce((sum, score) => sum + score, 0));
  };

  // Export comprehensive analytics
  const exportFullAnalytics = async () => {
    try {
      const response = await fetch('/api/analytics/export');
      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `vaultmesh-full-analytics-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Failed to export server analytics:', error);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-green-400">VaultMesh Analytics Dashboard</h1>
          <p className="text-gray-400 mt-2">Comprehensive URL monitoring and routing analytics</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={fetchServerAnalytics} disabled={isLoading} variant="outline">
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button onClick={exportFullAnalytics} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export All
          </Button>
          <Button onClick={exportAnalytics} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Client
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gray-900/50 border-green-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-400">Total Page Views</CardTitle>
            <BarChart3 className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{clientMetrics.totalPageViews}</div>
            <p className="text-xs text-gray-400">Client-side tracking</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-blue-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-400">Unique Sessions</CardTitle>
            <Users className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{clientMetrics.uniqueSessions}</div>
            <p className="text-xs text-gray-400">Active user sessions</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-purple-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-400">Active Routes</CardTitle>
            <Globe className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{clientMetrics.routeCount}</div>
            <p className="text-xs text-gray-400">Monitored endpoints</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-yellow-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-yellow-400">Avg Response Time</CardTitle>
            <Clock className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {serverAnalytics?.averageResponseTime 
                ? `${Math.round(serverAnalytics.averageResponseTime)}ms`
                : 'N/A'
              }
            </div>
            <p className="text-xs text-gray-400">Server response time</p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics Tabs */}
      <Tabs defaultValue="routes" className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="routes">Performance</TabsTrigger>
          <TabsTrigger value="traffic">Traffic</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="integrity">Integrity</TabsTrigger>
          <TabsTrigger value="backup">Backup</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
        </TabsList>

        <TabsContent value="routes" className="space-y-4">
          <Card className="bg-gray-900/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-green-400">Top Performing Routes</CardTitle>
              <CardDescription>Routes ranked by performance score and visit count</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {clientMetrics.topRoutes.map((route, index) => {
                  const performanceScore = getPerformanceScore(route);
                  return (
                    <div key={route.path} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Badge variant="outline" className="text-xs">
                          #{index + 1}
                        </Badge>
                        <div>
                          <div className="font-medium text-white">{route.path}</div>
                          <div className="text-sm text-gray-400">
                            {route.visits} visits • {Math.round(route.averageTime / 1000)}s avg time
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="text-right">
                          <div className="text-sm font-medium text-green-400">{performanceScore}/100</div>
                          <div className="text-xs text-gray-400">Performance</div>
                        </div>
                        <Progress value={performanceScore} className="w-20" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="traffic" className="space-y-4">
          <Card className="bg-gray-900/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-blue-400">Traffic Sources Analysis</CardTitle>
              <CardDescription>Referrer analysis and traffic pattern insights</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.values(analytics.routes)
                  .filter(route => Object.keys(route.referrers).length > 0)
                  .slice(0, 5)
                  .map((route) => (
                    <div key={route.path} className="p-3 bg-gray-800/50 rounded-lg">
                      <div className="font-medium text-white mb-2">{route.path}</div>
                      <div className="space-y-2">
                        {Object.entries(route.referrers)
                          .sort(([,a], [,b]) => b - a)
                          .slice(0, 3)
                          .map(([referrer, count]) => (
                            <div key={referrer} className="flex justify-between text-sm">
                              <span className="text-gray-300 truncate max-w-xs">
                                {referrer === 'direct' ? 'Direct Traffic' : referrer}
                              </span>
                              <span className="text-blue-400">{count} visits</span>
                            </div>
                          ))
                        }
                      </div>
                    </div>
                  ))
                }
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <Card className="bg-gray-900/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-purple-400">User Behavior Insights</CardTitle>
              <CardDescription>Session duration, bounce rates, and user journey analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.values(analytics.routes)
                  .sort((a, b) => b.visits - a.visits)
                  .slice(0, 6)
                  .map((route) => (
                    <div key={route.path} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                      <div>
                        <div className="font-medium text-white">{route.path}</div>
                        <div className="text-sm text-gray-400">
                          Bounce Rate: {Math.round(route.bounceRate * 100)}%
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-purple-400">
                          {Math.round(route.averageTime / 1000)}s
                        </div>
                        <div className="text-xs text-gray-400">Avg Session</div>
                      </div>
                    </div>
                  ))
                }
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrity" className="space-y-4">
          <URLIntegrityMonitor />
        </TabsContent>

        <TabsContent value="backup" className="space-y-4">
          <URLBackupRestoreSystem />
        </TabsContent>

        <TabsContent value="system" className="space-y-4">
          <Card className="bg-gray-900/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-yellow-400">System Health Monitor</CardTitle>
              <CardDescription>Session analytics and system performance metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h4 className="font-medium text-white">Session Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Session Start:</span>
                      <span className="text-white">
                        {new Date(analytics.sessionStart).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Last Activity:</span>
                      <span className="text-white">
                        {new Date(analytics.lastActivity).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Session Duration:</span>
                      <span className="text-green-400">
                        {Math.round((new Date(analytics.lastActivity).getTime() - new Date(analytics.sessionStart).getTime()) / 60000)} min
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-medium text-white">Data Management</h4>
                  <div className="space-y-2">
                    <Button onClick={clearAnalytics} variant="destructive" size="sm">
                      Clear Analytics Data
                    </Button>
                    <div className="text-xs text-gray-400">
                      This will reset all client-side analytics data
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}