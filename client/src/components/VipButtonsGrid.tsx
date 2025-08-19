import { useState } from 'react';
import { vipButtons, terminalButtons } from '@/data/vipUrls';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Terminal, Zap, Monitor } from 'lucide-react';
import { EmbeddedTerminal } from './EmbeddedTerminal';

interface VipButtonsGridProps {
  section?: 'hero' | 'terminal' | 'all';
  columns?: 2 | 3 | 4 | 6;
}

export default function VipButtonsGrid({ section = 'all', columns = 4 }: VipButtonsGridProps) {
  const [terminalVisible, setTerminalVisible] = useState(false);
  const [terminalUrl, setTerminalUrl] = useState('');

  // Handle terminal button clicks
  const handleTerminalClick = (file: string) => {
    console.log(`[VaultMesh Terminal] Loading terminal: ${file}`);
    setTerminalUrl(file);
    setTerminalVisible(true);
  };

  // Handle external URL clicks with embedded option
  const handleExternalClick = (url: string, label: string) => {
    console.log(`[VaultMesh VIP] Opening URL in embedded terminal: ${url}`);
    setTerminalUrl(url);
    setTerminalVisible(true);
  };

  // Handle external URL clicks in new tab (for the external link icon)
  const handleExternalNewTab = (url: string, label: string) => {
    console.log(`[VaultMesh VIP] Opening external URL in new tab: ${url}`);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const renderVipButtons = () => {
    if (section === 'terminal') return null;
    
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-2xl font-bold text-green-400 mb-2 flex items-center justify-center gap-2">
            <Zap className="h-6 w-6" />
            VIP Access Buttons
          </h3>
          <p className="text-gray-400 text-sm">Essential platform access points from VaultMesh ecosystem</p>
        </div>
        
        <div className={`grid grid-cols-1 sm:grid-cols-2 ${
          columns === 2 ? 'md:grid-cols-2' :
          columns === 3 ? 'md:grid-cols-3' :
          columns === 4 ? 'md:grid-cols-4' :
          'md:grid-cols-6'
        } gap-3`}>
          {vipButtons.map((button) => (
            <div key={button.id} className="relative group">
              <Button
                onClick={() => handleExternalClick(button.url, button.label)}
                variant={button.type === 'primary' ? 'default' : 'secondary'}
                className={`
                  w-full h-auto p-4 flex flex-col items-center gap-2 text-center transition-all duration-200
                  ${button.type === 'primary' 
                    ? 'bg-green-600 hover:bg-green-700 text-white' 
                    : 'bg-gray-800 hover:bg-gray-700 text-gray-200 border-gray-600'
                  }
                  hover:scale-105 hover:shadow-lg
                `}
                data-testid={`vip-button-${button.id}`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Monitor className="h-4 w-4" />
                  <span className="text-sm font-semibold">{button.label}</span>
                </div>
                <div className="text-xs text-gray-400 line-clamp-2">
                  {button.description}
                </div>
                {button.type === 'primary' && (
                  <Badge variant="default" className="mt-1 bg-yellow-500 text-black text-xs">
                    Priority
                  </Badge>
                )}
              </Button>
              
              {/* External Link Button */}
              <Button
                onClick={() => handleExternalNewTab(button.url, button.label)}
                variant="ghost"
                size="sm"
                className="absolute top-2 right-2 p-1 opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 hover:bg-black/70"
                data-testid={`external-link-${button.id}`}
              >
                <ExternalLink className="h-3 w-3 text-gray-300" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderTerminalButtons = () => {
    if (section === 'hero') return null;
    
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-2xl font-bold text-blue-400 mb-2 flex items-center justify-center gap-2">
            <Terminal className="h-6 w-6" />
            Sector Terminals
          </h3>
          <p className="text-gray-400 text-sm">Access specialized AI terminals and VaultMaster systems</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {terminalButtons.map((button) => (
            <Card 
              key={button.id}
              className="bg-gray-900/50 border-gray-700 hover:border-blue-500 transition-all duration-200 cursor-pointer hover:scale-105"
              onClick={() => handleTerminalClick(button.file)}
              data-testid={`terminal-button-${button.id}`}
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-blue-400 flex items-center gap-2">
                  <Terminal className="h-4 w-4" />
                  {button.label}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-xs text-gray-400">
                  {button.description}
                </CardDescription>
                <div className="mt-2">
                  <Badge variant="outline" className="text-xs border-blue-500 text-blue-400">
                    {button.file}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {section === 'all' && (
        <>
          {renderVipButtons()}
          {renderTerminalButtons()}
        </>
      )}
      {section === 'hero' && renderVipButtons()}
      {section === 'terminal' && renderTerminalButtons()}
      
      {/* Embedded Terminal */}
      <EmbeddedTerminal
        isVisible={terminalVisible}
        initialUrl={terminalUrl}
        onClose={() => setTerminalVisible(false)}
      />
    </div>
  );
}