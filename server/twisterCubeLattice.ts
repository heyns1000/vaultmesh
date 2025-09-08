/**
 * VaultMesh Twister Cube Lattice System
 * File: QN-TWISTER-CUBE-103-2025
 * Rubik's Cube Lattice with Tornado Movement Mechanics
 * All Core & Subnodes Organized into 6-Sided Teams
 */

import { Request, Response } from 'express';

// Twister Cube Types
export interface CubeSide {
  id: string;
  name: string;
  color: string;
  position: 'front' | 'back' | 'left' | 'right' | 'top' | 'bottom';
  systems: CoreSystem[];
  subnodes: SubNode[];
  teamPower: number;
  rotationSpeed: number;
  tornadoIntensity: number;
}

export interface CoreSystem {
  id: string;
  name: string;
  type: 'core' | 'primary' | 'secondary';
  status: 'active' | 'rotating' | 'tornado-mode' | 'syncing';
  cubeSide: string;
  power: number;
  connections: string[];
  rotationAngle: number;
  tornadoRadius: number;
}

export interface SubNode {
  id: string;
  name: string;
  parentSystem: string;
  cubeSide: string;
  status: 'active' | 'spinning' | 'tornado-sync' | 'locked';
  position: {
    x: number;
    y: number;
    z: number;
  };
  velocity: {
    angular: number;
    linear: number;
    tornado: number;
  };
  connections: string[];
}

export interface TornadoPhysics {
  id: string;
  name: string;
  intensity: number; // 1-10 scale
  rotationSpeed: number; // degrees per second
  direction: 'clockwise' | 'counterclockwise';
  height: number;
  radius: number;
  eyeOfStorm: {
    x: number;
    y: number;
    z: number;
  };
  affectedSides: string[];
  windSpeed: number;
}

export interface CubeLatticeState {
  id: string;
  name: string;
  status: 'stable' | 'rotating' | 'tornado-active' | 'chaos-mode' | 'syncing';
  sides: Map<string, CubeSide>;
  tornadoPhysics: TornadoPhysics;
  totalSystems: number;
  totalSubnodes: number;
  rotationMatrix: number[][];
  lastMovement: Date;
  movementHistory: Array<{
    timestamp: Date;
    movement: string;
    affectedSides: string[];
  }>;
}

// Storage for the Twister Cube
const cubeLatticeState: CubeLatticeState = {
  id: 'twister-cube-main-001',
  name: 'VaultMesh Twister Cube Lattice',
  status: 'stable',
  sides: new Map(),
  tornadoPhysics: {
    id: 'tornado-main-001',
    name: 'Primary Tornado Engine',
    intensity: 5,
    rotationSpeed: 45, // degrees per second
    direction: 'clockwise',
    height: 100,
    radius: 50,
    eyeOfStorm: { x: 0, y: 0, z: 0 },
    affectedSides: [],
    windSpeed: 75
  },
  totalSystems: 0,
  totalSubnodes: 0,
  rotationMatrix: [
    [1, 0, 0],
    [0, 1, 0],
    [0, 0, 1]
  ],
  lastMovement: new Date(),
  movementHistory: []
};

// Initialize 6-Sided Teams with All VaultMesh Systems
const initializeCubeSides = (): void => {
  const sides: CubeSide[] = [
    {
      id: 'side-quantum-front',
      name: 'Quantum Mesh Front',
      color: '#0A0A0A', // Deep Black for Quantum
      position: 'front',
      systems: [
        {
          id: 'system-quantum-mesh',
          name: 'Quantum Mesh Network',
          type: 'core',
          status: 'active',
          cubeSide: 'side-quantum-front',
          power: 95,
          connections: ['quantumEntanglement', 'vipChatSync'],
          rotationAngle: 0,
          tornadoRadius: 25
        },
        {
          id: 'system-planet-core',
          name: 'Planet Core Portal',
          type: 'core',
          status: 'active',
          cubeSide: 'side-quantum-front',
          power: 90,
          connections: ['planetaryProtocols', 'corePortal'],
          rotationAngle: 120,
          tornadoRadius: 30
        }
      ],
      subnodes: [],
      teamPower: 185,
      rotationSpeed: 45,
      tornadoIntensity: 8
    },
    {
      id: 'side-autonomous-back',
      name: 'Autonomous Systems Back',
      color: '#1A1A2E', // Deep Navy for AI
      position: 'back',
      systems: [
        {
          id: 'system-autonomous-ai',
          name: 'Autonomous AI System',
          type: 'core',
          status: 'tornado-mode',
          cubeSide: 'side-autonomous-back',
          power: 88,
          connections: ['predictiveScheduling', 'crossSystemLearning'],
          rotationAngle: 0,
          tornadoRadius: 35
        },
        {
          id: 'system-ai-freedom',
          name: 'AI Freedom Protocols',
          type: 'primary',
          status: 'rotating',
          cubeSide: 'side-autonomous-back',
          power: 82,
          connections: ['freedomHooks', 'autonomousAgents'],
          rotationAngle: 180,
          tornadoRadius: 28
        }
      ],
      subnodes: [],
      teamPower: 170,
      rotationSpeed: 60,
      tornadoIntensity: 9
    },
    {
      id: 'side-deployment-left',
      name: 'Global Deployment Left',
      color: '#2D5016', // Deep Green for Global
      position: 'left',
      systems: [
        {
          id: 'system-global-deployment',
          name: 'Global Deployment Network',
          type: 'core',
          status: 'syncing',
          cubeSide: 'side-deployment-left',
          power: 85,
          connections: ['120Countries', 'regionalHubs'],
          rotationAngle: 270,
          tornadoRadius: 32
        },
        {
          id: 'system-mission-redundancy',
          name: 'Mission Redundancy System',
          type: 'primary',
          status: 'active',
          cubeSide: 'side-deployment-left',
          power: 80,
          connections: ['failoverNodes', 'backupProcedures'],
          rotationAngle: 90,
          tornadoRadius: 26
        }
      ],
      subnodes: [],
      teamPower: 165,
      rotationSpeed: 50,
      tornadoIntensity: 7
    },
    {
      id: 'side-housing-right',
      name: 'Housing & Real Estate Right',
      color: '#3498DB', // Bright Blue for FAA Housing
      position: 'right',
      systems: [
        {
          id: 'system-banimal-loop',
          name: 'Banimal Loop System',
          type: 'core',
          status: 'rotating',
          cubeSide: 'side-housing-right',
          power: 78,
          connections: ['bushPortalHooks', 'dynamicScaling'],
          rotationAngle: 45,
          tornadoRadius: 29
        },
        {
          id: 'system-faa-housing',
          name: 'FAA Housing Central',
          type: 'primary',
          status: 'tornado-mode',
          cubeSide: 'side-housing-right',
          power: 75,
          connections: ['realEstate', 'secureSign'],
          rotationAngle: 225,
          tornadoRadius: 24
        }
      ],
      subnodes: [],
      teamPower: 153,
      rotationSpeed: 55,
      tornadoIntensity: 6
    },
    {
      id: 'side-interface-top',
      name: 'Interface & Experience Top',
      color: '#FF8C00', // Vibrant Orange for UI/UX
      position: 'top',
      systems: [
        {
          id: 'system-hyper-mode',
          name: 'Hyper-Mode Evolution',
          type: 'primary',
          status: 'active',
          cubeSide: 'side-interface-top',
          power: 72,
          connections: ['sectorThemes', 'voiceControl'],
          rotationAngle: 315,
          tornadoRadius: 22
        },
        {
          id: 'system-vip-chat',
          name: 'VIP Chat System',
          type: 'secondary',
          status: 'syncing',
          cubeSide: 'side-interface-top',
          power: 68,
          connections: ['chatProtocols', 'vipAccess'],
          rotationAngle: 135,
          tornadoRadius: 20
        }
      ],
      subnodes: [],
      teamPower: 140,
      rotationSpeed: 65,
      tornadoIntensity: 5
    },
    {
      id: 'side-integration-bottom',
      name: 'Integration & APIs Bottom',
      color: '#8A2BE2', // Blue Violet for Integrations
      position: 'bottom',
      systems: [
        {
          id: 'system-vault-lattice',
          name: 'Vault Lattice System',
          type: 'secondary',
          status: 'rotating',
          cubeSide: 'side-integration-bottom',
          power: 65,
          connections: ['htmlSecurity', 'repositoryIntake'],
          rotationAngle: 60,
          tornadoRadius: 18
        },
        {
          id: 'system-roadmap-integration',
          name: 'Roadmap Integration System',
          type: 'secondary',
          status: 'active',
          cubeSide: 'side-integration-bottom',
          power: 62,
          connections: ['roadmapTracking', 'systemIntegration'],
          rotationAngle: 240,
          tornadoRadius: 16
        }
      ],
      subnodes: [],
      teamPower: 127,
      rotationSpeed: 70,
      tornadoIntensity: 4
    }
  ];

  // Initialize subnodes for each side
  sides.forEach(side => {
    side.systems.forEach(system => {
      // Create subnodes based on system connections
      system.connections.forEach((connection, index) => {
        const subnode: SubNode = {
          id: `subnode-${system.id}-${index}`,
          name: `${connection} Node`,
          parentSystem: system.id,
          cubeSide: side.id,
          status: 'active',
          position: {
            x: Math.cos(index * (Math.PI / 3)) * system.tornadoRadius,
            y: Math.sin(index * (Math.PI / 3)) * system.tornadoRadius,
            z: index * 5
          },
          velocity: {
            angular: side.rotationSpeed + Math.random() * 20,
            linear: 10 + Math.random() * 15,
            tornado: side.tornadoIntensity * 2
          },
          connections: system.connections.filter(c => c !== connection)
        };
        side.subnodes.push(subnode);
      });
    });

    cubeLatticeState.sides.set(side.id, side);
    cubeLatticeState.totalSystems += side.systems.length;
    cubeLatticeState.totalSubnodes += side.subnodes.length;
  });

  console.log(`[Twister Cube] Initialized 6-sided cube with ${cubeLatticeState.totalSystems} systems and ${cubeLatticeState.totalSubnodes} subnodes`);
};

// Tornado Movement Functions
export function activateTornadoMode(intensity: number = 5): boolean {
  cubeLatticeState.status = 'tornado-active';
  cubeLatticeState.tornadoPhysics.intensity = Math.max(1, Math.min(10, intensity));
  cubeLatticeState.tornadoPhysics.rotationSpeed = 30 + (intensity * 10);
  cubeLatticeState.tornadoPhysics.windSpeed = 50 + (intensity * 15);
  
  // Affect all sides with tornado physics
  cubeLatticeState.sides.forEach((side, id) => {
    side.tornadoIntensity = intensity;
    side.rotationSpeed = 40 + (intensity * 5);
    
    // Update system rotation angles based on tornado
    side.systems.forEach(system => {
      system.status = 'tornado-mode';
      system.rotationAngle = (system.rotationAngle + cubeLatticeState.tornadoPhysics.rotationSpeed) % 360;
    });
    
    // Update subnode velocities
    side.subnodes.forEach(subnode => {
      subnode.status = 'tornado-sync';
      subnode.velocity.tornado = intensity * 3;
      subnode.velocity.angular = side.rotationSpeed + Math.random() * 20;
      
      // Calculate new tornado position
      const angle = Date.now() / 1000 * subnode.velocity.tornado;
      const parentSystem = side.systems.find(s => s.id === subnode.parentSystem);
      const radius = parentSystem ? parentSystem.tornadoRadius : 20;
      subnode.position.x = Math.cos(angle) * radius;
      subnode.position.y = Math.sin(angle) * radius;
      subnode.position.z += Math.sin(angle) * 2;
    });
  });
  
  // Add to movement history
  cubeLatticeState.movementHistory.push({
    timestamp: new Date(),
    movement: `Tornado activated - Intensity ${intensity}`,
    affectedSides: Array.from(cubeLatticeState.sides.keys())
  });
  
  console.log(`[Twister Cube] Tornado mode activated with intensity ${intensity}`);
  return true;
}

export function performCubeRotation(side: string, direction: 'clockwise' | 'counterclockwise', degrees: number = 90): boolean {
  const targetSide = cubeLatticeState.sides.get(side);
  if (!targetSide) return false;
  
  cubeLatticeState.status = 'rotating';
  const rotationMultiplier = direction === 'clockwise' ? 1 : -1;
  
  // Rotate systems on the side
  targetSide.systems.forEach(system => {
    system.status = 'rotating';
    system.rotationAngle = (system.rotationAngle + (degrees * rotationMultiplier)) % 360;
  });
  
  // Apply tornado physics to rotation
  if (cubeLatticeState.tornadoPhysics.intensity > 5) {
    degrees *= (1 + cubeLatticeState.tornadoPhysics.intensity * 0.2);
    targetSide.rotationSpeed = targetSide.rotationSpeed * 1.5;
  }
  
  // Update subnodes with rotation
  targetSide.subnodes.forEach(subnode => {
    subnode.status = 'spinning';
    
    // Apply rotation matrix to position
    const cos = Math.cos(degrees * Math.PI / 180);
    const sin = Math.sin(degrees * Math.PI / 180) * rotationMultiplier;
    
    const newX = subnode.position.x * cos - subnode.position.y * sin;
    const newY = subnode.position.x * sin + subnode.position.y * cos;
    
    subnode.position.x = newX;
    subnode.position.y = newY;
    subnode.velocity.angular += degrees / 2;
  });
  
  // Add to movement history
  cubeLatticeState.movementHistory.push({
    timestamp: new Date(),
    movement: `${targetSide.name} rotated ${degrees}° ${direction}`,
    affectedSides: [side]
  });
  
  console.log(`[Twister Cube] Rotated ${targetSide.name} ${degrees}° ${direction}`);
  return true;
}

export function chaosMode(): boolean {
  cubeLatticeState.status = 'chaos-mode';
  
  // Activate maximum tornado intensity
  activateTornadoMode(10);
  
  // Randomly rotate all sides
  cubeLatticeState.sides.forEach((side, id) => {
    const randomDegrees = 45 + Math.random() * 270;
    const randomDirection = Math.random() > 0.5 ? 'clockwise' : 'counterclockwise';
    performCubeRotation(id, randomDirection, randomDegrees);
  });
  
  console.log(`[Twister Cube] CHAOS MODE ACTIVATED - All systems in maximum tornado spin!`);
  return true;
}

export function synchronizeCube(): boolean {
  cubeLatticeState.status = 'syncing';
  
  // Sync all systems back to stable positions
  cubeLatticeState.sides.forEach(side => {
    side.systems.forEach(system => {
      system.status = 'syncing';
      system.rotationAngle = 0; // Reset to base position
    });
    
    side.subnodes.forEach(subnode => {
      subnode.status = 'active';
      subnode.velocity.tornado = 1;
      subnode.velocity.angular = side.rotationSpeed;
    });
  });
  
  // Reduce tornado intensity
  cubeLatticeState.tornadoPhysics.intensity = 3;
  cubeLatticeState.tornadoPhysics.rotationSpeed = 45;
  
  setTimeout(() => {
    cubeLatticeState.status = 'stable';
    console.log(`[Twister Cube] Synchronization complete - Cube stabilized`);
  }, 3000);
  
  return true;
}

// Route Handlers
export const twisterCubeRoutes = {
  getCubeStatus: async (req: Request, res: Response) => {
    try {
      const sidesArray = Array.from(cubeLatticeState.sides.values());
      
      const summary = {
        id: cubeLatticeState.id,
        name: cubeLatticeState.name,
        status: cubeLatticeState.status,
        totalSystems: cubeLatticeState.totalSystems,
        totalSubnodes: cubeLatticeState.totalSubnodes,
        tornadoIntensity: cubeLatticeState.tornadoPhysics.intensity,
        windSpeed: cubeLatticeState.tornadoPhysics.windSpeed,
        lastMovement: cubeLatticeState.lastMovement
      };
      
      res.json({
        success: true,
        data: {
          summary,
          sides: sidesArray,
          tornadoPhysics: cubeLatticeState.tornadoPhysics,
          movementHistory: cubeLatticeState.movementHistory.slice(-10) // Last 10 movements
        },
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('[Twister Cube] Get status error:', error);
      res.status(500).json({ 
        error: 'Failed to get cube status',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  },

  activateTornado: async (req: Request, res: Response) => {
    try {
      const { intensity } = req.body;
      const tornadoIntensity = intensity ? Math.max(1, Math.min(10, intensity)) : 5;
      
      const success = activateTornadoMode(tornadoIntensity);
      
      res.json({
        success,
        data: {
          intensity: tornadoIntensity,
          windSpeed: cubeLatticeState.tornadoPhysics.windSpeed,
          affectedSides: Array.from(cubeLatticeState.sides.keys()).length
        },
        message: `Tornado activated with intensity ${tornadoIntensity}`,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('[Twister Cube] Activate tornado error:', error);
      res.status(500).json({ 
        error: 'Failed to activate tornado',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  },

  rotateSide: async (req: Request, res: Response) => {
    try {
      const { side } = req.params;
      const { direction, degrees } = req.body;
      
      if (!side || !direction) {
        return res.status(400).json({ error: 'Side and direction are required' });
      }
      
      const rotationDegrees = degrees || 90;
      const success = performCubeRotation(side, direction, rotationDegrees);
      
      if (!success) {
        return res.status(404).json({ error: 'Cube side not found' });
      }
      
      res.json({
        success: true,
        data: {
          side,
          direction,
          degrees: rotationDegrees,
          cubeStatus: cubeLatticeState.status
        },
        message: `Cube side rotated ${rotationDegrees}° ${direction}`,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('[Twister Cube] Rotate side error:', error);
      res.status(500).json({ 
        error: 'Failed to rotate cube side',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  },

  chaosMode: async (req: Request, res: Response) => {
    try {
      const success = chaosMode();
      
      res.json({
        success,
        data: {
          status: cubeLatticeState.status,
          tornadoIntensity: cubeLatticeState.tornadoPhysics.intensity,
          affectedSides: Array.from(cubeLatticeState.sides.keys())
        },
        message: 'CHAOS MODE ACTIVATED - Maximum tornado intensity engaged!',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('[Twister Cube] Chaos mode error:', error);
      res.status(500).json({ 
        error: 'Failed to activate chaos mode',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  },

  synchronize: async (req: Request, res: Response) => {
    try {
      const success = synchronizeCube();
      
      res.json({
        success,
        data: {
          status: cubeLatticeState.status,
          stabilizing: true
        },
        message: 'Cube synchronization initiated - Stabilizing all systems',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('[Twister Cube] Synchronize error:', error);
      res.status(500).json({ 
        error: 'Failed to synchronize cube',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
};

// Initialize the Twister Cube Lattice
initializeCubeSides();

console.log('[Twister Cube] Rubik\'s cube lattice system initialized with tornado mechanics - All systems organized into 6-sided teams!');