import { Link } from "wouter";
import PulseCanvas from "../components/PulseCanvas";
import PriceChart from "../components/PriceChart";
import Terminal from "../components/Terminal";
import VipButtonsGrid from "../components/VipButtonsGrid";
import URLBackupSystem from "../components/URLBackupSystem";
import SecurityStatusIndicator from "../components/SecurityStatusIndicator";

export default function Home() {
  const features = [
    {
      icon: "fas fa-shield-alt",
      title: "Advanced Security",
      description: "Military-grade encryption and multi-layer security protocols protect your digital assets."
    },
    {
      icon: "fas fa-network-wired",
      title: "Mesh Network",
      description: "Decentralized infrastructure ensures maximum uptime and global accessibility."
    },
    {
      icon: "fas fa-terminal",
      title: "Terminal Access",
      description: "Direct command-line interface for power users and automated operations."
    },
    {
      icon: "fas fa-chart-line",
      title: "Real-time Analytics",
      description: "Comprehensive data insights and performance monitoring dashboards."
    },
    {
      icon: "fas fa-globe",
      title: "Global Distribution",
      description: "Worldwide node network ensures low-latency access from anywhere."
    },
    {
      icon: "fas fa-cogs",
      title: "Smart Automation",
      description: "AI-powered automation reduces manual intervention and optimizes performance."
    }
  ];

  const pricingTiers = [
    {
      name: "Starter",
      price: "$29",
      period: "per month",
      features: [
        "Up to 5 mesh nodes",
        "100GB secure storage",
        "Basic support",
        "Standard analytics"
      ],
      href: "/subscribe/starter"
    },
    {
      name: "Pro",
      price: "$99",
      period: "per month",
      features: [
        "Up to 25 mesh nodes",
        "1TB secure storage",
        "Priority support",
        "Advanced analytics",
        "Terminal access"
      ],
      href: "/subscribe/pro",
      highlight: true
    },
    {
      name: "Enterprise",
      price: "$299",
      period: "per month",
      features: [
        "Unlimited mesh nodes",
        "10TB secure storage",
        "24/7 dedicated support",
        "Custom analytics",
        "All premium features"
      ],
      href: "/subscribe/enterprise"
    }
  ];

  const sectors = [
    { name: "Tech", icon: "💻", href: "/sectors/tech" },
    { name: "Finance", icon: "💰", href: "/sectors/finance" },
    { name: "Health", icon: "🏥", href: "/sectors/health" },
    { name: "Energy", icon: "⚡", href: "/sectors/energy" },
    { name: "Agriculture", icon: "🌱", href: "/sectors/agriculture" },
    { name: "Transport", icon: "🚀", href: "/sectors/transport" }
  ];

  return (
    <main>
      {/* Hero Section */}
      <section className="hero-section">
        <PulseCanvas />
        <div className="hero-content">
          <h2>
            The <span>VaultMesh™</span><br />
            Revolution
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-md">
            <Link href="/terminal" className="cta-button">
              Enter Terminal
            </Link>
            <Link href="/learn" className="cta-button-secondary">
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* VIP Admin Panel Access - Hero Section Buttons */}
      <section className="section bg-gray-950 border-t border-green-500/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-green-400 mb-4">🔐 Heyns Admin Panel Sections</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Essential VIP access points from the original VaultMesh ecosystem. These links preserve 
              the complete administrative infrastructure and external platform integrations.
            </p>
          </div>
          <VipButtonsGrid section="hero" columns={4} />
          
          {/* URL Backup & Restore System */}
          <div className="mt-12">
            <URLBackupSystem />
          </div>
          
          {/* Security Status Indicator */}
          <div className="mt-6">
            <SecurityStatusIndicator />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section" id="features">
        <div className="container mx-auto px-4">
          <h2>Core Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="icon">
                  <i className={feature.icon}></i>
                </div>
                <h4>{feature.title}</h4>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Share Price Section */}
      <section className="share-price-section text-center">
        <div className="container mx-auto px-4">
          <h2>VaultMesh™ Share Signal</h2>
          <div className="price-display">$247.83</div>
          <div className="timestamp">Last updated: 2024-01-24 15:30:22 UTC</div>
          <div className="mt-8">
            <PriceChart />
          </div>
        </div>
      </section>

      {/* Terminal Access */}
      <section className="section">
        <div className="container mx-auto px-4">
          <h3>Vault Terminal Access</h3>
          <div className="max-w-4xl mx-auto">
            <Terminal />
          </div>
        </div>
      </section>



      {/* MindLift AgroChain Hero */}
      <section className="section">
        <div className="mindlift-hero">
          <h1>🌐 VaultMesh™ | AgroChain™ Core Protocol Overview</h1>
          <p>Advanced agricultural blockchain infrastructure powered by MindLift™ technology</p>
          <Link href="/agrochain/details" className="cta-button">
            Explore AgroChain™
          </Link>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="section">
        <div className="container mx-auto px-4">
          <h2>🌐 Global 💰 Packages</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricingTiers.map((tier, index) => (
              <div key={index} className={`pricing-card ${tier.highlight ? 'highlight' : ''}`}>
                <h3>{tier.name}</h3>
                <div className="price">{tier.price}</div>
                <div className="price-description">{tier.period}</div>
                <ul className="space-y-2 mb-8">
                  {tier.features.map((feature, featureIndex) => (
                    <li key={featureIndex}>• {feature}</li>
                  ))}
                </ul>
                <Link href={tier.href} className="cta-button w-full">
                  {tier.name === 'Enterprise' ? 'Contact Sales' : 'Get Started'}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sector Scrolls */}
      <section className="section">
        <div className="container mx-auto px-4">
          <h2>Sector Scrolls</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 max-w-4xl mx-auto">
            {sectors.map((sector, index) => (
              <Link 
                key={index}
                href={sector.href} 
                className="glyph bg-gray-100 hover:bg-gray-200 p-4 rounded-lg text-center transition-colors"
              >
                <div className="text-2xl mb-2">{sector.icon}</div>
                <div className="text-sm font-medium">{sector.name}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Founder's Note */}
      <section className="section">
        <div className="container mx-auto px-4 text-center">
          <h2>Founder's Note</h2>
          <div className="max-w-3xl mx-auto space-y-6">
            <p>
              VaultMesh™ represents the culmination of years of research into distributed systems, 
              cryptographic security, and decentralized infrastructure. Our mission is to democratize 
              access to enterprise-grade security and performance for organizations of all sizes.
            </p>
            <p>
              We believe that the future of computing lies in mesh networks that are resilient, 
              secure, and globally accessible. VaultMesh™ is our contribution to building that future.
            </p>
            <p className="font-semibold text-lg">
              — The Fruitful Team
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
