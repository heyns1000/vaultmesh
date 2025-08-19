import { useState, useEffect, useCallback } from 'react';

interface BackupData {
  id: string;
  timestamp: string;
  version: string;
  urls: {
    vipUrls: any[];
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

interface UseURLBackupReturn {
  backups: BackupData[];
  isCreatingBackup: boolean;
  isRestoring: boolean;
  createBackup: (description?: string) => Promise<BackupData | null>;
  restoreBackup: (backupId: string) => Promise<boolean>;
  deleteBackup: (backupId: string) => void;
  exportBackup: (backup: BackupData) => void;
  importBackup: (file: File) => Promise<boolean>;
  getBackupStatus: () => {
    totalBackups: number;
    lastBackupDate: string | null;
    totalSize: string;
  };
}

export const useURLBackup = (): UseURLBackupReturn => {
  const [backups, setBackups] = useState<BackupData[]>([]);
  const [isCreatingBackup, setIsCreatingBackup] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);

  // Load existing backups on mount
  useEffect(() => {
    loadBackups();
  }, []);

  const loadBackups = useCallback(() => {
    try {
      const stored = localStorage.getItem('vaultmesh-backups');
      const backups = stored ? JSON.parse(stored) : [];
      setBackups(backups);
    } catch (error) {
      console.error('[URLBackup] Error loading backups:', error);
      setBackups([]);
    }
  }, []);

  const saveBackups = useCallback((backups: BackupData[]) => {
    try {
      localStorage.setItem('vaultmesh-backups', JSON.stringify(backups));
      setBackups(backups);
    } catch (error) {
      console.error('[URLBackup] Error saving backups:', error);
    }
  }, []);

  const generateChecksum = useCallback((data: any): string => {
    const str = JSON.stringify(data);
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(16);
  }, []);

  const getBackupSize = useCallback((data: any): string => {
    const sizeInBytes = new Blob([JSON.stringify(data)]).size;
    if (sizeInBytes < 1024) return `${sizeInBytes} B`;
    if (sizeInBytes < 1024 * 1024) return `${(sizeInBytes / 1024).toFixed(1)} KB`;
    return `${(sizeInBytes / (1024 * 1024)).toFixed(1)} MB`;
  }, []);

  const createBackup = useCallback(async (description?: string): Promise<BackupData | null> => {
    setIsCreatingBackup(true);
    
    try {
      // Collect all data to backup
      const routingHistory = JSON.parse(localStorage.getItem('vaultmesh-routing-history') || '[]');
      const analytics = JSON.parse(localStorage.getItem('vaultmesh-analytics') || '[]');
      const userPreferences = JSON.parse(localStorage.getItem('vaultmesh-preferences') || '{}');
      const vipUrls = JSON.parse(localStorage.getItem('vaultmesh-vip-urls') || '[]');
      
      const urlData = {
        vipUrls,
        routingHistory,
        analytics,
        userPreferences
      };

      const backup: BackupData = {
        id: `backup_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        urls: urlData,
        metadata: {
          totalUrls: vipUrls.length || 0,
          backupSize: getBackupSize(urlData),
          checksum: generateChecksum(urlData)
        }
      };

      // Add description if provided
      if (description) {
        (backup as any).description = description;
      }

      // Save backup
      const updatedBackups = [backup, ...backups].slice(0, 20); // Keep last 20 backups
      saveBackups(updatedBackups);
      
      console.log(`[URLBackup] Created backup: ${backup.id}`);
      return backup;
      
    } catch (error) {
      console.error('[URLBackup] Error creating backup:', error);
      return null;
    } finally {
      setIsCreatingBackup(false);
    }
  }, [backups, saveBackups, generateChecksum, getBackupSize]);

  const restoreBackup = useCallback(async (backupId: string): Promise<boolean> => {
    setIsRestoring(true);
    
    try {
      const backup = backups.find(b => b.id === backupId);
      if (!backup) {
        throw new Error('Backup not found');
      }

      // Verify backup integrity
      const currentChecksum = generateChecksum(backup.urls);
      if (currentChecksum !== backup.metadata.checksum) {
        console.warn('[URLBackup] Backup integrity check failed, proceeding anyway');
      }

      // Restore data to localStorage
      localStorage.setItem('vaultmesh-routing-history', JSON.stringify(backup.urls.routingHistory || []));
      localStorage.setItem('vaultmesh-analytics', JSON.stringify(backup.urls.analytics || []));
      localStorage.setItem('vaultmesh-preferences', JSON.stringify(backup.urls.userPreferences || {}));
      localStorage.setItem('vaultmesh-vip-urls', JSON.stringify(backup.urls.vipUrls || []));
      
      console.log(`[URLBackup] Restored backup: ${backupId}`);
      return true;
      
    } catch (error) {
      console.error('[URLBackup] Error restoring backup:', error);
      return false;
    } finally {
      setIsRestoring(false);
    }
  }, [backups, generateChecksum]);

  const deleteBackup = useCallback((backupId: string) => {
    const updatedBackups = backups.filter(b => b.id !== backupId);
    saveBackups(updatedBackups);
    console.log(`[URLBackup] Deleted backup: ${backupId}`);
  }, [backups, saveBackups]);

  const exportBackup = useCallback((backup: BackupData) => {
    try {
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
      
      console.log(`[URLBackup] Exported backup: ${backup.id}`);
    } catch (error) {
      console.error('[URLBackup] Error exporting backup:', error);
    }
  }, []);

  const importBackup = useCallback(async (file: File): Promise<boolean> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const backup: BackupData = JSON.parse(e.target?.result as string);
          
          // Validate backup structure
          if (!backup.id || !backup.urls || !backup.metadata) {
            throw new Error('Invalid backup file format');
          }

          const updatedBackups = [backup, ...backups].slice(0, 20);
          saveBackups(updatedBackups);
          
          console.log(`[URLBackup] Imported backup: ${backup.id}`);
          resolve(true);
          
        } catch (error) {
          console.error('[URLBackup] Error importing backup:', error);
          resolve(false);
        }
      };
      
      reader.onerror = () => {
        console.error('[URLBackup] Error reading backup file');
        resolve(false);
      };
      
      reader.readAsText(file);
    });
  }, [backups, saveBackups]);

  const getBackupStatus = useCallback(() => {
    const totalSize = backups.reduce((acc, backup) => {
      const sizeStr = backup.metadata.backupSize;
      const sizeNum = parseFloat(sizeStr);
      return acc + (sizeStr.includes('KB') ? sizeNum : sizeStr.includes('MB') ? sizeNum * 1024 : sizeNum / 1024);
    }, 0);

    return {
      totalBackups: backups.length,
      lastBackupDate: backups.length > 0 ? backups[0].timestamp : null,
      totalSize: totalSize > 1024 ? `${(totalSize / 1024).toFixed(1)} MB` : `${totalSize.toFixed(1)} KB`
    };
  }, [backups]);

  return {
    backups,
    isCreatingBackup,
    isRestoring,
    createBackup,
    restoreBackup,
    deleteBackup,
    exportBackup,
    importBackup,
    getBackupStatus
  };
};