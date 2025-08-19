import Terminal from "../components/Terminal";
import VipButtonsGrid from "../components/VipButtonsGrid";

export default function TerminalPage() {
  return (
    <main>
      <section className="hero-section">
        <div className="hero-content">
          <h2>
            VaultMesh™ <span>Terminal</span><br />
            Command Center
          </h2>
          <p className="text-lg mb-8">
            Access the full power of VaultMesh™ through our advanced terminal interface. 
            Execute commands, monitor systems, and manage your infrastructure directly.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <Terminal className="min-h-[600px]" />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container mx-auto px-4">
          <h3>Terminal Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="feature-card">
              <div className="icon">
                <i className="fas fa-terminal"></i>
              </div>
              <h4>Command Line Interface</h4>
              <p>Full-featured CLI with syntax highlighting and auto-completion for efficient system management.</p>
            </div>
            <div className="feature-card">
              <div className="icon">
                <i className="fas fa-chart-bar"></i>
              </div>
              <h4>Real-time Monitoring</h4>
              <p>Live system metrics, performance data, and network status updates in real-time.</p>
            </div>
            <div className="feature-card">
              <div className="icon">
                <i className="fas fa-history"></i>
              </div>
              <h4>Command History</h4>
              <p>Complete command history with search and replay functionality for improved productivity.</p>
            </div>
            <div className="feature-card">
              <div className="icon">
                <i className="fas fa-shield-alt"></i>
              </div>
              <h4>Secure Access</h4>
              <p>Multi-factor authentication and encrypted connections ensure secure terminal access.</p>
            </div>
            <div className="feature-card">
              <div className="icon">
                <i className="fas fa-plug"></i>
              </div>
              <h4>API Integration</h4>
              <p>Direct API access through terminal commands for seamless integration with external systems.</p>
            </div>
            <div className="feature-card">
              <div className="icon">
                <i className="fas fa-code"></i>
              </div>
              <h4>Script Execution</h4>
              <p>Run custom scripts and automation workflows directly from the terminal interface.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container mx-auto px-4 text-center">
          <h3>Need Help?</h3>
          <p className="mb-8">
            Type 'help' in the terminal above to see all available commands, 
            or contact our support team for assistance.
          </p>
          <div className="flex gap-4 justify-center">
            <a href="/docs" className="cta-button">
              View Documentation
            </a>
            <a href="/support" className="cta-button-secondary">
              Contact Support
            </a>
          </div>
        </div>
      </section>

      {/* Sector Terminals Section - VIP Terminal Access */}
      <section className="section bg-gray-950 border-t border-blue-500/20">
        <div className="container mx-auto px-4">
          <VipButtonsGrid section="terminal" />
        </div>
      </section>
    </main>
  );
}
