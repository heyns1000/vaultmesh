import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  GitFork, 
  Download, 
  Eye, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  FileText,
  Globe,
  Github
} from 'lucide-react';

interface IntakeRepository {
  id: string;
  name: string;
  source: string;
  type: 'github' | 'html' | 'url';
  content: string;
  timestamp: string;
  status: 'pending' | 'processing' | 'complete' | 'error';
  metadata: {
    size: number;
    files: number;
    lastModified?: string;
  };
}

export default function RepositoryIntakeInterface() {
  const [repositories, setRepositories] = useState<string[]>([
    'heyns1000/vaultmesh.faa.zone',
    'fruitful.faa.zone/index.html'
  ]);
  const [customRepo, setCustomRepo] = useState('');
  const [intakes, setIntakes] = useState<IntakeRepository[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    loadIntakeStatus();
  }, []);

  const loadIntakeStatus = async () => {
    try {
      const response = await fetch('/api/repository-intake/status');
      const data = await response.json();
      if (data.success) {
        setIntakes(data.data);
      }
    } catch (error) {
      console.error('[Repository Intake] Failed to load status:', error);
    }
  };

  const intakeRepositories = async () => {
    if (repositories.length === 0) return;

    setIsProcessing(true);
    try {
      const response = await fetch('/api/repository-intake/intake', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ repositories }),
      });

      const data = await response.json();
      if (data.success) {
        console.log('[Repository Intake] Repositories processed successfully');
        loadIntakeStatus();
      }
    } catch (error) {
      console.error('[Repository Intake] Intake failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const addRepository = () => {
    if (customRepo.trim() && !repositories.includes(customRepo.trim())) {
      setRepositories([...repositories, customRepo.trim()]);
      setCustomRepo('');
    }
  };

  const removeRepository = (repo: string) => {
    setRepositories(repositories.filter(r => r !== repo));
  };

  const deployIntake = (intakeId: string) => {
    const url = `/api/repository-intake/deploy/${intakeId}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'github': return <Github className="h-4 w-4" />;
      case 'html': return <FileText className="h-4 w-4" />;
      case 'url': return <Globe className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'complete': return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'processing': return <Clock className="h-4 w-4 text-yellow-400 animate-spin" />;
      case 'error': return <AlertCircle className="h-4 w-4 text-red-400" />;
      default: return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'complete': return 'text-green-400 border-green-400';
      case 'processing': return 'text-yellow-400 border-yellow-400';
      case 'error': return 'text-red-400 border-red-400';
      default: return 'text-gray-400 border-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Repository Intake Header */}
      <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-blue-500/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-400">
            <GitFork className="h-6 w-6" />
            Repository Fork & Intake System
          </CardTitle>
          <p className="text-gray-400 text-sm">
            Fork repositories and intake content for VaultMesh integration
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Repository List */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-300">Target Repositories</label>
            {repositories.map((repo, index) => (
              <div key={index} className="flex items-center gap-2 p-2 bg-gray-800 rounded border border-gray-600">
                <span className="text-white font-mono text-sm flex-1">{repo}</span>
                <Button
                  onClick={() => removeRepository(repo)}
                  size="sm"
                  variant="outline"
                  className="border-red-500 text-red-400 hover:bg-red-500 hover:text-white"
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>

          {/* Add Custom Repository */}
          <div className="flex gap-2">
            <Input
              value={customRepo}
              onChange={(e) => setCustomRepo(e.target.value)}
              placeholder="Add repository (e.g., username/repo or url/file.html)"
              className="bg-gray-800 border-gray-600 text-white"
              data-testid="custom-repo-input"
              onKeyPress={(e) => e.key === 'Enter' && addRepository()}
            />
            <Button
              onClick={addRepository}
              variant="outline"
              className="border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white"
              data-testid="add-repo"
            >
              Add
            </Button>
          </div>

          {/* Intake Action */}
          <Button
            onClick={intakeRepositories}
            disabled={isProcessing || repositories.length === 0}
            className="w-full bg-blue-600 hover:bg-blue-700"
            data-testid="intake-repositories"
          >
            {isProcessing ? (
              <>
                <Download className="h-4 w-4 mr-2 animate-spin" />
                Processing Intake...
              </>
            ) : (
              <>
                <GitFork className="h-4 w-4 mr-2" />
                Fork & Intake Repositories
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Intake Status */}
      {intakes.length > 0 && (
        <Card className="bg-gray-800 border-gray-600">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Download className="h-5 w-5" />
              Intake Status ({intakes.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {intakes.map((intake) => (
                <Card key={intake.id} className="bg-gray-700 border-gray-600">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        {getTypeIcon(intake.type)}
                        <h4 className="text-white font-medium">{intake.name}</h4>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(intake.status)}
                        <Badge variant="outline" className={`text-xs ${getStatusColor(intake.status)}`}>
                          {intake.status.toUpperCase()}
                        </Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs mb-3">
                      <div>
                        <span className="text-gray-400">Source:</span>
                        <p className="text-white font-mono">{intake.source}</p>
                      </div>
                      <div>
                        <span className="text-gray-400">Type:</span>
                        <p className="text-blue-400">{intake.type.toUpperCase()}</p>
                      </div>
                      <div>
                        <span className="text-gray-400">Size:</span>
                        <p className="text-green-400">{(intake.metadata.size / 1024).toFixed(1)}KB</p>
                      </div>
                      <div>
                        <span className="text-gray-400">Files:</span>
                        <p className="text-purple-400">{intake.metadata.files}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">
                        Processed: {new Date(intake.timestamp).toLocaleString()}
                      </span>
                      
                      {intake.status === 'complete' && (
                        <Button
                          onClick={() => deployIntake(intake.id)}
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                          data-testid={`deploy-${intake.id}`}
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          Deploy
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Information */}
      <Card className="bg-gray-800 border-gray-600">
        <CardContent className="p-4">
          <div className="text-sm text-gray-400 space-y-2">
            <p><strong className="text-blue-400">Repository Intake:</strong> Fork and process repositories into VaultMesh system</p>
            <p><strong className="text-green-400">Content Integration:</strong> HTML and code content processed for deployment</p>
            <p><strong className="text-purple-400">Deployment Ready:</strong> Processed content can be deployed immediately</p>
            <p><strong className="text-yellow-400">Multi-Source:</strong> Support for GitHub repositories, HTML files, and URLs</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}