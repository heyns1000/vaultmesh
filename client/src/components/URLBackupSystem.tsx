import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Download, Upload, Save, RefreshCw, Database, Shield, Clock, FileDown, FileUp } from 'lucide-react';
import { vipButtons } from '@/data/vipUrls';

interface BackupData {
  id: string;
  timestamp: string;
  version: string;
  urls: {
    vipUrls: typeof vipButtons;
    routingHistory: string[];
    analytics: any[];
    userPreferences: any;
  };
  metadata: {
    totalUrls: number;
    backupSize: string;
    checksum: string;
  };
}

interface URLBackupSystemProps {
  isVisible?: boolean;
  onBackupComplete?: (backup: BackupData) => void;
  onRestoreComplete?: (backup: BackupData) => void;
}

const URLBackupSystem: React.FC<URLBackupSystemProps> = ({
  isVisible = true,
  onBackupComplete,
  onRestoreComplete
}) => {
  const [backups, setBackups] = useState<BackupData[]>([]);
  const [isCreatingBackup, setIsCreatingBackup] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [backupName, setBackupName] = useState('');
  const [selectedBackup, setSelectedBackup] = useState<string | null>(null);

  useEffect(() => {
    loadExistingBackups();
    performAutomaticBackup();
  }, []);

  const generateBackupId = () => {
    return `backup_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  const calculateChecksum = (data: any): string => {
    const str = JSON.stringify(data);
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(16);
  };

  const getBackupSize = (data: any): string => {
    const sizeInBytes = new Blob([JSON.stringify(data)]).size;
    if (sizeInBytes < 1024) return `${sizeInBytes} B`;
    if (sizeInBytes < 1024 * 1024) return `${(sizeInBytes / 1024).toFixed(1)} KB`;
    return `${(sizeInBytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const createBackup = async () => {
    setIsCreatingBackup(true);
    
    try {
      // Collect all URL and routing data
      const routingHistory = JSON.parse(localStorage.getItem('vaultmesh-routing-history') || '[]');
      const analytics = JSON.parse(localStorage.getItem('vaultmesh-analytics') || '[]');
      const userPreferences = JSON.parse(localStorage.getItem('vaultmesh-preferences') || '{}');
      
      const urlData = {
        vipUrls: vipButtons,
        routingHistory,
        analytics,
        userPreferences
      };

      const backup: BackupData = {
        id: generateBackupId(),
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        urls: urlData,
        metadata: {
          totalUrls: vipButtons.length,
          backupSize: getBackupSize(urlData),
          checksum: calculateChecksum(urlData)
        }
      };

      // Store backup in localStorage
      const existingBackups = JSON.parse(localStorage.getItem('vaultmesh-backups') || '[]');
      const updatedBackups = [backup, ...existingBackups].slice(0, 10); // Keep last 10 backups
      localStorage.setItem('vaultmesh-backups', JSON.stringify(updatedBackups));
      
      setBackups(updatedBackups);
      setBackupName('');
      
      console.log(`[VaultMesh Backup] Created backup: ${backup.id}`);
      onBackupComplete?.(backup);
      
    } catch (error) {
      console.error('[VaultMesh Backup] Error creating backup:', error);
    } finally {
      setIsCreatingBackup(false);
    }
  };

  const restoreBackup = async (backupId: string) => {
    setIsRestoring(true);
    
    try {
      const backup = backups.find(b => b.id === backupId);
      if (!backup) {
        throw new Error('Backup not found');
      }

      // Verify backup integrity
      const currentChecksum = calculateChecksum(backup.urls);
      if (currentChecksum !== backup.metadata.checksum) {
        throw new Error('Backup integrity check failed');
      }

      // Restore data to localStorage
      localStorage.setItem('vaultmesh-routing-history', JSON.stringify(backup.urls.routingHistory));
      localStorage.setItem('vaultmesh-analytics', JSON.stringify(backup.urls.analytics));
      localStorage.setItem('vaultmesh-preferences', JSON.stringify(backup.urls.userPreferences));
      
      console.log(`[VaultMesh Backup] Restored backup: ${backupId}`);
      onRestoreComplete?.(backup);
      
      // Reload page to apply restored settings
      setTimeout(() => {
        window.location.reload();
      }, 1000);
      
    } catch (error) {
      console.error('[VaultMesh Backup] Error restoring backup:', error);
    } finally {
      setIsRestoring(false);
    }
  };

  const loadExistingBackups = () => {
    const existingBackups = JSON.parse(localStorage.getItem('vaultmesh-backups') || '[]');
    setBackups(existingBackups);
  };

  const performAutomaticBackup = () => {
    const lastAutoBackup = localStorage.getItem('vaultmesh-last-auto-backup');
    const now = Date.now();
    const twentyFourHours = 24 * 60 * 60 * 1000;
    
    if (!lastAutoBackup || (now - parseInt(lastAutoBackup)) > twentyFourHours) {
      createBackup();
      localStorage.setItem('vaultmesh-last-auto-backup', now.toString());
    }
  };

  const exportBackup = (backup: BackupData) => {
    const dataStr = JSON.stringify(backup, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `vaultmesh-backup-${backup.id}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const importBackup = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const backup: BackupData = JSON.parse(e.target?.result as string);
        
        // Validate backup structure
        if (!backup.id || !backup.urls || !backup.metadata) {
          throw new Error('Invalid backup file format');
        }

        const existingBackups = JSON.parse(localStorage.getItem('vaultmesh-backups') || '[]');
        const updatedBackups = [backup, ...existingBackups].slice(0, 10);
        localStorage.setItem('vaultmesh-backups', JSON.stringify(updatedBackups));
        
        setBackups(updatedBackups);
        console.log(`[VaultMesh Backup] Imported backup: ${backup.id}`);
        
      } catch (error) {
        console.error('[VaultMesh Backup] Error importing backup:', error);
      }
    };
    reader.readAsText(file);
  };

  const deleteBackup = (backupId: string) => {
    const updatedBackups = backups.filter(b => b.id !== backupId);
    localStorage.setItem('vaultmesh-backups', JSON.stringify(updatedBackups));
    setBackups(updatedBackups);
    console.log(`[VaultMesh Backup] Deleted backup: ${backupId}`);
  };

  if (!isVisible) return null;

  return (
    <Card className="bg-gray-900 border-gray-700">
      <CardHeader>
        <CardTitle className="text-blue-400 flex items-center gap-2">
          <Database className="h-5 w-5" />
          URL Backup & Restore System
        </CardTitle>
        <p className="text-gray-400 text-sm">
          Complete routing preservation and recovery system for VaultMesh infrastructure
        </p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Backup Creation */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-green-400 flex items-center gap-2">
            <Save className="h-4 w-4" />
            Create New Backup
          </h3>
          
          <div className="flex gap-2">
            <Input
              value={backupName}
              onChange={(e) => setBackupName(e.target.value)}
              placeholder="Optional backup description..."
              className="bg-gray-800 border-gray-600 text-white"
              data-testid="backup-name-input"
            />
            <Button
              onClick={createBackup}
              disabled={isCreatingBackup}
              className="bg-green-600 hover:bg-green-700"
              data-testid="create-backup-button"
            >
              {isCreatingBackup ? (
                <RefreshCw className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Create Backup
            </Button>
          </div>
        </div>

        {/* Import/Export */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-yellow-400 flex items-center gap-2">
            <FileDown className="h-4 w-4" />
            Import/Export
          </h3>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="border-gray-600 text-gray-300"
              onClick={() => document.getElementById('backup-import')?.click()}
              data-testid="import-backup-button"
            >
              <FileUp className="h-4 w-4 mr-2" />
              Import Backup
            </Button>
            <input
              id="backup-import"
              type="file"
              accept=".json"
              onChange={importBackup}
              className="hidden"
            />
          </div>
        </div>

        {/* Backup List */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-purple-400 flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Available Backups ({backups.length})
          </h3>
          
          {backups.length === 0 ? (
            <div className="text-center py-6 text-gray-400">
              <Database className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No backups available</p>
              <p className="text-sm">Create your first backup to get started</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {backups.map((backup) => (
                <div
                  key={backup.id}
                  className={`p-3 rounded-lg border transition-colors cursor-pointer ${
                    selectedBackup === backup.id
                      ? 'border-blue-500 bg-blue-500/10'
                      : 'border-gray-600 bg-gray-800/50 hover:border-gray-500'
                  }`}
                  onClick={() => setSelectedBackup(backup.id)}
                  data-testid={`backup-item-${backup.id}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Clock className="h-3 w-3 text-gray-400" />
                        <span className="text-sm font-medium">
                          {new Date(backup.timestamp).toLocaleString()}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          v{backup.version}
                        </Badge>
                      </div>
                      <div className="text-xs text-gray-400 space-x-4">
                        <span>{backup.metadata.totalUrls} URLs</span>
                        <span>{backup.metadata.backupSize}</span>
                        <span>#{backup.metadata.checksum.slice(0, 8)}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          exportBackup(backup);
                        }}
                        className="text-xs border-gray-600"
                        data-testid={`export-backup-${backup.id}`}
                      >
                        <Download className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          restoreBackup(backup.id);
                        }}
                        disabled={isRestoring}
                        className="text-xs bg-blue-600 hover:bg-blue-700"
                        data-testid={`restore-backup-${backup.id}`}
                      >
                        {isRestoring ? (
                          <RefreshCw className="h-3 w-3 animate-spin" />
                        ) : (
                          <Upload className="h-3 w-3" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* System Status */}
        <div className="bg-gray-800/50 p-3 rounded-lg">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-400">Active URLs:</span>
              <span className="ml-2 text-green-400">{vipButtons.length}</span>
            </div>
            <div>
              <span className="text-gray-400">Total Backups:</span>
              <span className="ml-2 text-blue-400">{backups.length}</span>
            </div>
            <div>
              <span className="text-gray-400">Auto Backup:</span>
              <span className="ml-2 text-green-400">Enabled</span>
            </div>
            <div>
              <span className="text-gray-400">Last Backup:</span>
              <span className="ml-2 text-yellow-400">
                {backups.length > 0 
                  ? new Date(backups[0].timestamp).toLocaleDateString()
                  : 'Never'
                }
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default URLBackupSystem;