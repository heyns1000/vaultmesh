import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { createPaypalOrder, capturePaypalOrder, loadPaypalDefault } from "./paypal";

// URL Analytics types
interface URLAnalyticsData {
  url: string;
  timestamp: string;
  referrer: string;
  userAgent: string;
  viewport: string;
  sessionId: string;
  loadTime: number;
  pageTitle: string;
}

interface RouteMetricsData {
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

// In-memory storage for URL analytics (in production, use proper database)
const urlAnalytics: URLAnalyticsData[] = [];
const routeMetrics: Map<string, RouteMetricsData> = new Map();

export async function registerRoutes(app: Express): Promise<Server> {
  // PayPal routes
  app.get("/paypal/setup", async (req, res) => {
    await loadPaypalDefault(req, res);
  });

  app.post("/paypal/order", async (req, res) => {
    // Request body should contain: { intent, amount, currency }
    await createPaypalOrder(req, res);
  });

  app.post("/paypal/order/:orderID/capture", async (req, res) => {
    await capturePaypalOrder(req, res);
  });

  // API routes for VaultMesh application
  app.get("/api/health", (req, res) => {
    res.json({ status: "healthy", timestamp: new Date().toISOString() });
  });

  app.get("/api/metrics", (req, res) => {
    res.json({
      pulseActivity: "65.08 pulses/sec",
      dataVolumeProcessed: "108.02 TB",
      latencyAverage: "40.82 ms",
      activeNodes: 493,
      uptime: "99.97%",
      lastUpdated: new Date().toISOString()
    });
  });

  app.get("/api/share-price", (req, res) => {
    res.json({
      current: 247.83,
      currency: "USD",
      change: "+2.15",
      changePercent: "+0.87%",
      timestamp: new Date().toISOString(),
      history: [245.20, 246.15, 247.83, 249.12, 247.95, 248.67, 247.83]
    });
  });

  // Terminal command execution
  app.post("/api/terminal/execute", (req, res) => {
    const { command } = req.body;
    
    const commands: Record<string, string> = {
      'status': 'System Status: Online\nNodes: 247 active\nLatency: 12ms avg\nUptime: 99.97%',
      'vault list': 'Active Vaults:\n• vault-us1 (healthy)\n• vault-eu2 (healthy)\n• vault-ap3 (healthy)',
      'scan': 'Network Scan Results:\nDiscovered 1,247 mesh nodes\nOptimal routes calculated\nSecurity verified',
      'analytics': 'Analytics Dashboard:\nTraffic: +15% this week\nPerformance: Excellent\nAlerts: None',
      'help': 'Available commands:\n• status - System status\n• vault list - List active vaults\n• scan - Network scan\n• analytics - View analytics\n• clear - Clear terminal\n• help - Show this help'
    };

    const result = commands[command];
    if (result) {
      res.json({ output: result, success: true });
    } else {
      res.json({ 
        output: `Command not found: ${command}. Type 'help' for available commands.`, 
        success: false 
      });
    }
  });

  // URL Analytics endpoints
  app.post("/api/analytics/track", (req, res) => {
    try {
      const analyticsData: URLAnalyticsData = req.body;
      
      // Validate required fields
      if (!analyticsData.url || !analyticsData.sessionId) {
        return res.status(400).json({ error: "Missing required fields" });
      }
      
      // Store analytics data (keep last 1000 entries)
      urlAnalytics.push(analyticsData);
      if (urlAnalytics.length > 1000) {
        urlAnalytics.shift();
      }
      
      // Update route metrics
      const path = analyticsData.url;
      const existing = routeMetrics.get(path) || {
        path,
        visits: 0,
        totalTime: 0,
        averageTime: 0,
        bounceRate: 0,
        lastVisit: analyticsData.timestamp,
        referrers: {},
        userAgents: {},
        exitRoutes: {}
      };
      
      existing.visits += 1;
      existing.totalTime += analyticsData.loadTime;
      existing.averageTime = existing.totalTime / existing.visits;
      existing.lastVisit = analyticsData.timestamp;
      existing.referrers[analyticsData.referrer] = (existing.referrers[analyticsData.referrer] || 0) + 1;
      existing.userAgents[analyticsData.userAgent] = (existing.userAgents[analyticsData.userAgent] || 0) + 1;
      
      routeMetrics.set(path, existing);
      
      res.json({ success: true, recorded: analyticsData.timestamp });
    } catch (error) {
      console.error('Analytics tracking error:', error);
      res.status(500).json({ error: "Failed to record analytics" });
    }
  });

  app.get("/api/analytics/metrics", (req, res) => {
    const { path } = req.query;
    
    try {
      if (path) {
        const metrics = routeMetrics.get(path as string);
        if (!metrics) {
          return res.status(404).json({ error: "Route not found" });
        }
        res.json(metrics);
      } else {
        // Return all metrics
        const allMetrics = Array.from(routeMetrics.values());
        const summary = {
          totalRoutes: allMetrics.length,
          totalVisits: allMetrics.reduce((sum, m) => sum + m.visits, 0),
          averageResponseTime: allMetrics.reduce((sum, m) => sum + m.averageTime, 0) / allMetrics.length,
          routes: allMetrics,
          lastUpdated: new Date().toISOString()
        };
        res.json(summary);
      }
    } catch (error) {
      console.error('Analytics metrics error:', error);
      res.status(500).json({ error: "Failed to retrieve metrics" });
    }
  });

  app.get("/api/analytics/export", (req, res) => {
    try {
      const exportData = {
        urlAnalytics: urlAnalytics.slice(-500), // Last 500 entries
        routeMetrics: Array.from(routeMetrics.entries()),
        exportTimestamp: new Date().toISOString(),
        summary: {
          totalAnalyticsEntries: urlAnalytics.length,
          totalRouteMetrics: routeMetrics.size,
          dateRange: {
            earliest: urlAnalytics.length > 0 ? urlAnalytics[0].timestamp : null,
            latest: urlAnalytics.length > 0 ? urlAnalytics[urlAnalytics.length - 1].timestamp : null
          }
        }
      };
      
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', `attachment; filename="vaultmesh-analytics-${new Date().toISOString().split('T')[0]}.json"`);
      res.json(exportData);
    } catch (error) {
      console.error('Analytics export error:', error);
      res.status(500).json({ error: "Failed to export analytics" });
    }
  });

  app.delete("/api/analytics/clear", (req, res) => {
    try {
      urlAnalytics.length = 0;
      routeMetrics.clear();
      res.json({ success: true, clearedAt: new Date().toISOString() });
    } catch (error) {
      console.error('Analytics clear error:', error);
      res.status(500).json({ error: "Failed to clear analytics" });
    }
  });

  // URL Integrity check endpoint
  app.post("/api/url-integrity/check", (req, res) => {
    const { urls } = req.body;
    
    try {
      // VaultMesh valid routes
      const validRoutes = [
        '/', '/sectors', '/terminal', '/packages', '/agrochain', '/login', '/signup',
        '/features', '/pricing', '/security', '/integrations', '/about', '/careers',
        '/press', '/contact', '/docs', '/api', '/blog', '/support', '/learn',
        '/privacy', '/terms', '/cookies', '/gdpr'
      ];
      
      const results = (urls || validRoutes).map((url: string) => ({
        url,
        isValid: validRoutes.includes(url) || url.startsWith('/sectors/') || url.startsWith('/subscribe/'),
        timestamp: new Date().toISOString(),
        responseTime: Math.random() * 100 // Simulated response time
      }));
      
      res.json({ results, checkedAt: new Date().toISOString() });
    } catch (error) {
      console.error('URL integrity check error:', error);
      res.status(500).json({ error: "Failed to check URL integrity" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
