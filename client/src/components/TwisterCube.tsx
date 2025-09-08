import React, { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';
import { 
  RotateCw, 
  RotateCcw, 
  Tornado, 
  Zap, 
  RefreshCw, 
  Box, 
  Wind,
  Activity,
  Target,
  Sparkles
} from 'lucide-react';

interface CubeSide {
  id: string;
  name: string;
  color: string;
  position: string;
  systems: CoreSystem[];
  subnodes: any[];
  teamPower: number;
  rotationSpeed: number;
  tornadoIntensity: number;
}

interface CoreSystem {
  id: string;
  name: string;
  type: string;
  status: string;
  power: number;
  rotationAngle: number;
  tornadoRadius: number;
}

interface TornadoPhysics {
  intensity: number;
  rotationSpeed: number;
  direction: string;
  windSpeed: number;
}

export default function TwisterCube() {
  const [selectedSide, setSelectedSide] = useState<string>('');
  const [tornadoIntensity, setTornadoIntensity] = useState([5]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const queryClient = useQueryClient();

  // Fetch cube status
  const { data: cubeData, isLoading } = useQuery({
    queryKey: ['/api/twister-cube/status'],
    refetchInterval: 2000, // Update every 2 seconds for real-time effects
  }) as { data?: { data?: { sides: CubeSide[], summary?: any, tornadoPhysics?: TornadoPhysics } }, isLoading: boolean };

  // Mutations
  const activateTornado = useMutation({
    mutationFn: async (intensity: number) => {
      const response = await fetch('/api/twister-cube/tornado', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ intensity })
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/twister-cube/status'] });
    }
  });

  const rotateSide = useMutation({
    mutationFn: async ({ side, direction, degrees }: { side: string; direction: string; degrees?: number }) => {
      const response = await fetch(`/api/twister-cube/rotate/${side}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ direction, degrees })
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/twister-cube/status'] });
    }
  });

  const chaosMode = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/twister-cube/chaos', {
        method: 'POST'
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/twister-cube/status'] });
    }
  });

  const synchronize = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/twister-cube/synchronize', {
        method: 'POST'
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/twister-cube/status'] });
    }
  });

  // 3D Cube Visualization
  useEffect(() => {
    if (!canvasRef.current || !cubeData?.data?.sides) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const cubeSize = 120;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw animated background based on tornado intensity
    const tornadoIntensity = cubeData.data.tornadoPhysics?.intensity || 0;
    if (tornadoIntensity > 0) {
      // Draw tornado spirals
      for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(255, 140, 0, ${0.1 + (tornadoIntensity * 0.05)})`;
        ctx.lineWidth = 2 + (tornadoIntensity * 0.5);
        
        const spiralRadius = 50 + (i * 30);
        const angle = (Date.now() / 1000 + i) * tornadoIntensity * 0.5;
        
        for (let t = 0; t < Math.PI * 4; t += 0.1) {
          const x = centerX + Math.cos(t + angle) * (spiralRadius - t * 5);
          const y = centerY + Math.sin(t + angle) * (spiralRadius - t * 5);
          
          if (t === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
    }

    // Draw 3D cube representation
    const sides = cubeData.data.sides as CubeSide[];
    
    sides.forEach((side, index) => {
      const angle = (index * Math.PI / 3) + (Date.now() / 2000 * side.rotationSpeed * 0.01);
      const radius = cubeSize;
      
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;
      
      // Draw cube face
      ctx.beginPath();
      ctx.fillStyle = side.color + (side.tornadoIntensity > 5 ? 'CC' : '88');
      ctx.strokeStyle = side.color;
      ctx.lineWidth = 2 + (side.tornadoIntensity * 0.5);
      
      const faceSize = 60 + (side.tornadoIntensity * 5);
      ctx.fillRect(x - faceSize/2, y - faceSize/2, faceSize, faceSize);
      ctx.strokeRect(x - faceSize/2, y - faceSize/2, faceSize, faceSize);
      
      // Draw side name
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '12px Inter';
      ctx.textAlign = 'center';
      ctx.fillText(side.position.toUpperCase(), x, y - 20);
      
      // Draw power indicator
      ctx.fillText(`${side.teamPower}P`, x, y + 25);
      
      // Draw systems as smaller cubes
      side.systems.forEach((system, sysIndex) => {
        const sysAngle = angle + (sysIndex * Math.PI / 4);
        const sysRadius = 25;
        const sysX = x + Math.cos(sysAngle) * sysRadius;
        const sysY = y + Math.sin(sysAngle) * sysRadius;
        
        ctx.beginPath();
        ctx.fillStyle = getSystemStatusColor(system.status);
        ctx.fillRect(sysX - 8, sysY - 8, 16, 16);
        
        // Animate tornado mode systems
        if (system.status === 'tornado-mode') {
          const tornadoRadius = 12 + Math.sin(Date.now() / 500) * 4;
          ctx.beginPath();
          ctx.strokeStyle = '#FF8C00';
          ctx.lineWidth = 2;
          ctx.arc(sysX, sysY, tornadoRadius, 0, Math.PI * 2);
          ctx.stroke();
        }
      });
    });

    // Draw tornado eye in center if active
    if (cubeData.data.summary?.status === 'tornado-active') {
      const eyeRadius = 15 + Math.sin(Date.now() / 300) * 5;
      ctx.beginPath();
      ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
      ctx.arc(centerX, centerY, eyeRadius, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.beginPath();
      ctx.strokeStyle = '#FF8C00';
      ctx.lineWidth = 3;
      ctx.arc(centerX, centerY, eyeRadius + 5, 0, Math.PI * 2);
      ctx.stroke();
    }

  }, [cubeData]);

  const getSystemStatusColor = (status: string): string => {
    switch (status) {
      case 'tornado-mode': return '#FF4500';
      case 'rotating': return '#FFD700';
      case 'syncing': return '#00CED1';
      case 'active': return '#32CD32';
      default: return '#808080';
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'tornado-active': return 'destructive';
      case 'chaos-mode': return 'destructive';
      case 'rotating': return 'secondary';
      case 'syncing': return 'outline';
      case 'stable': return 'default';
      default: return 'secondary';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64" data-testid="loading-twister-cube">
        <div className="animate-spin">
          <Box className="h-8 w-8 text-primary" />
        </div>
      </div>
    );
  }

  const summary = cubeData?.data?.summary;
  const sides = cubeData?.data?.sides as CubeSide[] || [];
  const tornadoPhysics = cubeData?.data?.tornadoPhysics as TornadoPhysics;

  return (
    <div className="space-y-6" data-testid="twister-cube-container">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2" data-testid="title-twister-cube">
            <Tornado className="h-6 w-6 text-orange-500" />
            Twister Cube Lattice
          </h2>
          <p className="text-muted-foreground">
            Rubik's cube system with tornado mechanics - All systems in 6-sided teams
          </p>
        </div>
        <Badge variant={getStatusBadgeVariant(summary?.status)} data-testid="badge-cube-status">
          {summary?.status?.replace('-', ' ').toUpperCase()}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 3D Cube Visualization */}
        <Card data-testid="card-cube-visualization">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Box className="h-5 w-5" />
              3D Cube Lattice
            </CardTitle>
            <CardDescription>
              Real-time visualization of all 6 sides with tornado effects
            </CardDescription>
          </CardHeader>
          <CardContent>
            <canvas
              ref={canvasRef}
              width={400}
              height={300}
              className="border rounded-lg w-full"
              data-testid="canvas-cube-3d"
            />
          </CardContent>
        </Card>

        {/* Control Panel */}
        <Card data-testid="card-control-panel">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wind className="h-5 w-5" />
              Tornado Controls
            </CardTitle>
            <CardDescription>
              Control tornado intensity and cube rotations
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Tornado Intensity Slider */}
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Tornado className="h-4 w-4" />
                Tornado Intensity: {tornadoIntensity[0]}
              </label>
              <Slider
                value={tornadoIntensity}
                onValueChange={setTornadoIntensity}
                max={10}
                min={1}
                step={1}
                className="w-full"
                data-testid="slider-tornado-intensity"
              />
              <div className="flex gap-2">
                <Button
                  onClick={() => activateTornado.mutate(tornadoIntensity[0])}
                  disabled={activateTornado.isPending}
                  className="flex items-center gap-2"
                  data-testid="button-activate-tornado"
                >
                  <Tornado className="h-4 w-4" />
                  Activate Tornado
                </Button>
                <Button
                  onClick={() => chaosMode.mutate()}
                  disabled={chaosMode.isPending}
                  variant="destructive"
                  className="flex items-center gap-2"
                  data-testid="button-chaos-mode"
                >
                  <Zap className="h-4 w-4" />
                  CHAOS MODE
                </Button>
              </div>
            </div>

            {/* Synchronize Button */}
            <Button
              onClick={() => synchronize.mutate()}
              disabled={synchronize.isPending}
              variant="outline"
              className="w-full flex items-center gap-2"
              data-testid="button-synchronize"
            >
              <RefreshCw className="h-4 w-4" />
              Synchronize Cube
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Side Selection and Rotation Controls */}
      <Card data-testid="card-side-controls">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Cube Side Controls
          </CardTitle>
          <CardDescription>
            Select and rotate individual cube sides
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {sides.map((side) => (
              <Card 
                key={side.id}
                className={`cursor-pointer transition-all ${
                  selectedSide === side.id ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => setSelectedSide(side.id)}
                data-testid={`card-side-${side.position}`}
              >
                <CardContent className="p-4 text-center">
                  <div 
                    className="w-full h-20 rounded-md mb-3 flex items-center justify-center text-white font-bold"
                    style={{ backgroundColor: side.color }}
                  >
                    {side.position.toUpperCase()}
                  </div>
                  <h3 className="font-medium text-sm mb-2">{side.name}</h3>
                  <div className="space-y-1 text-xs text-muted-foreground">
                    <div>Power: {side.teamPower}</div>
                    <div>Systems: {side.systems.length}</div>
                    <div>Speed: {side.rotationSpeed}°/s</div>
                  </div>
                  <Progress 
                    value={side.tornadoIntensity * 10} 
                    className="mt-2 h-2"
                    data-testid={`progress-tornado-${side.position}`}
                  />
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Rotation Controls */}
          {selectedSide && (
            <div className="mt-6 p-4 bg-muted rounded-lg" data-testid="rotation-controls">
              <h4 className="font-medium mb-3">
                Rotate {sides.find(s => s.id === selectedSide)?.name}
              </h4>
              <div className="flex gap-2">
                <Button
                  onClick={() => rotateSide.mutate({ 
                    side: selectedSide, 
                    direction: 'clockwise',
                    degrees: 90
                  })}
                  disabled={rotateSide.isPending}
                  className="flex items-center gap-2"
                  data-testid="button-rotate-clockwise"
                >
                  <RotateCw className="h-4 w-4" />
                  Clockwise 90°
                </Button>
                <Button
                  onClick={() => rotateSide.mutate({ 
                    side: selectedSide, 
                    direction: 'counterclockwise',
                    degrees: 90
                  })}
                  disabled={rotateSide.isPending}
                  className="flex items-center gap-2"
                  data-testid="button-rotate-counterclockwise"
                >
                  <RotateCcw className="h-4 w-4" />
                  Counter 90°
                </Button>
                <Button
                  onClick={() => rotateSide.mutate({ 
                    side: selectedSide, 
                    direction: 'clockwise',
                    degrees: 180
                  })}
                  disabled={rotateSide.isPending}
                  variant="outline"
                  className="flex items-center gap-2"
                  data-testid="button-rotate-180"
                >
                  <Sparkles className="h-4 w-4" />
                  180° Flip
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* System Status Grid */}
      <Card data-testid="card-system-status">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            System Status Overview
          </CardTitle>
          <CardDescription>
            Real-time status of all {summary?.totalSystems} systems across 6 cube sides
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sides.map((side) => (
              <div key={side.id} className="space-y-2" data-testid={`system-list-${side.position}`}>
                <h4 className="font-medium text-sm flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: side.color }}
                  />
                  {side.name}
                </h4>
                {side.systems.map((system) => (
                  <div 
                    key={system.id}
                    className="flex items-center justify-between p-2 bg-muted rounded text-xs"
                    data-testid={`system-${system.id}`}
                  >
                    <span>{system.name}</span>
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant={system.status === 'tornado-mode' ? 'destructive' : 'secondary'}
                        className="text-xs"
                      >
                        {system.status}
                      </Badge>
                      <span>{system.power}P</span>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}