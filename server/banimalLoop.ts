/**
 * VaultMesh Banimal Loop System
 * File: QN-BANIMAL-LOOP-097-2025
 * Tea & Cookies → SecureSign → Start → Bush Portal Hooks
 */

import { Request, Response } from 'express';

// Banimal Loop Types
export interface BanimalVisitor {
  id: string;
  name: string;
  status: 'arriving' | 'tea-cookies' | 'securesign' | 'moving-to-start' | 'bush-portal' | 'completed-loop';
  entryPoint: string;
  timestamp: Date;
  payments: {
    secureSignComplete: boolean;
    amount?: number;
    currency: string;
  };
  bushPortalAssignment?: string;
}

export interface BushPortalHook {
  id: string;
  name: string;
  location: {
    nation: string;
    continent: string;
    country: string;
  };
  type: 'podcast' | 'placeholder' | 'buildnest' | 'infrastructure';
  status: 'deployed' | 'pending' | 'maintenance' | 'offline';
  tripodLeg: 1 | 2 | 3; // Which leg of the tripod
  hookCapacity: number;
  currentLoad: number;
  realEstateIntegration: boolean;
  vaultMeshConnected: boolean;
  secureSignEnabled: boolean;
}

export interface TripotInfrastructure {
  id: string;
  name: string;
  location: {
    nation: string;
    continent: string;
    country: string;
  };
  legs: {
    leg1: BushPortalHook;
    leg2: BushPortalHook;
    leg3: BushPortalHook;
  };
  stability: 'stable' | 'warning' | 'critical'; // If any leg fails, pot falls
  faaRealEstateHub: boolean;
  banimalLoopActive: boolean;
}

// Storage
const banimalVisitors: Map<string, BanimalVisitor> = new Map();
const bushPortalHooks: Map<string, BushPortalHook> = new Map();
const tripotInfrastructures: Map<string, TripotInfrastructure> = new Map();

// Initialize Default Infrastructure
const defaultBushPortals: BushPortalHook[] = [
  // North America Tripod
  {
    id: 'na-podcast-001',
    name: 'North America Podcast Hub',
    location: { nation: 'USA', continent: 'North America', country: 'United States' },
    type: 'podcast',
    status: 'deployed',
    tripodLeg: 1,
    hookCapacity: 1000,
    currentLoad: 234,
    realEstateIntegration: true,
    vaultMeshConnected: true,
    secureSignEnabled: true
  },
  {
    id: 'na-buildnest-001',
    name: 'North America BuildNest',
    location: { nation: 'Canada', continent: 'North America', country: 'Canada' },
    type: 'buildnest',
    status: 'deployed',
    tripodLeg: 2,
    hookCapacity: 500,
    currentLoad: 123,
    realEstateIntegration: true,
    vaultMeshConnected: true,
    secureSignEnabled: true
  },
  {
    id: 'na-infrastructure-001',
    name: 'North America Infrastructure',
    location: { nation: 'Mexico', continent: 'North America', country: 'Mexico' },
    type: 'infrastructure',
    status: 'deployed',
    tripodLeg: 3,
    hookCapacity: 750,
    currentLoad: 345,
    realEstateIntegration: true,
    vaultMeshConnected: true,
    secureSignEnabled: true
  },
  // Europe Tripod
  {
    id: 'eu-podcast-001',
    name: 'Europe Podcast Hub',
    location: { nation: 'Germany', continent: 'Europe', country: 'Germany' },
    type: 'podcast',
    status: 'deployed',
    tripodLeg: 1,
    hookCapacity: 800,
    currentLoad: 456,
    realEstateIntegration: true,
    vaultMeshConnected: true,
    secureSignEnabled: true
  },
  {
    id: 'eu-placeholder-001',
    name: 'Europe Placeholder Hub',
    location: { nation: 'France', continent: 'Europe', country: 'France' },
    type: 'placeholder',
    status: 'deployed',
    tripodLeg: 2,
    hookCapacity: 600,
    currentLoad: 234,
    realEstateIntegration: true,
    vaultMeshConnected: true,
    secureSignEnabled: true
  },
  {
    id: 'eu-buildnest-001',
    name: 'Europe BuildNest',
    location: { nation: 'Netherlands', continent: 'Europe', country: 'Netherlands' },
    type: 'buildnest',
    status: 'deployed',
    tripodLeg: 3,
    hookCapacity: 900,
    currentLoad: 567,
    realEstateIntegration: true,
    vaultMeshConnected: true,
    secureSignEnabled: true
  }
];

// Initialize bush portals
defaultBushPortals.forEach(portal => {
  bushPortalHooks.set(portal.id, portal);
});

// Initialize Tripot Infrastructures
const defaultTripots: TripotInfrastructure[] = [
  {
    id: 'tripot-na-001',
    name: 'North America Tripot',
    location: { nation: 'North America', continent: 'North America', country: 'Multi-National' },
    legs: {
      leg1: bushPortalHooks.get('na-podcast-001')!,
      leg2: bushPortalHooks.get('na-buildnest-001')!,
      leg3: bushPortalHooks.get('na-infrastructure-001')!
    },
    stability: 'stable',
    faaRealEstateHub: true,
    banimalLoopActive: true
  },
  {
    id: 'tripot-eu-001',
    name: 'Europe Tripot',
    location: { nation: 'Europe', continent: 'Europe', country: 'Multi-National' },
    legs: {
      leg1: bushPortalHooks.get('eu-podcast-001')!,
      leg2: bushPortalHooks.get('eu-placeholder-001')!,
      leg3: bushPortalHooks.get('eu-buildnest-001')!
    },
    stability: 'stable',
    faaRealEstateHub: true,
    banimalLoopActive: true
  }
];

defaultTripots.forEach(tripot => {
  tripotInfrastructures.set(tripot.id, tripot);
});

// Banimal Loop Functions
export function startBanimalLoop(visitorName: string, entryPoint: string = 'VaultMesh'): BanimalVisitor {
  const id = `visitor-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  const visitor: BanimalVisitor = {
    id,
    name: visitorName,
    status: 'arriving',
    entryPoint,
    timestamp: new Date(),
    payments: {
      secureSignComplete: false,
      currency: 'USD'
    }
  };
  
  banimalVisitors.set(id, visitor);
  
  console.log(`[Banimal Loop] Visitor ${visitorName} arriving at FAA Real Estate`);
  return visitor;
}

export function progressBanimalLoop(visitorId: string, nextStatus: BanimalVisitor['status']): boolean {
  const visitor = banimalVisitors.get(visitorId);
  if (!visitor) return false;
  
  visitor.status = nextStatus;
  
  // Auto-progress through stages
  if (nextStatus === 'tea-cookies') {
    console.log(`[Banimal Loop] ${visitor.name} having tea and cookies`);
  } else if (nextStatus === 'securesign') {
    console.log(`[Banimal Loop] ${visitor.name} completing SecureSign inline payments`);
  } else if (nextStatus === 'moving-to-start') {
    console.log(`[Banimal Loop] ${visitor.name} moving to Start`);
    assignBushPortal(visitorId);
  } else if (nextStatus === 'bush-portal') {
    console.log(`[Banimal Loop] ${visitor.name} connected to bush portal ${visitor.bushPortalAssignment}`);
  }
  
  return true;
}

export function assignBushPortal(visitorId: string): string | null {
  const visitor = banimalVisitors.get(visitorId);
  if (!visitor) return null;
  
  // Find best available bush portal hook
  const availablePortals = Array.from(bushPortalHooks.values()).filter(portal => 
    portal.status === 'deployed' && 
    portal.currentLoad < portal.hookCapacity &&
    portal.vaultMeshConnected &&
    portal.secureSignEnabled
  );
  
  if (availablePortals.length === 0) return null;
  
  // Assign to least loaded portal
  const selectedPortal = availablePortals.reduce((min, portal) => 
    portal.currentLoad < min.currentLoad ? portal : min
  );
  
  visitor.bushPortalAssignment = selectedPortal.id;
  selectedPortal.currentLoad++;
  
  console.log(`[Banimal Loop] Assigned ${visitor.name} to ${selectedPortal.name}`);
  return selectedPortal.id;
}

export function checkTripotStability(): Record<string, 'stable' | 'warning' | 'critical'> {
  const stability: Record<string, 'stable' | 'warning' | 'critical'> = {};
  
  tripotInfrastructures.forEach((tripot, id) => {
    const legs = [tripot.legs.leg1, tripot.legs.leg2, tripot.legs.leg3];
    const offlineLegs = legs.filter(leg => leg.status === 'offline').length;
    const maintenanceLegs = legs.filter(leg => leg.status === 'maintenance').length;
    
    if (offlineLegs > 0) {
      tripot.stability = 'critical'; // Pot falls if any leg fails
      console.log(`[Tripot] CRITICAL: ${tripot.name} has ${offlineLegs} offline legs - pot falling!`);
    } else if (maintenanceLegs > 1) {
      tripot.stability = 'warning';
    } else {
      tripot.stability = 'stable';
    }
    
    stability[id] = tripot.stability;
  });
  
  return stability;
}

export function deployBushPortalHook(
  name: string,
  location: { nation: string; continent: string; country: string },
  type: BushPortalHook['type'],
  tripodLeg: 1 | 2 | 3
): BushPortalHook {
  const id = `bush-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  const bushPortal: BushPortalHook = {
    id,
    name,
    location,
    type,
    status: 'deployed',
    tripodLeg,
    hookCapacity: 500,
    currentLoad: 0,
    realEstateIntegration: true,
    vaultMeshConnected: true,
    secureSignEnabled: true
  };
  
  bushPortalHooks.set(id, bushPortal);
  
  console.log(`[Bush Portal] Deployed ${type} hook: ${name} in ${location.country}`);
  return bushPortal;
}

// Route Handlers
export const banimalLoopRoutes = {
  // Start Banimal Loop
  startLoop: async (req: Request, res: Response) => {
    try {
      const { visitorName, entryPoint } = req.body;
      
      if (!visitorName) {
        return res.status(400).json({ error: 'Visitor name required' });
      }
      
      const visitor = startBanimalLoop(visitorName, entryPoint);
      
      res.json({
        success: true,
        data: visitor,
        message: 'Banimal loop started - visitor arriving at FAA Real Estate',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('[Banimal Loop] Start error:', error);
      res.status(500).json({ 
        error: 'Failed to start Banimal loop',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  },

  // Progress visitor through loop
  progressLoop: async (req: Request, res: Response) => {
    try {
      const { visitorId } = req.params;
      const { status } = req.body;
      
      const success = progressBanimalLoop(visitorId, status);
      
      if (!success) {
        return res.status(404).json({ error: 'Visitor not found' });
      }
      
      const visitor = banimalVisitors.get(visitorId);
      
      res.json({
        success: true,
        data: visitor,
        message: `Visitor progressed to ${status}`,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('[Banimal Loop] Progress error:', error);
      res.status(500).json({ 
        error: 'Failed to progress Banimal loop',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  },

  // Get all tripot infrastructure status
  getTripotStatus: async (req: Request, res: Response) => {
    try {
      const tripots = Array.from(tripotInfrastructures.values());
      const stability = checkTripotStability();
      const totalPortals = bushPortalHooks.size;
      const activePortals = Array.from(bushPortalHooks.values()).filter(p => p.status === 'deployed').length;
      
      res.json({
        success: true,
        data: {
          tripots,
          stability,
          summary: {
            totalTripots: tripots.length,
            stableTripots: Object.values(stability).filter(s => s === 'stable').length,
            totalPortals,
            activePortals,
            activeVisitors: banimalVisitors.size
          }
        },
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('[Banimal Loop] Tripot status error:', error);
      res.status(500).json({ 
        error: 'Failed to get tripot status',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  },

  // Deploy new bush portal hook
  deployHook: async (req: Request, res: Response) => {
    try {
      const { name, location, type, tripodLeg } = req.body;
      
      if (!name || !location || !type || !tripodLeg) {
        return res.status(400).json({ 
          error: 'Missing required fields: name, location, type, tripodLeg' 
        });
      }
      
      const bushPortal = deployBushPortalHook(name, location, type, tripodLeg);
      
      res.json({
        success: true,
        data: bushPortal,
        message: 'Bush portal hook deployed successfully',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('[Banimal Loop] Deploy hook error:', error);
      res.status(500).json({ 
        error: 'Failed to deploy bush portal hook',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  },

  // Get active visitors
  getVisitors: async (req: Request, res: Response) => {
    try {
      const visitors = Array.from(banimalVisitors.values());
      
      res.json({
        success: true,
        data: visitors,
        summary: {
          total: visitors.length,
          arriving: visitors.filter(v => v.status === 'arriving').length,
          teaCookies: visitors.filter(v => v.status === 'tea-cookies').length,
          secureSign: visitors.filter(v => v.status === 'securesign').length,
          bushPortal: visitors.filter(v => v.status === 'bush-portal').length
        },
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('[Banimal Loop] Get visitors error:', error);
      res.status(500).json({ 
        error: 'Failed to get visitors',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
};