import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, Check, X, ExternalLink } from 'lucide-react';
import { vipButtons } from '@/data/vipUrls';
import { isPlatformSecure, getPlatformType } from '@/data/platformSecurity';

const SecurityStatusIndicator: React.FC = () => {
  const embeddableUrls = vipButtons.filter(button => !isPlatformSecure(button.url));
  const secureUrls = vipButtons.filter(button => isPlatformSecure(button.url));

  const platformCounts = {
    financial: secureUrls.filter(btn => getPlatformType(btn.url) === 'financial').length,
    development: secureUrls.filter(btn => getPlatformType(btn.url) === 'development').length,
    ai: secureUrls.filter(btn => getPlatformType(btn.url) === 'ai').length,
    communication: secureUrls.filter(btn => getPlatformType(btn.url) === 'communication').length,
    embeddable: embeddableUrls.length
  };

  return (
    <Card className="bg-gray-900/50 border-gray-700 mt-6">
      <CardHeader>
        <CardTitle className="flex items-center text-lg text-green-400">
          <Shield className="h-5 w-5 mr-2" />
          Platform Security Status
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Embeddable Platforms */}
          <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <Check className="h-4 w-4 text-green-400 mr-2" />
              <span className="font-medium text-green-400">Embeddable</span>
            </div>
            <div className="text-2xl font-bold text-green-300 mb-1">
              {platformCounts.embeddable}
            </div>
            <div className="text-sm text-gray-400">
              Platforms that work directly in terminal
            </div>
          </div>

          {/* Financial Platforms */}
          <div className="bg-orange-900/20 border border-orange-500/30 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <ExternalLink className="h-4 w-4 text-orange-400 mr-2" />
              <span className="font-medium text-orange-400">Financial</span>
            </div>
            <div className="text-2xl font-bold text-orange-300 mb-1">
              {platformCounts.financial}
            </div>
            <div className="text-sm text-gray-400">
              Banking & payment platforms (external only)
            </div>
          </div>

          {/* Development Platforms */}
          <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <ExternalLink className="h-4 w-4 text-blue-400 mr-2" />
              <span className="font-medium text-blue-400">Development</span>
            </div>
            <div className="text-2xl font-bold text-blue-300 mb-1">
              {platformCounts.development}
            </div>
            <div className="text-sm text-gray-400">
              Code & hosting platforms (external only)
            </div>
          </div>

          {/* AI Platforms */}
          <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <ExternalLink className="h-4 w-4 text-purple-400 mr-2" />
              <span className="font-medium text-purple-400">AI/ML</span>
            </div>
            <div className="text-2xl font-bold text-purple-300 mb-1">
              {platformCounts.ai}
            </div>
            <div className="text-sm text-gray-400">
              AI platforms (external only)
            </div>
          </div>

          {/* Communication Platforms */}
          <div className="bg-cyan-900/20 border border-cyan-500/30 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <ExternalLink className="h-4 w-4 text-cyan-400 mr-2" />
              <span className="font-medium text-cyan-400">Communication</span>
            </div>
            <div className="text-2xl font-bold text-cyan-300 mb-1">
              {platformCounts.communication}
            </div>
            <div className="text-sm text-gray-400">
              Email & messaging (external only)
            </div>
          </div>
        </div>

        {/* Status Legend */}
        <div className="mt-6 p-4 bg-gray-800/50 rounded-lg">
          <h4 className="text-sm font-medium text-gray-300 mb-3">Security Policy</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
            <div className="flex items-center">
              <Check className="h-3 w-3 text-green-400 mr-2" />
              <span className="text-gray-400">Embeddable: Works in VaultMesh terminal</span>
            </div>
            <div className="flex items-center">
              <ExternalLink className="h-3 w-3 text-orange-400 mr-2" />
              <span className="text-gray-400">External Only: Opens in new tab for security</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SecurityStatusIndicator;