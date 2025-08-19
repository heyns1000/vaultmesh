import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Shield, ExternalLink, AlertTriangle } from 'lucide-react';
import { isPlatformSecure, getSecurityMessage } from '@/data/platformSecurity';

interface PlatformAlertProps {
  url: string;
  onOpenExternal: () => void;
}

const PlatformAlert: React.FC<PlatformAlertProps> = ({ url, onOpenExternal }) => {
  if (!isPlatformSecure(url)) return null;

  const security = getSecurityMessage(url);

  return (
    <div className="absolute inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-orange-500/30 rounded-lg p-6 max-w-lg text-center">
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-orange-500/10 rounded-full">
            <Shield className="h-8 w-8 text-orange-400" />
          </div>
        </div>
        
        <h3 className="text-xl font-bold text-orange-400 mb-2">
          {security.icon} {security.title}
        </h3>
        
        <p className="text-gray-300 mb-6 leading-relaxed">
          {security.message}
        </p>
        
        <div className="flex gap-3 justify-center">
          <Button
            onClick={onOpenExternal}
            className="bg-blue-600 hover:bg-blue-700 text-white"
            data-testid="open-secure-platform"
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Open Securely
          </Button>
        </div>
        
        <div className="mt-4 p-3 bg-gray-800/50 rounded-lg">
          <div className="flex items-center justify-center text-sm text-gray-400">
            <AlertTriangle className="h-4 w-4 mr-2" />
            VaultMesh protects your data by respecting platform security policies
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlatformAlert;