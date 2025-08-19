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
    // For secure platforms, show the security alert but don't auto-open externally
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
    
    console.log('[VaultMesh Debug] VIP Buttons data:', vipButtons);
    console.log('[VaultMesh Debug] VIP Buttons count:', vipButtons.length);
    
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-2xl font-bold text-green-400 mb-2 flex items-center justify-center gap-2">
            <Zap className="h-6 w-6" />
            VIP Access Buttons ({vipButtons.length} buttons)
          </h3>
          <p className="text-gray-400 text-sm">Essential platform access points from VaultMesh ecosystem</p>
        </div>
        
        <div className={`grid grid-cols-1 sm:grid-cols-2 ${
          columns === 2 ? 'md:grid-cols-2' :
          columns === 3 ? 'md:grid-cols-3' :
          columns === 4 ? 'md:grid-cols-4' :
          'md:grid-cols-6'
        } gap-3 w-full`}>
          {vipButtons && vipButtons.length > 0 ? vipButtons.map((button) => (
            <button
              key={button.id}
              onClick={() => handleExternalClick(button.url, button.label)}
              className={`
                w-full p-4 rounded-lg border-2 text-center transition-all duration-200 cursor-pointer
                ${button.type === 'primary' 
                  ? 'bg-green-600 hover:bg-green-700 text-white border-green-400 shadow-green-500/20' 
                  : 'bg-gray-700 hover:bg-gray-600 text-gray-100 border-gray-500 shadow-gray-500/20'
                }
                hover:scale-105 hover:shadow-lg shadow-md transform active:scale-95 block
              `}
              style={{
                minHeight: '100px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                visibility: 'visible !important',
                opacity: '1 !important'
              }}
              data-testid={`vip-button-${button.id}`}
            >
              <Monitor className="h-5 w-5 mb-1" />
              <span className="text-sm font-semibold leading-tight">{button.label}</span>
              <span className="text-xs opacity-80 line-clamp-2">{button.description}</span>
              <ExternalLink className="h-3 w-3 opacity-70" />
            </button>
          )) : (
            <div className="col-span-full text-center text-red-400 p-8 bg-gray-800 rounded-lg border border-red-500/20">
              <p className="text-lg font-semibold mb-2">⚠️ VIP Buttons Not Loading</p>
              <p>Debug Info: vipButtons array is {vipButtons ? 'defined' : 'undefined'}</p>
              <p>Button Count: {vipButtons ? vipButtons.length : 0}</p>
              <p className="text-sm text-gray-400 mt-2">Check console for detailed button data</p>
            </div>
          )}
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