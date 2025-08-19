import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Terminal, X, Maximize2, Minimize2, RefreshCw, Home, ArrowLeft, ArrowRight, ExternalLink, Shield } from 'lucide-react';
// Direct terminal loading - no security prompts

interface EmbeddedTerminalProps {
  isVisible: boolean;
  initialUrl?: string;
  onClose: () => void;
}

export const EmbeddedTerminal: React.FC<EmbeddedTerminalProps> = ({
  isVisible,
  initialUrl = '',
  onClose
}) => {
  const [currentUrl, setCurrentUrl] = useState(initialUrl);
  const [isLoading, setIsLoading] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const urlInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setCurrentUrl(initialUrl);
    if (initialUrl && !history.includes(initialUrl)) {
      setHistory(prev => [...prev, initialUrl]);
      setHistoryIndex(history.length);
    }
  }, [initialUrl]);

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentUrl) {
      loadUrl(currentUrl);
    }
  };

  const loadUrl = (url: string) => {
    setIsLoading(true);
    
    // Add to history if not already present
    if (!history.includes(url)) {
      const newHistory = [...history, url];
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
    }

    // For external URLs, we'll create a proxy/embed approach
    setCurrentUrl(url);
    
    // Simulate loading
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  const goBack = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setCurrentUrl(history[newIndex]);
      loadUrl(history[newIndex]);
    }
  };

  const goForward = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setCurrentUrl(history[newIndex]);
      loadUrl(history[newIndex]);
    }
  };

  const refresh = () => {
    if (currentUrl) {
      loadUrl(currentUrl);
    }
  };

  const goHome = () => {
    setCurrentUrl('');
    setIsLoading(false);
  };

  if (!isVisible) return null;

  return (
    <div className={`w-full ${isFullscreen ? 'fixed inset-0 z-50 bg-black/95 p-4' : ''}`}>
      <Card className={`bg-gray-900 border-gray-700 ${isFullscreen ? 'h-full' : 'h-[750px]'}`}>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-green-400 flex items-center gap-2">
              <Terminal className="h-5 w-5" />
              VaultMesh Embedded Terminal
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                onClick={() => setIsFullscreen(!isFullscreen)}
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-white"
                data-testid="toggle-fullscreen"
              >
                {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </Button>
              <Button
                onClick={onClose}
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-red-400"
                data-testid="close-terminal"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* Navigation Bar */}
          <div className="flex items-center gap-2 mt-2">
            <div className="flex items-center gap-1">
              <Button
                onClick={goBack}
                disabled={historyIndex <= 0}
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-white disabled:opacity-30"
                data-testid="nav-back"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <Button
                onClick={goForward}
                disabled={historyIndex >= history.length - 1}
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-white disabled:opacity-30"
                data-testid="nav-forward"
              >
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button
                onClick={refresh}
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-white"
                data-testid="nav-refresh"
              >
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              </Button>
              <Button
                onClick={goHome}
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-white"
                data-testid="nav-home"
              >
                <Home className="h-4 w-4" />
              </Button>
            </div>
            
            <form onSubmit={handleUrlSubmit} className="flex-1 flex gap-2">
              <Input
                ref={urlInputRef}
                value={currentUrl}
                onChange={(e) => setCurrentUrl(e.target.value)}
                placeholder="Enter URL to load in terminal..."
                className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 flex-1"
                data-testid="url-input"
              />
              <Button 
                type="submit" 
                variant="outline" 
                size="sm"
                className="bg-green-600 hover:bg-green-700 text-white border-green-600"
                data-testid="load-url"
              >
                Load
              </Button>
            </form>
          </div>
        </CardHeader>
        
        <CardContent className="p-0 h-full">
          <div className={`bg-black text-green-400 font-mono ${isFullscreen ? 'h-[calc(100%-120px)]' : 'h-[670px]'} overflow-hidden`}>
            {!currentUrl ? (
              <div className="p-6 h-full flex flex-col justify-center items-center text-center">
                <Terminal className="h-16 w-16 mb-4 text-green-400" />
                <h3 className="text-xl font-bold mb-2">VaultMesh Embedded Terminal</h3>
                <p className="text-gray-400 mb-4">
                  Click any VIP button above or enter a URL to display content within this terminal.
                </p>
                <div className="text-sm text-gray-500 space-y-1">
                  <p>• External websites will be embedded when possible</p>
                  <p>• Use navigation controls to browse</p>
                  <p>• Toggle fullscreen for better viewing</p>
                </div>
              </div>
            ) : (
              <div className="h-full relative">
                {isLoading && (
                  <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-10">
                    <div className="text-center">
                      <RefreshCw className="h-8 w-8 animate-spin text-green-400 mx-auto mb-2" />
                      <p className="text-green-400">Loading {currentUrl}...</p>
                    </div>
                  </div>
                )}
                
                {/* URL Display Header */}
                <div className="bg-gray-800 px-4 py-2 border-b border-gray-700">
                  <div className="flex items-center gap-2">
                    <span className="text-green-400">$</span>
                    <span className="text-blue-400">curl -X GET</span>
                    <span className="text-yellow-400 break-all">{currentUrl}</span>
                  </div>
                </div>
                
                {/* Content Area */}
                <div className="h-[calc(100%-48px)] min-h-[600px] relative">
                  {currentUrl.startsWith('http') ? (
                    <>
                      <iframe
                        ref={iframeRef}
                        src={currentUrl}
                        className="w-full h-full border-0"
                        title="Embedded Content"
                        sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-top-navigation allow-popups-to-escape-sandbox"
                        onLoad={() => setIsLoading(false)}
                        onError={() => {
                          setIsLoading(false);
                        }}
                      />
                      

                      
                      {/* Standard Open in New Tab Button */}
                      <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute top-4 right-4 z-10">
                          <Button
                            onClick={() => window.open(currentUrl, '_blank', 'noopener,noreferrer')}
                            variant="outline"
                            size="sm"
                            className="bg-blue-600 hover:bg-blue-700 text-white border-blue-600 pointer-events-auto"
                            data-testid="open-in-new-tab"
                          >
                            <ExternalLink className="h-4 w-4 mr-1" />
                            Open in New Tab
                          </Button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="p-6 h-full">
                      <div className="text-green-400 space-y-2">
                        <p>Response Headers:</p>
                        <p className="text-yellow-400">HTTP/1.1 200 OK</p>
                        <p className="text-yellow-400">Content-Type: text/html; charset=UTF-8</p>
                        <p className="text-yellow-400">X-VaultMesh-Terminal: active</p>
                        <br />
                        <p>Body:</p>
                        <div className="bg-gray-900 p-4 rounded mt-2 border border-gray-700">
                          <p className="text-white">Local file or command output would appear here.</p>
                          <p className="text-gray-400 mt-2">Enter a valid HTTP/HTTPS URL to embed external content.</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};