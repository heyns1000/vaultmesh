import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, XCircle, AlertTriangle, Globe, Clock, Zap } from 'lucide-react';

interface URLStatus {
  url: string;
  isValid: boolean;
  responseTime: number;
  timestamp: string;
  errorMessage?: string;
}

interface IntegrityReport {
  results: URLStatus[];
  checkedAt: string;
  summary: {
    total: number;
    valid: number;
    invalid: number;
    averageResponseTime: number;
  };
}

export default function URLIntegrityMonitor() {
  const [integrityReport, setIntegrityReport] = useState<IntegrityReport | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [lastCheckTime, setLastCheckTime] = useState<string>('');

  // VaultMesh critical URLs to monitor
  const criticalUrls = [
    '/', '/sectors', '/terminal', '/packages', '/agrochain', '/login', '/signup',
    '/analytics', '/features', '/pricing', '/security', '/integrations',
    '/about', '/careers', '/press', '/contact', '/docs', '/api', '/blog',
    '/support', '/privacy', '/terms', '/cookies', '/gdpr', '/learn'
  ];

  // Secondary URLs (sector and subscription routes)
  const secondaryUrls = [
    '/sectors/tech', '/sectors/finance', '/sectors/health', '/sectors/energy',
    '/sectors/agriculture', '/sectors/transport', '/subscribe/starter',
    '/subscribe/pro', '/subscribe/enterprise'
  ];

  const runIntegrityCheck = async (urlsToCheck?: string[]) => {
    setIsChecking(true);
    
    try {
      const response = await fetch('/api/url-integrity/check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          urls: urlsToCheck || [...criticalUrls, ...secondaryUrls]
        })
      });

      if (response.ok) {
        const data = await response.json();
        const summary = {
          total: data.results.length,
          valid: data.results.filter((r: URLStatus) => r.isValid).length,
          invalid: data.results.filter((r: URLStatus) => !r.isValid).length,
          averageResponseTime: data.results.reduce((sum: number, r: URLStatus) => sum + r.responseTime, 0) / data.results.length
        };

        setIntegrityReport({
          results: data.results,
          checkedAt: data.checkedAt,
          summary
        });
        setLastCheckTime(data.checkedAt);
      }
    } catch (error) {
      console.error('URL integrity check failed:', error);
    } finally {
      setIsChecking(false);
    }
  };

  // Auto-run integrity check on component mount and every 5 minutes
  useEffect(() => {
    runIntegrityCheck();
    const interval = setInterval(() => runIntegrityCheck(), 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = (status: URLStatus) => {
    if (status.isValid) {
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    } else {
      return <XCircle className="h-4 w-4 text-red-500" />;
    }
  };

  const getResponseTimeColor = (time: number) => {
    if (time < 50) return 'text-green-400';
    if (time < 100) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getHealthStatus = () => {
    if (!integrityReport) return { status: 'unknown', color: 'gray', message: 'No data available' };
    
    const { summary } = integrityReport;
    const healthPercentage = (summary.valid / summary.total) * 100;
    
    if (healthPercentage === 100) {
      return { status: 'excellent', color: 'green', message: 'All systems operational' };
    } else if (healthPercentage >= 90) {
      return { status: 'good', color: 'yellow', message: 'Minor issues detected' };
    } else if (healthPercentage >= 75) {
      return { status: 'warning', color: 'orange', message: 'Several issues detected' };
    } else {
      return { status: 'critical', color: 'red', message: 'Critical issues detected' };
    }
  };

  const health = getHealthStatus();

  return (
    <Card className="bg-gray-900/50 border-gray-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-green-400 flex items-center gap-2">
              <Globe className="h-5 w-5" />
              URL Integrity Monitor
            </CardTitle>
            <CardDescription>
              Real-time monitoring of VaultMesh routing system health
            </CardDescription>
          </div>
          <Button 
            onClick={() => runIntegrityCheck()} 
            disabled={isChecking}
            variant="outline"
            size="sm"
          >
            {isChecking ? 'Checking...' : 'Check Now'}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Health Status Alert */}
        <Alert className={`border-${health.color}-500/20 bg-${health.color}-500/10`}>
          <AlertTriangle className={`h-4 w-4 text-${health.color}-500`} />
          <AlertDescription className={`text-${health.color}-400`}>
            <strong>System Health: {health.status.toUpperCase()}</strong> - {health.message}
            {lastCheckTime && (
              <span className="block text-xs text-gray-400 mt-1">
                Last checked: {new Date(lastCheckTime).toLocaleString()}
              </span>
            )}
          </AlertDescription>
        </Alert>

        {/* Summary Stats */}
        {integrityReport && (
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-3 bg-gray-800/50 rounded">
              <div className="text-2xl font-bold text-green-400">
                {integrityReport.summary.valid}
              </div>
              <div className="text-xs text-gray-400">Valid URLs</div>
            </div>
            <div className="text-center p-3 bg-gray-800/50 rounded">
              <div className="text-2xl font-bold text-red-400">
                {integrityReport.summary.invalid}
              </div>
              <div className="text-xs text-gray-400">Failed URLs</div>
            </div>
            <div className="text-center p-3 bg-gray-800/50 rounded">
              <div className={`text-2xl font-bold ${getResponseTimeColor(integrityReport.summary.averageResponseTime)}`}>
                {Math.round(integrityReport.summary.averageResponseTime)}ms
              </div>
              <div className="text-xs text-gray-400">Avg Response</div>
            </div>
          </div>
        )}

        {/* Critical URLs Status */}
        <div>
          <h4 className="font-medium text-white mb-3 flex items-center gap-2">
            <Zap className="h-4 w-4 text-yellow-400" />
            Critical Routes Status
          </h4>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {integrityReport?.results
              .filter(result => criticalUrls.includes(result.url))
              .map((status) => (
                <div 
                  key={status.url} 
                  className={`flex items-center justify-between p-2 rounded ${
                    status.isValid ? 'bg-green-500/10' : 'bg-red-500/10'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(status)}
                    <span className="text-white font-mono text-sm">{status.url}</span>
                    {!status.isValid && (
                      <Badge variant="destructive" className="text-xs">
                        ERROR
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center space-x-2 text-xs">
                    <Clock className="h-3 w-3 text-gray-400" />
                    <span className={getResponseTimeColor(status.responseTime)}>
                      {Math.round(status.responseTime)}ms
                    </span>
                  </div>
                </div>
              ))
            }
          </div>
        </div>

        {/* Failed URLs Details */}
        {integrityReport && integrityReport.summary.invalid > 0 && (
          <div>
            <h4 className="font-medium text-red-400 mb-3">Failed URLs</h4>
            <div className="space-y-2">
              {integrityReport.results
                .filter(result => !result.isValid)
                .map((status) => (
                  <div key={status.url} className="p-3 bg-red-500/10 border border-red-500/20 rounded">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-white font-mono">{status.url}</span>
                      <span className="text-xs text-gray-400">
                        {new Date(status.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    {status.errorMessage && (
                      <div className="text-sm text-red-400">
                        Error: {status.errorMessage}
                      </div>
                    )}
                  </div>
                ))
              }
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="flex gap-2 pt-2 border-t border-gray-700">
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => runIntegrityCheck(criticalUrls)}
            disabled={isChecking}
          >
            Check Critical Only
          </Button>
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => runIntegrityCheck(secondaryUrls)}
            disabled={isChecking}
          >
            Check Secondary
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}