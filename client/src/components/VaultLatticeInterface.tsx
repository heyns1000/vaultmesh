import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Box, 
  Grid3x3, 
  Upload, 
  Zap, 
  Eye, 
  Layers,
  Sparkles,
  Play,
  CheckCircle,
  DollarSign
} from 'lucide-react';

interface VaultCube {
  id: string;
  position: [number, number, number];
  htmlContent: string;
  renderState: 'raw' | 'processed' | 'cleaned' | 'perfect';
  aiLogicFiat: number;
  timestamp: string;
  metadata: {
    size: number;
    complexity: number;
    cleaningLevel: number;
    bulkStatus: 'pending' | 'processing' | 'complete';
  };
}

interface LatticeGrid {
  id: string;
  name: string;
  dimensions: [number, number, number];
  cubes: VaultCube[];
  totalFiat: number;
  status: 'building' | 'active' | 'processing' | 'complete';
}

export default function VaultLatticeInterface() {
  const [html1, setHtml1] = useState('');
  const [html2, setHtml2] = useState('');
  const [lattice, setLattice] = useState<LatticeGrid | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedCube, setSelectedCube] = useState<string | null>(null);

  useEffect(() => {
    loadLattice();
  }, []);

  const loadLattice = async () => {
    try {
      const response = await fetch('/api/vault-lattice/vault-lattice-primary');
      const data = await response.json();
      if (data.success) {
        setLattice(data.data);
      }
    } catch (error) {
      console.error('[VaultLattice] Failed to load lattice:', error);
    }
  };

  const intakeHTMLx2 = async () => {
    if (!html1.trim() || !html2.trim()) return;

    setIsProcessing(true);
    try {
      const response = await fetch('/api/vault-lattice/intake', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          html1,
          html2,
          latticeId: 'vault-lattice-primary'
        }),
      });

      const data = await response.json();
      if (data.success) {
        console.log('[VaultLattice] HTML x2 intake successful');
        loadLattice();
        setHtml1('');
        setHtml2('');
      }
    } catch (error) {
      console.error('[VaultLattice] HTML intake failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const processBulkAI = async () => {
    try {
      const response = await fetch('/api/vault-lattice/process-bulk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          latticeId: 'vault-lattice-primary'
        }),
      });

      const data = await response.json();
      if (data.success) {
        console.log('[VaultLattice] Bulk AI processing initiated');
        loadLattice();
      }
    } catch (error) {
      console.error('[VaultLattice] Bulk processing failed:', error);
    }
  };

  const renderCubePerfect = (cubeId: string) => {
    const url = `/api/vault-lattice/render/${cubeId}/vault-lattice-primary`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const getRenderStateColor = (state: string) => {
    switch (state) {
      case 'raw': return 'bg-red-600';
      case 'processed': return 'bg-yellow-600';
      case 'cleaned': return 'bg-blue-600';
      case 'perfect': return 'bg-green-600';
      default: return 'bg-gray-600';
    }
  };

  const getBulkStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-400 border-yellow-400';
      case 'processing': return 'text-blue-400 border-blue-400';
      case 'complete': return 'text-green-400 border-green-400';
      default: return 'text-gray-400 border-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Cube Lattice Header */}
      <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-cyan-500/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-cyan-400">
            <Grid3x3 className="h-6 w-6" />
            Vault Lattice Cube System - HTML x2 Intake & AI Logic
          </CardTitle>
          {lattice && (
            <div className="flex items-center gap-4 text-sm">
              <Badge variant="outline" className="text-cyan-400 border-cyan-400">
                Grid: {lattice.dimensions.join(' × ')}
              </Badge>
              <Badge 
                variant={lattice.status === 'complete' ? 'default' : 'outline'}
                className={lattice.status === 'complete' ? 'bg-green-600' : 'text-yellow-400 border-yellow-400'}
              >
                {lattice.status.toUpperCase()}
              </Badge>
              <div className="flex items-center gap-1">
                <DollarSign className="h-4 w-4 text-green-400" />
                <span className="text-green-400 font-mono">{lattice.totalFiat.toFixed(2)}</span>
              </div>
              <span className="text-gray-400">{lattice.cubes.length} cubes</span>
            </div>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          {/* HTML x2 Intake */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">HTML Input 1</label>
              <Textarea
                value={html1}
                onChange={(e) => setHtml1(e.target.value)}
                placeholder="Paste HTML content here - will be rendered as-is..."
                className="bg-gray-800 border-gray-600 text-white min-h-[150px] font-mono text-xs"
                data-testid="html1-input"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">HTML Input 2</label>
              <Textarea
                value={html2}
                onChange={(e) => setHtml2(e.target.value)}
                placeholder="Paste HTML content here - will be rendered as-is..."
                className="bg-gray-800 border-gray-600 text-white min-h-[150px] font-mono text-xs"
                data-testid="html2-input"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              onClick={intakeHTMLx2}
              disabled={isProcessing || !html1.trim() || !html2.trim()}
              className="bg-cyan-600 hover:bg-cyan-700"
              data-testid="intake-html"
            >
              {isProcessing ? (
                <>
                  <Sparkles className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Intake HTML x2
                </>
              )}
            </Button>
            
            {lattice && lattice.cubes.length > 0 && (
              <Button
                onClick={processBulkAI}
                variant="outline"
                className="border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white"
                data-testid="process-bulk-ai"
              >
                <Zap className="h-4 w-4 mr-2" />
                Process Bulk AI Logic
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Lattice Grid Display */}
      {lattice && lattice.cubes.length > 0 && (
        <Card className="bg-gray-800 border-gray-600">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Layers className="h-5 w-5" />
              Vault Cubes ({lattice.cubes.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {lattice.cubes.map((cube) => (
                <Card 
                  key={cube.id}
                  className={`bg-gray-700 border-gray-600 cursor-pointer transition-all hover:scale-105 ${
                    selectedCube === cube.id ? 'ring-2 ring-cyan-400' : ''
                  }`}
                  onClick={() => setSelectedCube(selectedCube === cube.id ? null : cube.id)}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Box className="h-4 w-4 text-cyan-400" />
                        <span className="text-white text-sm font-mono">
                          [{cube.position.join(',')}]
                        </span>
                      </div>
                      <div className={`w-3 h-3 rounded-full ${getRenderStateColor(cube.renderState)}`} />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-400">Render State:</span>
                        <Badge variant="outline" className={`text-xs ${getRenderStateColor(cube.renderState)} text-white`}>
                          {cube.renderState.toUpperCase()}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-400">Bulk Status:</span>
                        <Badge variant="outline" className={`text-xs ${getBulkStatusColor(cube.metadata.bulkStatus)}`}>
                          {cube.metadata.bulkStatus.toUpperCase()}
                        </Badge>
                      </div>

                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-400">AI Fiat:</span>
                        <span className="text-green-400 font-mono">{cube.aiLogicFiat.toFixed(2)}</span>
                      </div>

                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-400">Size:</span>
                        <span className="text-blue-400">{cube.metadata.size} chars</span>
                      </div>

                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-400">Complexity:</span>
                        <span className="text-purple-400">{cube.metadata.complexity}</span>
                      </div>
                    </div>

                    {cube.renderState === 'perfect' && (
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          renderCubePerfect(cube.id);
                        }}
                        size="sm"
                        className="w-full bg-green-600 hover:bg-green-700"
                        data-testid={`render-cube-${cube.id}`}
                      >
                        <Eye className="h-3 w-3 mr-2" />
                        Render Perfect
                      </Button>
                    )}

                    {selectedCube === cube.id && (
                      <div className="mt-3 p-3 bg-gray-800 rounded border border-gray-600">
                        <h4 className="text-xs font-medium text-gray-300 mb-2">HTML Preview:</h4>
                        <div className="bg-gray-900 p-2 rounded border border-gray-700 max-h-32 overflow-y-auto">
                          <pre className="text-xs text-green-400 font-mono whitespace-pre-wrap">
                            {cube.htmlContent.substring(0, 300)}
                            {cube.htmlContent.length > 300 && '...'}
                          </pre>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Instructions */}
      <Card className="bg-gray-800 border-gray-600">
        <CardContent className="p-4">
          <div className="text-sm text-gray-400 space-y-2">
            <p><strong className="text-cyan-400">Vault Lattice System:</strong> HTML x2 intake renders content exactly as-is with no modifications</p>
            <p><strong className="text-purple-400">AI Logic Fiat:</strong> Bulk processing cleans HTML while preserving perfect structure</p>
            <p><strong className="text-green-400">Perfect Render:</strong> Final output maintains exact original formatting and content</p>
            <p><strong className="text-yellow-400">Cube Positions:</strong> 3D lattice coordinates for organized content storage</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}