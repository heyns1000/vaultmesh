import { vipButtons, terminalButtons } from '@/data/vipUrls';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Terminal, Zap } from 'lucide-react';

interface VipButtonsGridProps {
  section?: 'hero' | 'terminal' | 'all';
  columns?: 2 | 3 | 4 | 6;
}

export default function VipButtonsGrid({ section = 'all', columns = 4 }: VipButtonsGridProps) {
  // Handle terminal button clicks
  const handleTerminalClick = (file: string) => {
    // In the original HTML, this loads terminals via iframe
    console.log(`[VaultMesh Terminal] Loading terminal: ${file}`);
    // For now, we'll show an alert - in full implementation, this would load the terminal interface
    alert(`Loading ${file} terminal interface...`);
  };

  // Handle external URL clicks
  const handleExternalClick = (url: string, label: string) => {
    console.log(`[VaultMesh VIP] Opening external URL: ${url}`);
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
        
        <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-${columns} gap-3`}>
          {vipButtons.map((button) => (
            <Button
              key={button.id}
              onClick={() => handleExternalClick(button.url, button.label)}
              variant={button.type === 'primary' ? 'default' : 'secondary'}
              className={`
                h-auto p-4 flex flex-col items-center gap-2 text-center transition-all duration-200
                ${button.type === 'primary' 
                  ? 'bg-green-600 hover:bg-green-700 text-white' 
                  : 'bg-gray-800 hover:bg-gray-700 text-gray-200 border-gray-600'
                }
                hover:scale-105 hover:shadow-lg
              `}
              data-testid={`vip-button-${button.id}`}
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">{button.label.split(' ')[0]}</span>
                <ExternalLink className="h-3 w-3" />
              </div>
              <div className="text-xs font-medium">
                {button.label.substring(button.label.indexOf(' ') + 1)}
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
        
        <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4`}>
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
    </div>
  );
}