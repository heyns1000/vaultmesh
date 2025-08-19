import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';

interface URLAnalytics {
  url: string;
  timestamp: string;
  referrer: string;
  userAgent: string;
  viewport: string;
  sessionId: string;
  loadTime: number;
  pageTitle: string;
}

interface URLBackup {
  originalUrl: string;
  backupUrls: string[];
  lastValidated: string;
  status: 'active' | 'backup' | 'error';
}

export default function URLMonitor() {
  const [location] = useLocation();
  const [analytics, setAnalytics] = useState<URLAnalytics[]>([]);
  const [urlBackups, setUrlBackups] = useState<URLBackup[]>([]);
  const [sessionId] = useState(() => `vm-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);

  // VaultMesh URL mapping for complete ecosystem coverage including VIP URLs
  const vaultMeshUrls = {
    // Core Navigation URLs from original HTML
    '/': 'VaultMesh Home - Main Dashboard',
    '/sectors': 'Industry Sectors Overview',
    '/sectors/tech': 'Technology Sector Solutions',
    '/sectors/finance': 'Finance Sector Solutions', 
    '/sectors/health': 'Healthcare Sector Solutions',
    '/sectors/energy': 'Energy Sector Solutions',
    '/sectors/agriculture': 'Agriculture Sector Solutions',
    '/sectors/transport': 'Transportation Sector Solutions',
    '/terminal': 'VaultMesh Terminal Command Center',
    '/packages': 'Global Packages - Pricing & Subscriptions',
    '/agrochain': 'AgroChain Core Protocol Overview',
    '/agrochain/details': 'AgroChain Detailed Implementation',
    '/analytics': 'VaultMesh Analytics Dashboard',
    '/login': 'VaultMesh Authentication Portal',
    '/signup': 'VaultMesh Registration Portal',
    
    // Feature URLs from footer links
    '/features': 'VaultMesh Core Features',
    '#features': 'VaultMesh Core Features Anchor',
    '/pricing': 'VaultMesh Pricing Overview',
    '/security': 'VaultMesh Security Framework',
    '/integrations': 'VaultMesh Integration Hub',
    
    // Company URLs  
    '/about': 'About VaultMesh & Fruitful Team',
    '#about': 'About VaultMesh Anchor',
    '/careers': 'VaultMesh Career Opportunities',
    '/press': 'VaultMesh Press & Media',
    '/contact': 'VaultMesh Contact & Support',
    
    // Resources URLs
    '/docs': 'VaultMesh Documentation',
    '/api': 'VaultMesh API Reference',
    '/blog': 'VaultMesh Blog & Updates',
    '/support': 'VaultMesh Support Center',
    '/learn': 'VaultMesh Learning Center',
    
    // Legal URLs
    '/privacy': 'VaultMesh Privacy Policy',
    '/terms': 'VaultMesh Terms of Service', 
    '/cookies': 'VaultMesh Cookie Policy',
    '/gdpr': 'VaultMesh GDPR Compliance',
    
    // Subscription URLs
    '/subscribe/starter': 'Agriculture & Biotech Starter Package',
    '/subscribe/pro': 'Agriculture & Biotech Pro Package',
    '/subscribe/enterprise': 'Agriculture & Biotech Enterprise Package',
    
    // VIP External URLs (tracked for analytics)
    'https://faa.zone/omnigrid': 'OmniGrid Infrastructure Platform',
    'https://fruitful.faa.zone': 'Fruitful Platform',
    'https://baobab.faa.zone': 'Baobab System',
    'https://fruitfulcratedance.com/': 'Fruitful Crate Dance',
    'https://vaultmesh.faa.zone/fruitful-brand-packages.html': 'VaultMesh Brand Packages',
    'https://seedwave.faa.zone/ecosystem-dashboard.html': 'Seedwave Ecosystem Dashboard',
    'https://faa.zone/careers/hiring-homepage.html': 'FAA Zone Careers',
    'https://faa.zone/legal/securesign.html': 'FAA Zone SecureSign',
    'https://faa.zone/contact-us.html': 'FAA Zone Contact',
    'https://replit.com/t/fruitful-global/': 'Replit Fruitful Global Team',
    'https://login.xero.com/identity/user/login': 'Xero Accounting Login',
    'https://www.clmhosting.co.za/banimal/': 'CLM Hosting Banimal Designer Platform',
    
    // Anchor sections from original HTML
    '#shareprice': 'Share Price Signal Section',
    '#vault-access': 'Vault Terminal Access Section',
    '#treaty': 'Treaty System Section',
    '#vaultmesh': 'VaultMesh Executive Summary',
    
    // Terminal access files
    'vault-master.html': 'VaultMaster Terminal',
    'cube-lattice.html': 'Cube Lattice GPT Terminal',
    'global-view.html': 'Global View GPT Terminal',
    'freight-ops.html': 'Freight Ops GPT Terminal',
    'loop-watch.html': 'Loop Watch GPT Terminal',
    'seedwave.html': 'Seedwave GPT Terminal',
    'distribution.html': 'Distribution GPT Terminal',
    'signal.html': 'Signal GPT Terminal',
    'faa-brands.html': '7038 FAA Brands Terminal'
  };

  // URL backup system for routing preservation
  const urlBackupSystem = {
    '/': ['/home', '/dashboard', '/main'],
    '/sectors': ['/industries', '/verticals', '/solutions'],
    '/terminal': ['/console', '/cli', '/command'],
    '/packages': ['/pricing', '/plans', '/subscriptions'],
    '/agrochain': ['/agriculture', '/agro', '/biotech'],
    '/login': ['/signin', '/auth', '/authenticate'],
    '/signup': ['/register', '/join', '/create-account']
  };

  // Track URL analytics
  const trackURL = (url: string) => {
    const startTime = performance.now();
    
    const analytics: URLAnalytics = {
      url,
      timestamp: new Date().toISOString(),
      referrer: document.referrer || 'direct',
      userAgent: navigator.userAgent,
      viewport: `${window.innerWidth}x${window.innerHeight}`,
      sessionId,
      loadTime: performance.now() - startTime,
      pageTitle: vaultMeshUrls[url as keyof typeof vaultMeshUrls] || document.title
    };

    setAnalytics(prev => [...prev.slice(-99), analytics]); // Keep last 100 entries
    
    // Store in localStorage for persistence
    const storedAnalytics = JSON.parse(localStorage.getItem('vaultmesh-analytics') || '[]');
    storedAnalytics.push(analytics);
    localStorage.setItem('vaultmesh-analytics', JSON.stringify(storedAnalytics.slice(-500)));
  };

  // Validate URL integrity
  const validateURL = async (url: string): Promise<boolean> => {
    try {
      // Check if URL exists in our routing system
      const isValidRoute = Object.keys(vaultMeshUrls).includes(url);
      if (!isValidRoute) {
        console.warn(`[VaultMesh URL Monitor] Invalid route detected: ${url}`);
        return false;
      }
      
      // Additional validation could include server-side checks
      return true;
    } catch (error) {
      console.error(`[VaultMesh URL Monitor] URL validation failed for ${url}:`, error);
      return false;
    }
  };

  // Backup URL system
  const initializeURLBackups = () => {
    const backups: URLBackup[] = Object.entries(urlBackupSystem).map(([original, backupUrls]) => ({
      originalUrl: original,
      backupUrls,
      lastValidated: new Date().toISOString(),
      status: 'active' as const
    }));
    
    setUrlBackups(backups);
    localStorage.setItem('vaultmesh-url-backups', JSON.stringify(backups));
  };

  // URL integrity checker
  const runIntegrityCheck = async () => {
    console.log('[VaultMesh URL Monitor] Running integrity check...');
    
    const results = await Promise.all(
      Object.keys(vaultMeshUrls).map(async (url) => {
        const isValid = await validateURL(url);
        return { url, isValid };
      })
    );
    
    const failedUrls = results.filter(r => !r.isValid);
    if (failedUrls.length > 0) {
      console.warn('[VaultMesh URL Monitor] Failed URLs:', failedUrls);
    }
    
    return results;
  };

  // Monitor location changes
  useEffect(() => {
    trackURL(location);
    validateURL(location);
  }, [location, sessionId]);

  // Initialize monitoring system
  useEffect(() => {
    initializeURLBackups();
    runIntegrityCheck();
    
    // Run integrity check every 5 minutes
    const integrityInterval = setInterval(runIntegrityCheck, 5 * 60 * 1000);
    
    // Track performance metrics
    const trackPerformance = () => {
      if ('performance' in window && 'getEntriesByType' in performance) {
        const navigationEntries = performance.getEntriesByType('navigation');
        if (navigationEntries.length > 0) {
          const navigation = navigationEntries[0] as PerformanceNavigationTiming;
          console.log('[VaultMesh URL Monitor] Page load metrics:', {
            loadTime: navigation.loadEventEnd - navigation.loadEventStart,
            domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
            firstContentfulPaint: performance.getEntriesByName('first-contentful-paint')[0]?.startTime
          });
        }
      }
    };
    
    if (document.readyState === 'complete') {
      trackPerformance();
    } else {
      window.addEventListener('load', trackPerformance);
    }
    
    return () => {
      clearInterval(integrityInterval);
      window.removeEventListener('load', trackPerformance);
    };
  }, []);

  // Export analytics data
  const exportAnalytics = () => {
    const data = {
      analytics,
      urlBackups,
      timestamp: new Date().toISOString(),
      sessionId,
      vaultMeshUrls
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vaultmesh-analytics-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Only render in development or when explicitly enabled
  if (process.env.NODE_ENV === 'production' && !localStorage.getItem('vaultmesh-debug')) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-black bg-opacity-80 text-white text-xs p-2 rounded max-w-xs">
      <div className="font-bold mb-1">VaultMesh URL Monitor</div>
      <div>Current: {location}</div>
      <div>Session: {sessionId.slice(-8)}</div>
      <div>Tracked: {analytics.length} URLs</div>
      <div>Backups: {urlBackups.length} configured</div>
      <button 
        onClick={exportAnalytics}
        className="mt-2 px-2 py-1 bg-blue-600 rounded text-xs hover:bg-blue-700"
      >
        Export Analytics
      </button>
    </div>
  );
}