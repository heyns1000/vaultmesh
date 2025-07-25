import { createContext, useContext, useEffect, useState } from 'react';
import { useLocation } from 'wouter';

interface RouteMetrics {
  path: string;
  visits: number;
  totalTime: number;
  averageTime: number;
  bounceRate: number;
  lastVisit: string;
  referrers: Record<string, number>;
  userAgents: Record<string, number>;
  exitRoutes: Record<string, number>;
}

interface RoutingAnalytics {
  totalPageViews: number;
  uniqueSessions: number;
  routes: Record<string, RouteMetrics>;
  sessionStart: string;
  lastActivity: string;
}

interface RouteAnalyticsContextType {
  analytics: RoutingAnalytics;
  recordVisit: (path: string, referrer?: string) => void;
  recordExit: (fromPath: string, toPath: string) => void;
  getRouteMetrics: (path: string) => RouteMetrics | null;
  exportAnalytics: () => void;
  clearAnalytics: () => void;
}

const RouteAnalyticsContext = createContext<RouteAnalyticsContextType | undefined>(undefined);

export function RouteAnalyticsProvider({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [analytics, setAnalytics] = useState<RoutingAnalytics>(() => {
    const stored = localStorage.getItem('vaultmesh-route-analytics');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (error) {
        console.warn('[Route Analytics] Failed to parse stored analytics:', error);
      }
    }
    
    return {
      totalPageViews: 0,
      uniqueSessions: 0,
      routes: {},
      sessionStart: new Date().toISOString(),
      lastActivity: new Date().toISOString()
    };
  });

  const [visitStartTime, setVisitStartTime] = useState<Record<string, number>>({});
  const [sessionId] = useState(() => 
    localStorage.getItem('vaultmesh-session-id') || 
    `vm-session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  );

  // Initialize session tracking
  useEffect(() => {
    localStorage.setItem('vaultmesh-session-id', sessionId);
    
    // Check if this is a new session
    const lastSession = localStorage.getItem('vaultmesh-last-session');
    const now = Date.now();
    const thirtyMinutes = 30 * 60 * 1000;
    
    if (!lastSession || (now - parseInt(lastSession)) > thirtyMinutes) {
      setAnalytics(prev => ({
        ...prev,
        uniqueSessions: prev.uniqueSessions + 1,
        sessionStart: new Date().toISOString()
      }));
    }
    
    localStorage.setItem('vaultmesh-last-session', now.toString());
  }, [sessionId]);

  // Record route visit
  const recordVisit = (path: string, referrer?: string) => {
    const now = new Date().toISOString();
    const userAgent = navigator.userAgent;
    
    setVisitStartTime(prev => ({ ...prev, [path]: Date.now() }));
    
    setAnalytics(prev => {
      const currentRoute = prev.routes[path] || {
        path,
        visits: 0,
        totalTime: 0,
        averageTime: 0,
        bounceRate: 0,
        lastVisit: now,
        referrers: {},
        userAgents: {},
        exitRoutes: {}
      };

      const updatedRoute: RouteMetrics = {
        ...currentRoute,
        visits: currentRoute.visits + 1,
        lastVisit: now,
        referrers: {
          ...currentRoute.referrers,
          [referrer || 'direct']: (currentRoute.referrers[referrer || 'direct'] || 0) + 1
        },
        userAgents: {
          ...currentRoute.userAgents,
          [userAgent]: (currentRoute.userAgents[userAgent] || 0) + 1
        }
      };

      return {
        ...prev,
        totalPageViews: prev.totalPageViews + 1,
        lastActivity: now,
        routes: {
          ...prev.routes,
          [path]: updatedRoute
        }
      };
    });
  };

  // Record route exit
  const recordExit = (fromPath: string, toPath: string) => {
    const visitTime = visitStartTime[fromPath];
    if (visitTime) {
      const timeSpent = Date.now() - visitTime;
      
      setAnalytics(prev => {
        const currentRoute = prev.routes[fromPath];
        if (!currentRoute) return prev;

        const newTotalTime = currentRoute.totalTime + timeSpent;
        const newAverageTime = newTotalTime / currentRoute.visits;
        
        const updatedRoute: RouteMetrics = {
          ...currentRoute,
          totalTime: newTotalTime,
          averageTime: newAverageTime,
          exitRoutes: {
            ...currentRoute.exitRoutes,
            [toPath]: (currentRoute.exitRoutes[toPath] || 0) + 1
          }
        };

        return {
          ...prev,
          routes: {
            ...prev.routes,
            [fromPath]: updatedRoute
          }
        };
      });
      
      setVisitStartTime(prev => {
        const updated = { ...prev };
        delete updated[fromPath];
        return updated;
      });
    }
  };

  // Get metrics for specific route
  const getRouteMetrics = (path: string): RouteMetrics | null => {
    return analytics.routes[path] || null;
  };

  // Export analytics data
  const exportAnalytics = () => {
    const exportData = {
      ...analytics,
      exportDate: new Date().toISOString(),
      sessionId,
      vaultMeshVersion: '3.2.1',
      userAgent: navigator.userAgent,
      viewport: `${window.innerWidth}x${window.innerHeight}`,
      // Add route performance metrics
      routePerformance: Object.entries(analytics.routes).map(([routePath, metrics]) => ({
        path: routePath,
        ...metrics,
        conversionRate: metrics.visits > 0 ? (1 - metrics.bounceRate) : 0,
        avgSessionTime: metrics.averageTime / 1000, // Convert to seconds
        popularityScore: metrics.visits / Math.max(analytics.totalPageViews, 1) * 100
      }))
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { 
      type: 'application/json' 
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vaultmesh-route-analytics-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Clear analytics data
  const clearAnalytics = () => {
    const freshAnalytics: RoutingAnalytics = {
      totalPageViews: 0,
      uniqueSessions: 0,
      routes: {},
      sessionStart: new Date().toISOString(),
      lastActivity: new Date().toISOString()
    };
    
    setAnalytics(freshAnalytics);
    localStorage.removeItem('vaultmesh-route-analytics');
    localStorage.removeItem('vaultmesh-session-id');
    localStorage.removeItem('vaultmesh-last-session');
  };

  // Track location changes
  const [previousLocation, setPreviousLocation] = useState<string>('');
  
  useEffect(() => {
    if (previousLocation && previousLocation !== location) {
      recordExit(previousLocation, location);
    }
    
    recordVisit(location, previousLocation || document.referrer);
    setPreviousLocation(location);
  }, [location, previousLocation]);

  // Persist analytics to localStorage
  useEffect(() => {
    localStorage.setItem('vaultmesh-route-analytics', JSON.stringify(analytics));
  }, [analytics]);

  // Calculate bounce rates
  useEffect(() => {
    const interval = setInterval(() => {
      setAnalytics(prev => {
        const updatedRoutes = { ...prev.routes };
        
        Object.entries(updatedRoutes).forEach(([path, metrics]) => {
          if (metrics.visits > 0) {
            // Calculate bounce rate based on average time spent
            const bounceThreshold = 10000; // 10 seconds
            updatedRoutes[path] = {
              ...metrics,
              bounceRate: metrics.averageTime < bounceThreshold ? 
                Math.min(0.8, metrics.averageTime / bounceThreshold) : 0.1
            };
          }
        });
        
        return {
          ...prev,
          routes: updatedRoutes
        };
      });
    }, 30000); // Update every 30 seconds
    
    return () => clearInterval(interval);
  }, []);

  const contextValue: RouteAnalyticsContextType = {
    analytics,
    recordVisit,
    recordExit,
    getRouteMetrics,
    exportAnalytics,
    clearAnalytics
  };

  return (
    <RouteAnalyticsContext.Provider value={contextValue}>
      {children}
    </RouteAnalyticsContext.Provider>
  );
}

export function useRouteAnalytics() {
  const context = useContext(RouteAnalyticsContext);
  if (context === undefined) {
    throw new Error('useRouteAnalytics must be used within a RouteAnalyticsProvider');
  }
  return context;
}