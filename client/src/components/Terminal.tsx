import { useState, useRef, useEffect } from 'react';

interface TerminalProps {
  className?: string;
}

export default function Terminal({ className = '' }: TerminalProps) {
  const [output, setOutput] = useState<string[]>([
    'VaultMesh™ Terminal v3.2.1',
    'Connected to mesh node: vm-us-east-1',
    'Authentication: Active',
    '',
    '> Ready for commands...',
    'vault@mesh:~$ '
  ]);
  const outputRef = useRef<HTMLDivElement>(null);

  const commands = {
    'status': 'System Status: Online\nNodes: 247 active\nLatency: 12ms avg\nUptime: 99.97%',
    'vault list': 'Active Vaults:\n• vault-us1 (healthy)\n• vault-eu2 (healthy)\n• vault-ap3 (healthy)',
    'scan': 'Network Scan Results:\nDiscovered 1,247 mesh nodes\nOptimal routes calculated\nSecurity verified',
    'analytics': 'Analytics Dashboard:\nTraffic: +15% this week\nPerformance: Excellent\nAlerts: None',
    'help': 'Available commands:\n• status - System status\n• vault list - List active vaults\n• scan - Network scan\n• analytics - View analytics\n• clear - Clear terminal\n• help - Show this help',
    'clear': 'CLEAR_TERMINAL'
  };

  const executeCommand = (command: string) => {
    if (command === 'clear') {
      setOutput(['vault@mesh:~$ ']);
      return;
    }

    const result = commands[command as keyof typeof commands];
    if (result) {
      if (result === 'CLEAR_TERMINAL') {
        setOutput(['vault@mesh:~$ ']);
      } else {
        setOutput(prev => [
          ...prev,
          command,
          ...result.split('\n'),
          'vault@mesh:~$ '
        ]);
      }
    } else {
      setOutput(prev => [
        ...prev,
        command,
        `Command not found: ${command}. Type 'help' for available commands.`,
        'vault@mesh:~$ '
      ]);
    }
  };

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [output]);

  return (
    <div className={`terminal-container ${className}`}>
      <div className="flex gap-4 mb-4 flex-wrap">
        <button className="terminal-btn" onClick={() => executeCommand('status')}>
          System Status
        </button>
        <button className="terminal-btn" onClick={() => executeCommand('vault list')}>  
          List Vaults
        </button>
        <button className="terminal-btn" onClick={() => executeCommand('scan')}>
          Network Scan
        </button>
        <button className="terminal-btn" onClick={() => executeCommand('analytics')}>
          Analytics
        </button>
      </div>
      <div 
        ref={outputRef}
        className="font-mono text-sm leading-relaxed max-h-96 overflow-y-auto"
      >
        {output.map((line, index) => (
          <div key={index}>
            {line === 'vault@mesh:~$ ' ? (
              <span>
                <span style={{ color: 'var(--vault-cyan)' }}>vault@mesh:~$</span>{' '}
                {index === output.length - 1 && <span className="animate-pulse">_</span>}
              </span>
            ) : (
              line
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
