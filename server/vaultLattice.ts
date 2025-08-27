/**
 * VaultMesh Cube Lattice Vault System
 * File: QN-VAULT-LATTICE-093-2025
 * HTML Intake x2 Render System - AI Logic Fiat Processing
 */

import { Request, Response } from 'express';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

// Cube Lattice Types
export interface VaultCube {
  id: string;
  position: [number, number, number]; // x, y, z coordinates
  htmlContent: string;
  renderState: 'raw' | 'processed' | 'cleaned' | 'perfect';
  aiLogicFiat: number;
  timestamp: Date;
  metadata: {
    size: number;
    complexity: number;
    cleaningLevel: number;
    bulkStatus: 'pending' | 'processing' | 'complete';
  };
}

export interface LatticeGrid {
  id: string;
  name: string;
  dimensions: [number, number, number]; // width, height, depth
  cubes: Map<string, VaultCube>;
  totalFiat: number;
  status: 'building' | 'active' | 'processing' | 'complete';
}

// Vault Lattice Storage
const vaultLattices: Map<string, LatticeGrid> = new Map();
const htmlIntakeQueue: Array<{ html: string; cubeId: string; latticeId: string }> = [];

// Initialize default lattice
const defaultLattice: LatticeGrid = {
  id: 'vault-lattice-primary',
  name: 'Primary Vault Lattice',
  dimensions: [10, 10, 10],
  cubes: new Map(),
  totalFiat: 0,
  status: 'building'
};
vaultLattices.set('vault-lattice-primary', defaultLattice);

// Cube Lattice Functions
export function createVaultCube(
  latticeId: string, 
  position: [number, number, number], 
  htmlContent: string
): VaultCube {
  const cubeId = `cube-${position[0]}-${position[1]}-${position[2]}-${Date.now()}`;
  
  const cube: VaultCube = {
    id: cubeId,
    position,
    htmlContent,
    renderState: 'raw',
    aiLogicFiat: Math.random() * 1000, // Random fiat value for AI processing
    timestamp: new Date(),
    metadata: {
      size: htmlContent.length,
      complexity: calculateComplexity(htmlContent),
      cleaningLevel: 0,
      bulkStatus: 'pending'
    }
  };

  const lattice = vaultLattices.get(latticeId);
  if (lattice) {
    lattice.cubes.set(cubeId, cube);
    lattice.totalFiat += cube.aiLogicFiat;
    console.log(`[VaultLattice] Created cube ${cubeId} at position [${position.join(',')}]`);
  }

  return cube;
}

export function calculateComplexity(html: string): number {
  const tagCount = (html.match(/<[^>]+>/g) || []).length;
  const scriptCount = (html.match(/<script/gi) || []).length;
  const styleCount = (html.match(/<style/gi) || []).length;
  const classCount = (html.match(/class=/gi) || []).length;
  
  return tagCount + (scriptCount * 5) + (styleCount * 3) + (classCount * 2);
}

export function processHTMLIntake(html1: string, html2: string, latticeId: string = 'vault-lattice-primary'): {
  cube1: VaultCube;
  cube2: VaultCube;
  processing: boolean;
} {
  const lattice = vaultLattices.get(latticeId);
  if (!lattice) {
    throw new Error(`Lattice ${latticeId} not found`);
  }

  // Find next available positions in the lattice
  const nextPos1 = findNextPosition(lattice);
  const nextPos2 = findNextPosition(lattice, nextPos1);

  // Create cubes for both HTML inputs
  const cube1 = createVaultCube(latticeId, nextPos1, html1);
  const cube2 = createVaultCube(latticeId, nextPos2, html2);

  // Add to processing queue
  htmlIntakeQueue.push(
    { html: html1, cubeId: cube1.id, latticeId },
    { html: html2, cubeId: cube2.id, latticeId }
  );

  console.log(`[VaultLattice] HTML x2 intake complete - Cubes: ${cube1.id}, ${cube2.id}`);
  
  // Start bulk AI logic processing
  processBulkAILogic(latticeId);

  return {
    cube1,
    cube2,
    processing: true
  };
}

export function findNextPosition(lattice: LatticeGrid, exclude?: [number, number, number]): [number, number, number] {
  const [maxX, maxY, maxZ] = lattice.dimensions;
  
  for (let z = 0; z < maxZ; z++) {
    for (let y = 0; y < maxY; y++) {
      for (let x = 0; x < maxX; x++) {
        const pos: [number, number, number] = [x, y, z];
        
        // Skip excluded position
        if (exclude && pos[0] === exclude[0] && pos[1] === exclude[1] && pos[2] === exclude[2]) {
          continue;
        }
        
        // Check if position is occupied
        const isOccupied = Array.from(lattice.cubes.values()).some(cube => 
          cube.position[0] === x && cube.position[1] === y && cube.position[2] === z
        );
        
        if (!isOccupied) {
          return pos;
        }
      }
    }
  }
  
  // If no space, expand lattice
  return [maxX, 0, 0];
}

export function processBulkAILogic(latticeId: string): void {
  const lattice = vaultLattices.get(latticeId);
  if (!lattice) return;

  lattice.status = 'processing';
  
  // Process cubes in bulk for AI logic fiat
  Array.from(lattice.cubes.values()).forEach(cube => {
    if (cube.metadata.bulkStatus === 'pending') {
      cube.metadata.bulkStatus = 'processing';
      
      // Clean HTML content - render as-is but optimize
      const cleanedHTML = cleanHTMLContent(cube.htmlContent);
      cube.htmlContent = cleanedHTML;
      cube.renderState = 'cleaned';
      cube.metadata.cleaningLevel = 100;
      cube.metadata.bulkStatus = 'complete';
      
      console.log(`[VaultLattice] AI Logic processed cube ${cube.id} - Fiat: ${cube.aiLogicFiat.toFixed(2)}`);
    }
  });

  lattice.status = 'complete';
  console.log(`[VaultLattice] Bulk AI Logic processing complete for ${latticeId}`);
}

export function cleanHTMLContent(html: string): string {
  // Clean HTML but preserve exact structure - no modifications to content
  let cleaned = html;
  
  // Remove only dangerous scripts while preserving structure
  cleaned = cleaned.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '<!-- Script removed for security -->');
  
  // Preserve all other content exactly as-is
  return cleaned;
}

export function renderCubePerfect(cubeId: string, latticeId: string): string {
  const lattice = vaultLattices.get(latticeId);
  if (!lattice) return '';

  const cube = lattice.cubes.get(cubeId);
  if (!cube) return '';

  // Render HTML exactly as-is - perfect rendering
  const perfectHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>VaultLattice Perfect Render - ${cubeId}</title>
    <style>
        body { margin: 0; padding: 0; }
        .vault-cube-container { 
            width: 100%; 
            height: 100vh; 
            position: relative;
            background: linear-gradient(45deg, #1a1a1a, #2d2d2d);
        }
        .perfect-render { 
            width: 100%; 
            height: 100%; 
            border: none;
            background: white;
        }
    </style>
</head>
<body>
    <div class="vault-cube-container">
        <div class="perfect-render">
            ${cube.htmlContent}
        </div>
    </div>
</body>
</html>`;

  cube.renderState = 'perfect';
  return perfectHTML;
}

// Route Handlers
export const vaultLatticeRoutes = {
  // Get lattice status
  getLattice: async (req: Request, res: Response) => {
    const { latticeId = 'vault-lattice-primary' } = req.params;
    const lattice = vaultLattices.get(latticeId);
    
    if (!lattice) {
      return res.status(404).json({ error: 'Lattice not found' });
    }

    const latticeData = {
      ...lattice,
      cubes: Array.from(lattice.cubes.entries()).map(([id, cube]) => ({ id, ...cube }))
    };

    res.json({
      success: true,
      data: latticeData,
      timestamp: new Date().toISOString()
    });
  },

  // HTML x2 Intake
  htmlIntake: async (req: Request, res: Response) => {
    try {
      const { html1, html2, latticeId = 'vault-lattice-primary' } = req.body;
      
      if (!html1 || !html2) {
        return res.status(400).json({ 
          error: 'Missing required fields: html1 and html2' 
        });
      }

      const result = processHTMLIntake(html1, html2, latticeId);
      
      res.json({
        success: true,
        data: result,
        message: 'HTML x2 intake complete - AI Logic processing in bulk',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('[VaultLattice] HTML intake error:', error);
      res.status(500).json({ 
        error: 'HTML intake failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  },

  // Render cube perfect
  renderCube: async (req: Request, res: Response) => {
    try {
      const { cubeId, latticeId = 'vault-lattice-primary' } = req.params;
      
      const perfectHTML = renderCubePerfect(cubeId, latticeId);
      
      if (!perfectHTML) {
        return res.status(404).json({ error: 'Cube not found' });
      }

      res.setHeader('Content-Type', 'text/html');
      res.send(perfectHTML);
    } catch (error) {
      console.error('[VaultLattice] Cube render error:', error);
      res.status(500).json({ 
        error: 'Cube render failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  },

  // Process bulk AI logic
  processBulk: async (req: Request, res: Response) => {
    try {
      const { latticeId = 'vault-lattice-primary' } = req.body;
      
      processBulkAILogic(latticeId);
      
      res.json({
        success: true,
        message: 'Bulk AI logic processing initiated',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('[VaultLattice] Bulk processing error:', error);
      res.status(500).json({ 
        error: 'Bulk processing failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
};