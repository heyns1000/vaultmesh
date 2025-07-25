import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';

interface URLBackupConfig {
  primary: string;
  backups: string[];
  fallback: string;
  priority: number;
  lastChecked: string;
  status: 'active' | 'degraded' | 'failed';
  responseTime: number;
}

interface URLIntegrityResult {
  url: string;
  isValid: boolean;
  responseTime: number;
  errorMessage?: string;
  timestamp: string;
}

export default function URLBackupSystem() {
  const [location, setLocation] = useLocation();
  const [backupConfigs, setBackupConfigs] = useState<URLBackupConfig[]>([]);
  const [integrityResults, setIntegrityResults] = useState<URLIntegrityResult[]>([]);
  const [lastFullCheck, setLastFullCheck] = useState<string>('');

  // Comprehensive VaultMesh URL backup configuration
  const vaultMeshBackupSystem: URLBackupConfig[] = [
    {
      primary: '/',
      backups: ['/home', '/dashboard', '/main', '/index'],
      fallback: '/terminal',
      priority: 1,
      lastChecked: new Date().toISOString(),
      status: 'active',
      responseTime: 0
    },
    {
      primary: '/sectors',
      backups: ['/industries', '/verticals', '/solutions', '/markets'],
      fallback: '/',
      priority: 2,
      lastChecked: new Date().toISOString(),
      status: 'active',
      responseTime: 0
    },
    {
      primary: '/terminal',
      backups: ['/console', '/cli', '/command', '/admin'],
      fallback: '/',
      priority: 1,
      lastChecked: new Date().toISOString(),
      status: 'active',
      responseTime: 0
    },
    {
      primary: '/packages',
      backups: ['/pricing', '/plans', '/subscriptions', '/billing'],
      fallback: '/',
      priority: 2,
      lastChecked: new Date().toISOString(),
      status: 'active',
      responseTime: 0
    },
    {
      primary: '/agrochain',
      backups: ['/agriculture', '/agro', '/biotech', '/farming'],
      fallback: '/sectors/agriculture',
      priority: 2,
      lastChecked: new Date().toISOString(),
      status: 'active',
      responseTime: 0
    },
    {
      primary: '/login',
      backups: ['/signin', '/auth', '/authenticate', '/access'],
      fallback: '/',
      priority: 3,
      lastChecked: new Date().toISOString(),
      status: 'active',
      responseTime: 0
    },
    {
      primary: '/signup',
      backups: ['/register', '/join', '/create-account', '/enroll'],
      fallback: '/login',
      priority: 3,
      lastChecked: new Date().toISOString(),
      status: 'active',
      responseTime: 0
    }
  ];

  // Sector-specific backup URLs
  const sectorBackups = [
    'tech', 'finance', 'health', 'energy', 'agriculture', 'transport'
  ].map(sector => ({
    primary: `/sectors/${sector}`,
    backups: [`/${sector}`, `/industry/${sector}`, `/solutions/${sector}`],
    fallback: '/sectors',
    priority: 3,
    lastChecked: new Date().toISOString(),
    status: 'active' as const,
    responseTime: 0
  }));

  // Subscription backup URLs
  const subscriptionBackups = [
    'starter', 'pro', 'enterprise'
  ].map(tier => ({
    primary: `/subscribe/${tier}`,
    backups: [`/plans/${tier}`, `/pricing/${tier}`, `/packages/${tier}`],
    fallback: '/packages',
    priority: 2,
    lastChecked: new Date().toISOString(),
    status: 'active' as const,
    responseTime: 0
  }));

  // Validate URL accessibility
  const validateURL = async (url: string): Promise<URLIntegrityResult> => {
    const startTime = performance.now();
    const timestamp = new Date().toISOString();
    
    try {
      // Check if it's a valid route in our system
      const validRoutes = [
        '/', '/sectors', '/terminal', '/packages', '/agrochain', '/login', '/signup',
        '/features', '/pricing', '/security', '/integrations', '/about', '/careers',
        '/press', '/contact', '/docs', '/api', '/blog', '/support', '/learn',
        '/privacy', '/terms', '/cookies', '/gdpr',
        ...sectorBackups.map(s => s.primary),
        ...subscriptionBackups.map(s => s.primary)
      ];
      
      const isValidRoute = validRoutes.includes(url) || 
                          url.startsWith('/sectors/') || 
                          url.startsWith('/subscribe/');
      
      const responseTime = performance.now() - startTime;
      
      if (!isValidRoute) {
        return {
          url,
          isValid: false,
          responseTime,
          errorMessage: 'Route not found in VaultMesh system',
          timestamp
        };
      }
      
      // Additional checks could include server-side validation
      return {
        url,
        isValid: true,
        responseTime,
        timestamp
      };
      
    } catch (error) {
      const responseTime = performance.now() - startTime;
      return {
        url,
        isValid: false,
        responseTime,
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
        timestamp
      };
    }
  };

  // Run comprehensive integrity check
  const runIntegrityCheck = async (urls?: string[]) => {
    console.log('[VaultMesh URL Backup] Running integrity check...');
    
    const allConfigs = [...vaultMeshBackupSystem, ...sectorBackups, ...subscriptionBackups];
    const urlsToCheck = urls || allConfigs.flatMap(config => [config.primary, ...config.backups]);
    
    const results = await Promise.all(
      urlsToCheck.map(url => validateURL(url))
    );
    
    setIntegrityResults(prev => {
      const updated = [...prev];
      results.forEach(result => {
        const existingIndex = updated.findIndex(r => r.url === result.url);
        if (existingIndex >= 0) {
          updated[existingIndex] = result;
        } else {
          updated.push(result);
        }
      });
      return updated.slice(-200); // Keep last 200 results
    });
    
    // Update backup configs with status
    setBackupConfigs(allConfigs.map(config => {
      const primaryResult = results.find(r => r.url === config.primary);
      const backupResults = config.backups.map(backup => 
        results.find(r => r.url === backup)
      );
      
      let status: 'active' | 'degraded' | 'failed' = 'active';
      if (!primaryResult?.isValid) {
        const workingBackups = backupResults.filter(r => r?.isValid);
        status = workingBackups.length > 0 ? 'degraded' : 'failed';
      }
      
      return {
        ...config,
        status,
        responseTime: primaryResult?.responseTime || 0,
        lastChecked: new Date().toISOString()
      };
    }));
    
    setLastFullCheck(new Date().toISOString());
    
    // Store results in localStorage
    const integrityData = {
      results,
      timestamp: new Date().toISOString(),
      configs: allConfigs
    };
    localStorage.setItem('vaultmesh-url-integrity', JSON.stringify(integrityData));
    
    return results;
  };

  // Auto-redirect to backup URL if primary fails
  const handleURLFailure = (failedUrl: string) => {
    const config = [...vaultMeshBackupSystem, ...sectorBackups, ...subscriptionBackups]
      .find(c => c.primary === failedUrl);
    
    if (config) {
      // Try backups in order
      for (const backup of config.backups) {
        const backupResult = integrityResults.find(r => r.url === backup);
        if (backupResult?.isValid) {
          console.log(`[VaultMesh URL Backup] Redirecting from ${failedUrl} to ${backup}`);
          setLocation(backup);
          return;
        }
      }
      
      // If all backups fail, redirect to fallback
      console.log(`[VaultMesh URL Backup] All backups failed, redirecting to fallback: ${config.fallback}`);
      setLocation(config.fallback);
    }
  };

  // Initialize backup system
  useEffect(() => {
    const initializeSystem = async () => {
      // Load saved integrity data
      const saved = localStorage.getItem('vaultmesh-url-integrity');
      if (saved) {
        try {
          const data = JSON.parse(saved);
          const oneHourAgo = Date.now() - (60 * 60 * 1000);
          const savedTime = new Date(data.timestamp).getTime();
          
          if (savedTime > oneHourAgo) {
            setIntegrityResults(data.results || []);
            setBackupConfigs(data.configs || []);
            setLastFullCheck(data.timestamp);
          }
        } catch (error) {
          console.warn('[VaultMesh URL Backup] Failed to load saved integrity data:', error);
        }
      }
      
      // Run initial integrity check
      await runIntegrityCheck();
    };
    
    initializeSystem();
    
    // Set up periodic integrity checks
    const interval = setInterval(() => {
      runIntegrityCheck();
    }, 10 * 60 * 1000); // Every 10 minutes
    
    return () => clearInterval(interval);
  }, []);

  // Monitor current location for failures
  useEffect(() => {
    const currentResult = integrityResults.find(r => r.url === location);
    if (currentResult && !currentResult.isValid) {
      console.warn(`[VaultMesh URL Backup] Current URL ${location} is invalid, attempting backup`);
      handleURLFailure(location);
    }
  }, [location, integrityResults]);

  // Export backup system data
  const exportBackupData = () => {
    const exportData = {
      backupConfigs,
      integrityResults,
      lastFullCheck,
      exportTimestamp: new Date().toISOString(),
      vaultMeshVersion: '3.2.1',
      systemStatus: {
        totalURLs: backupConfigs.length,
        activeURLs: backupConfigs.filter(c => c.status === 'active').length,
        degradedURLs: backupConfigs.filter(c => c.status === 'degraded').length,
        failedURLs: backupConfigs.filter(c => c.status === 'failed').length,
        averageResponseTime: backupConfigs.reduce((sum, c) => sum + c.responseTime, 0) / backupConfigs.length
      }
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { 
      type: 'application/json' 
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vaultmesh-backup-system-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Only show in development or debug mode
  if (process.env.NODE_ENV === 'production' && !localStorage.getItem('vaultmesh-debug')) {
    return null;
  }

  const statusCounts = {
    active: backupConfigs.filter(c => c.status === 'active').length,
    degraded: backupConfigs.filter(c => c.status === 'degraded').length,
    failed: backupConfigs.filter(c => c.status === 'failed').length
  };

  return (
    <div className="fixed top-4 right-4 z-50 bg-gray-900 text-white text-xs p-3 rounded max-w-sm">
      <div className="font-bold mb-2 text-green-400">VaultMesh URL Backup System</div>
      
      <div className="space-y-1 mb-3">
        <div>Active: <span className="text-green-400">{statusCounts.active}</span></div>
        <div>Degraded: <span className="text-yellow-400">{statusCounts.degraded}</span></div>
        <div>Failed: <span className="text-red-400">{statusCounts.failed}</span></div>
      </div>
      
      <div className="text-gray-300 mb-2">
        Last Check: {lastFullCheck ? new Date(lastFullCheck).toLocaleTimeString() : 'None'}
      </div>
      
      <div className="flex gap-2">
        <button 
          onClick={() => runIntegrityCheck()}
          className="px-2 py-1 bg-blue-600 rounded text-xs hover:bg-blue-700"
        >
          Check Now
        </button>
        <button 
          onClick={exportBackupData}
          className="px-2 py-1 bg-green-600 rounded text-xs hover:bg-green-700"
        >
          Export
        </button>
      </div>
    </div>
  );
}