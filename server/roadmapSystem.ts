/**
 * VaultMesh Roadmap System
 * File: QN-ROADMAP-SYSTEM-096-2025
 * Retail, Roadside Water, Home Integration
 */

import { Request, Response } from 'express';

// Roadmap Types
export interface RoadmapItem {
  id: string;
  title: string;
  category: 'retail' | 'water' | 'home' | 'integration';
  status: 'planned' | 'active' | 'complete' | 'on-hold';
  priority: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  progress: number; // 0-100
  timeline: {
    start: Date;
    estimated: Date;
    actual?: Date;
  };
  dependencies: string[];
  metadata: {
    tags: string[];
    resources: string[];
    stakeholders: string[];
  };
}

// Roadmap Storage
const roadmapItems: Map<string, RoadmapItem> = new Map();

// Initialize default roadmap items
const defaultRoadmapItems: RoadmapItem[] = [
  {
    id: 'faa-retail-001',
    title: '🏪 FAA Retail Infrastructure',
    category: 'retail',
    status: 'active',
    priority: 'high',
    description: 'Implement comprehensive retail system with brand protection and inventory management',
    progress: 65,
    timeline: {
      start: new Date('2025-08-01'),
      estimated: new Date('2025-09-15'),
    },
    dependencies: [],
    metadata: {
      tags: ['retail', 'brand-protection', 'inventory'],
      resources: ['VaultMesh', 'Brand Protection Hub', 'FAA Systems'],
      stakeholders: ['Retail Team', 'Brand Protection', 'FAA Operations']
    }
  },
  {
    id: 'roadside-water-001',
    title: '💧 Roadside Water Afslaan System',
    category: 'water',
    status: 'planned',
    priority: 'high',
    description: 'Deploy roadside water distribution and quality monitoring system',
    progress: 15,
    timeline: {
      start: new Date('2025-08-15'),
      estimated: new Date('2025-10-01'),
    },
    dependencies: ['faa-retail-001'],
    metadata: {
      tags: ['water-distribution', 'monitoring', 'roadside'],
      resources: ['Water Quality Sensors', 'Distribution Network', 'Mobile Units'],
      stakeholders: ['Water Management', 'Operations', 'Quality Control']
    }
  },
  {
    id: 'home-integration-001',
    title: '🏠 Home Integration Platform',
    category: 'home',
    status: 'planned',
    priority: 'medium',
    description: 'Complete home automation and integration with retail and water systems',
    progress: 5,
    timeline: {
      start: new Date('2025-09-01'),
      estimated: new Date('2025-11-15'),
    },
    dependencies: ['faa-retail-001', 'roadside-water-001'],
    metadata: {
      tags: ['home-automation', 'integration', 'smart-home'],
      resources: ['Home Automation Hub', 'IoT Devices', 'Mobile App'],
      stakeholders: ['Home Users', 'Technical Support', 'Product Team']
    }
  },
  {
    id: 'system-integration-001',
    title: '🔗 Complete System Integration',
    category: 'integration',
    status: 'planned',
    priority: 'critical',
    description: 'Integrate all systems: retail, water, and home into unified VaultMesh platform',
    progress: 0,
    timeline: {
      start: new Date('2025-10-01'),
      estimated: new Date('2025-12-01'),
    },
    dependencies: ['faa-retail-001', 'roadside-water-001', 'home-integration-001'],
    metadata: {
      tags: ['integration', 'platform', 'unified-system'],
      resources: ['VaultMesh Core', 'API Gateway', 'Data Synchronization'],
      stakeholders: ['All Teams', 'System Architecture', 'Project Management']
    }
  }
];

// Initialize roadmap
defaultRoadmapItems.forEach(item => {
  roadmapItems.set(item.id, item);
});

// Roadmap Functions
export function createRoadmapItem(item: Omit<RoadmapItem, 'id'>): RoadmapItem {
  const id = `roadmap-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  const roadmapItem: RoadmapItem = {
    id,
    ...item
  };
  
  roadmapItems.set(id, roadmapItem);
  
  console.log(`[VaultMesh Roadmap] Created item: ${roadmapItem.title}`);
  return roadmapItem;
}

export function updateRoadmapProgress(id: string, progress: number, status?: RoadmapItem['status']): boolean {
  const item = roadmapItems.get(id);
  if (!item) return false;
  
  item.progress = Math.max(0, Math.min(100, progress));
  
  if (status) {
    item.status = status;
  }
  
  // Auto-update status based on progress
  if (item.progress === 0 && item.status !== 'planned') {
    item.status = 'planned';
  } else if (item.progress > 0 && item.progress < 100 && item.status !== 'active') {
    item.status = 'active';
  } else if (item.progress === 100 && item.status !== 'complete') {
    item.status = 'complete';
    item.timeline.actual = new Date();
  }
  
  console.log(`[VaultMesh Roadmap] Updated ${item.title}: ${item.progress}% (${item.status})`);
  return true;
}

export function getRoadmapByCategory(category?: RoadmapItem['category']): RoadmapItem[] {
  const items = Array.from(roadmapItems.values());
  
  if (category) {
    return items.filter(item => item.category === category);
  }
  
  return items.sort((a, b) => {
    // Sort by priority then by timeline
    const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
    const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
    
    if (priorityDiff !== 0) return priorityDiff;
    
    return a.timeline.estimated.getTime() - b.timeline.estimated.getTime();
  });
}

export function calculateOverallProgress(): {
  overall: number;
  byCategory: Record<string, number>;
  criticalPath: string[];
} {
  const items = Array.from(roadmapItems.values());
  
  // Overall progress (weighted by priority)
  let totalWeight = 0;
  let weightedProgress = 0;
  
  const priorityWeights = { critical: 4, high: 3, medium: 2, low: 1 };
  
  items.forEach(item => {
    const weight = priorityWeights[item.priority];
    totalWeight += weight;
    weightedProgress += item.progress * weight;
  });
  
  const overall = totalWeight > 0 ? Math.round(weightedProgress / totalWeight) : 0;
  
  // Progress by category
  const categories = ['retail', 'water', 'home', 'integration'] as const;
  const byCategory: Record<string, number> = {};
  
  categories.forEach(category => {
    const categoryItems = items.filter(item => item.category === category);
    if (categoryItems.length > 0) {
      const avgProgress = categoryItems.reduce((sum, item) => sum + item.progress, 0) / categoryItems.length;
      byCategory[category] = Math.round(avgProgress);
    } else {
      byCategory[category] = 0;
    }
  });
  
  // Critical path (items blocking others)
  const criticalPath: string[] = [];
  items.forEach(item => {
    const blockingItems = items.filter(other => 
      other.dependencies.includes(item.id) && other.status !== 'complete'
    );
    
    if (blockingItems.length > 0 && item.status !== 'complete') {
      criticalPath.push(item.id);
    }
  });
  
  return { overall, byCategory, criticalPath };
}

// Route Handlers
export const roadmapRoutes = {
  // Get roadmap
  getRoadmap: async (req: Request, res: Response) => {
    try {
      const { category } = req.query;
      
      const items = getRoadmapByCategory(category as RoadmapItem['category']);
      const progress = calculateOverallProgress();
      
      res.json({
        success: true,
        data: {
          items,
          progress,
          summary: {
            total: items.length,
            active: items.filter(item => item.status === 'active').length,
            complete: items.filter(item => item.status === 'complete').length,
            planned: items.filter(item => item.status === 'planned').length
          }
        },
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('[VaultMesh Roadmap] Get roadmap error:', error);
      res.status(500).json({ 
        error: 'Failed to get roadmap',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  },

  // Update roadmap item
  updateItem: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { progress, status, notes } = req.body;
      
      const success = updateRoadmapProgress(id, progress, status);
      
      if (!success) {
        return res.status(404).json({ error: 'Roadmap item not found' });
      }
      
      const item = roadmapItems.get(id);
      
      res.json({
        success: true,
        data: item,
        message: 'Roadmap item updated successfully',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('[VaultMesh Roadmap] Update item error:', error);
      res.status(500).json({ 
        error: 'Failed to update roadmap item',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  },

  // Create roadmap item
  createItem: async (req: Request, res: Response) => {
    try {
      const itemData = req.body;
      
      // Validate required fields
      if (!itemData.title || !itemData.category || !itemData.description) {
        return res.status(400).json({ 
          error: 'Missing required fields: title, category, description' 
        });
      }
      
      const item = createRoadmapItem(itemData);
      
      res.json({
        success: true,
        data: item,
        message: 'Roadmap item created successfully',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('[VaultMesh Roadmap] Create item error:', error);
      res.status(500).json({ 
        error: 'Failed to create roadmap item',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
};