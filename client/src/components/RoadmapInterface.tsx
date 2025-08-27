import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  MapPin, 
  Store, 
  Droplets, 
  Home, 
  Link, 
  Calendar,
  Users,
  Target,
  TrendingUp,
  Clock,
  CheckCircle,
  Circle,
  Pause
} from 'lucide-react';

interface RoadmapItem {
  id: string;
  title: string;
  category: 'retail' | 'water' | 'home' | 'integration';
  status: 'planned' | 'active' | 'complete' | 'on-hold';
  priority: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  progress: number;
  timeline: {
    start: string;
    estimated: string;
    actual?: string;
  };
  dependencies: string[];
  metadata: {
    tags: string[];
    resources: string[];
    stakeholders: string[];
  };
}

interface RoadmapData {
  items: RoadmapItem[];
  progress: {
    overall: number;
    byCategory: Record<string, number>;
    criticalPath: string[];
  };
  summary: {
    total: number;
    active: number;
    complete: number;
    planned: number;
  };
}

export default function RoadmapInterface() {
  const [roadmapData, setRoadmapData] = useState<RoadmapData | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadRoadmap();
  }, [selectedCategory]);

  const loadRoadmap = async () => {
    setIsLoading(true);
    try {
      const params = selectedCategory !== 'all' ? `?category=${selectedCategory}` : '';
      const response = await fetch(`/api/roadmap${params}`);
      const data = await response.json();
      if (data.success) {
        setRoadmapData(data.data);
      }
    } catch (error) {
      console.error('[Roadmap] Failed to load roadmap:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateProgress = async (itemId: string, progress: number) => {
    try {
      const response = await fetch(`/api/roadmap/${itemId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ progress }),
      });

      const data = await response.json();
      if (data.success) {
        loadRoadmap();
      }
    } catch (error) {
      console.error('[Roadmap] Failed to update progress:', error);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'retail': return <Store className="h-5 w-5" />;
      case 'water': return <Droplets className="h-5 w-5" />;
      case 'home': return <Home className="h-5 w-5" />;
      case 'integration': return <Link className="h-5 w-5" />;
      default: return <Circle className="h-5 w-5" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'retail': return 'text-blue-400 border-blue-400';
      case 'water': return 'text-cyan-400 border-cyan-400';
      case 'home': return 'text-green-400 border-green-400';
      case 'integration': return 'text-purple-400 border-purple-400';
      default: return 'text-gray-400 border-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'complete': return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'active': return <TrendingUp className="h-4 w-4 text-blue-400" />;
      case 'on-hold': return <Pause className="h-4 w-4 text-yellow-400" />;
      default: return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-600 text-white';
      case 'high': return 'bg-orange-600 text-white';
      case 'medium': return 'bg-yellow-600 text-black';
      case 'low': return 'bg-gray-600 text-white';
      default: return 'bg-gray-600 text-white';
    }
  };

  if (!roadmapData) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <MapPin className="h-8 w-8 text-cyan-400 mx-auto mb-2 animate-pulse" />
          <p className="text-gray-400">Loading roadmap...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Roadmap Header */}
      <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-cyan-500/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-cyan-400">
            <MapPin className="h-6 w-6" />
            VaultMesh Roadmap - Retail, Water, Home Integration
          </CardTitle>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-400" />
              <span className="text-green-400 font-medium">{roadmapData.progress.overall}% Complete</span>
            </div>
            <Badge variant="outline" className="text-blue-400 border-blue-400">
              {roadmapData.summary.active} Active
            </Badge>
            <Badge variant="outline" className="text-green-400 border-green-400">
              {roadmapData.summary.complete} Complete
            </Badge>
            <Badge variant="outline" className="text-gray-400 border-gray-400">
              {roadmapData.summary.planned} Planned
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Overall Progress */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-300">Overall Progress</span>
                <span className="text-cyan-400 font-mono">{roadmapData.progress.overall}%</span>
              </div>
              <Progress value={roadmapData.progress.overall} className="h-3" />
            </div>

            {/* Category Progress */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(roadmapData.progress.byCategory).map(([category, progress]) => (
                <div key={category} className="space-y-2">
                  <div className="flex items-center gap-2">
                    {getCategoryIcon(category)}
                    <span className="text-sm text-gray-300 capitalize">{category}</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                  <span className="text-xs text-gray-400">{progress}%</span>
                </div>
              ))}
            </div>

            {/* Category Filter */}
            <div className="flex gap-2 flex-wrap">
              {['all', 'retail', 'water', 'home', 'integration'].map((category) => (
                <Button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  variant={selectedCategory === category ? 'default' : 'outline'}
                  size="sm"
                  className={selectedCategory === category ? 'bg-cyan-600' : 'border-gray-600'}
                  data-testid={`filter-${category}`}
                >
                  {category === 'all' ? 'All' : category.charAt(0).toUpperCase() + category.slice(1)}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Roadmap Items */}
      <div className="space-y-4">
        {roadmapData.items.map((item) => (
          <Card key={item.id} className="bg-gray-800 border-gray-600">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  {getCategoryIcon(item.category)}
                  <div>
                    <h3 className="text-white font-medium">{item.title}</h3>
                    <p className="text-sm text-gray-400">{item.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(item.status)}
                  <Badge variant="outline" className={getCategoryColor(item.category)}>
                    {item.category.toUpperCase()}
                  </Badge>
                  <Badge className={getPriorityColor(item.priority)}>
                    {item.priority.toUpperCase()}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Progress */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-300">Progress</span>
                  <span className="text-cyan-400 font-mono">{item.progress}%</span>
                </div>
                <Progress value={item.progress} className="h-2" />
                <div className="flex gap-2">
                  {[25, 50, 75, 100].map((value) => (
                    <Button
                      key={value}
                      onClick={() => updateProgress(item.id, value)}
                      size="sm"
                      variant="outline"
                      className="text-xs border-gray-600 hover:border-cyan-500"
                      data-testid={`progress-${item.id}-${value}`}
                    >
                      {value}%
                    </Button>
                  ))}
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div>
                  <span className="text-gray-400 flex items-center gap-1 mb-1">
                    <Calendar className="h-3 w-3" />
                    Timeline
                  </span>
                  <p className="text-white">Start: {new Date(item.timeline.start).toLocaleDateString()}</p>
                  <p className="text-yellow-400">Est: {new Date(item.timeline.estimated).toLocaleDateString()}</p>
                  {item.timeline.actual && (
                    <p className="text-green-400">Done: {new Date(item.timeline.actual).toLocaleDateString()}</p>
                  )}
                </div>
                
                <div>
                  <span className="text-gray-400 flex items-center gap-1 mb-1">
                    <Users className="h-3 w-3" />
                    Stakeholders
                  </span>
                  <div className="space-y-1">
                    {item.metadata.stakeholders.slice(0, 3).map((stakeholder, index) => (
                      <p key={index} className="text-purple-400">{stakeholder}</p>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-gray-400 flex items-center gap-1 mb-1">
                    <Target className="h-3 w-3" />
                    Resources
                  </span>
                  <div className="space-y-1">
                    {item.metadata.resources.slice(0, 3).map((resource, index) => (
                      <p key={index} className="text-blue-400">{resource}</p>
                    ))}
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div className="flex gap-1 flex-wrap">
                {item.metadata.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs text-gray-300 border-gray-500">
                    {tag}
                  </Badge>
                ))}
              </div>

              {/* Dependencies */}
              {item.dependencies.length > 0 && (
                <div className="mt-3 p-2 bg-gray-700 rounded border border-gray-600">
                  <span className="text-xs text-gray-400">Dependencies:</span>
                  <div className="flex gap-1 flex-wrap mt-1">
                    {item.dependencies.map((dep, index) => (
                      <Badge key={index} variant="outline" className="text-xs text-orange-400 border-orange-400">
                        {dep}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Critical Path Warning */}
              {roadmapData.progress.criticalPath.includes(item.id) && (
                <div className="p-2 bg-red-900/30 border border-red-500/50 rounded">
                  <p className="text-red-400 text-xs font-medium">⚠️ Critical Path - Blocking other items</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Roadmap Info */}
      <Card className="bg-gray-800 border-gray-600">
        <CardContent className="p-4">
          <div className="text-sm text-gray-400 space-y-2">
            <p><strong className="text-cyan-400">Roadmap Vision:</strong> Complete integration of retail, roadside water, and home systems</p>
            <p><strong className="text-blue-400">Current Focus:</strong> FAA retail infrastructure with brand protection and inventory management</p>
            <p><strong className="text-cyan-400">Next Phase:</strong> Roadside water afslaan system deployment and monitoring</p>
            <p><strong className="text-green-400">End Goal:</strong> Unified home integration platform connecting all systems</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}