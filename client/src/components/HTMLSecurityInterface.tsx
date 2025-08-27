import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Shield, Lock, Eye, Upload } from 'lucide-react';

interface SecuredRecord {
  id: string;
  timestamp: string;
  size: number;
  secured: boolean;
}

export default function HTMLSecurityInterface() {
  const [html, setHtml] = useState('');
  const [securedRecords, setSecuredRecords] = useState<SecuredRecord[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    loadSecuredRecords();
  }, []);

  const loadSecuredRecords = async () => {
    try {
      const response = await fetch('/api/html-security/list');
      const data = await response.json();
      if (data.success) {
        setSecuredRecords(data.data);
      }
    } catch (error) {
      console.error('[HTML Security] Failed to load records:', error);
    }
  };

  const secureAndStore = async () => {
    if (!html.trim()) return;

    setIsProcessing(true);
    try {
      const response = await fetch('/api/html-security/secure', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ html }),
      });

      const data = await response.json();
      if (data.success) {
        console.log('[HTML Security] HTML secured successfully');
        loadSecuredRecords();
        setHtml('');
      }
    } catch (error) {
      console.error('[HTML Security] Security failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const renderSecured = (id: string) => {
    const url = `/api/html-security/render/${id}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="space-y-6">
      {/* HTML Security Input */}
      <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-green-500/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-400">
            <Shield className="h-6 w-6" />
            HTML Security Only - Pure Rendering
          </CardTitle>
          <p className="text-gray-400 text-sm">
            HTML rendered exactly as-is with security protection only
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">HTML Content</label>
            <Textarea
              value={html}
              onChange={(e) => setHtml(e.target.value)}
              placeholder="Paste HTML content here - will be rendered as-is with security only..."
              className="bg-gray-800 border-gray-600 text-white min-h-[200px] font-mono text-sm"
              data-testid="html-input"
            />
          </div>

          <Button
            onClick={secureAndStore}
            disabled={isProcessing || !html.trim()}
            className="w-full bg-green-600 hover:bg-green-700"
            data-testid="secure-html"
          >
            {isProcessing ? (
              <>
                <Lock className="h-4 w-4 mr-2 animate-spin" />
                Securing...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Secure HTML Only
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Secured HTML Records */}
      {securedRecords.length > 0 && (
        <Card className="bg-gray-800 border-gray-600">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Secured HTML ({securedRecords.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {securedRecords.map((record) => (
                <div 
                  key={record.id}
                  className="flex items-center justify-between p-3 bg-gray-700 rounded border border-gray-600"
                >
                  <div className="flex items-center gap-3">
                    <Shield className="h-4 w-4 text-green-400" />
                    <div>
                      <p className="text-white font-mono text-sm">{record.id}</p>
                      <p className="text-xs text-gray-400">
                        {new Date(record.timestamp).toLocaleString()} • {record.size} chars
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-green-400 border-green-400">
                      SECURED
                    </Badge>
                    <Button
                      onClick={() => renderSecured(record.id)}
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700"
                      data-testid={`render-${record.id}`}
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      Render
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Security Information */}
      <Card className="bg-gray-800 border-gray-600">
        <CardContent className="p-4">
          <div className="text-sm text-gray-400 space-y-2">
            <p><strong className="text-green-400">Security Only:</strong> HTML content rendered exactly as provided</p>
            <p><strong className="text-blue-400">No Modifications:</strong> Only dangerous scripts removed for security</p>
            <p><strong className="text-yellow-400">Pure Rendering:</strong> All formatting and structure preserved exactly</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}