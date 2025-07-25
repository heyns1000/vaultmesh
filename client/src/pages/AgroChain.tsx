import { Link } from "wouter";
import PayPalButton from "../components/PayPalButton";

export default function AgroChain() {
  const features = [
    {
      icon: "fas fa-link",
      title: "Direct Integration",
      description: "Direct integration with FAA 🧾 Professional Services Mesh for seamless agricultural data management."
    },
    {
      icon: "fas fa-sync-alt", 
      title: "Advanced Data Sync",
      description: "Real-time data synchronization with YieldNode™ for up-to-date agricultural insights and decision making."
    },
    {
      icon: "fas fa-shield-alt",
      title: "Real-time Compliance", 
      description: "Ensure robust regulatory adherence with VaultLink™ agricultural compliance frameworks."
    },
    {
      icon: "fas fa-expand-arrows-alt",
      title: "Scalable Architecture",
      description: "Unleash massive scalability for x21 power expansion, ensuring your agricultural operations can grow."
    },
    {
      icon: "fas fa-chart-line",
      title: "Predictive Analytics",
      description: "Leverage our advanced predictive analytics module for AgroChain optimization and yield prediction."
    },
    {
      icon: "fas fa-puzzle-piece",
      title: "Open API Access", 
      description: "Gain full API access for seamless interoperability, allowing integration with existing farm systems."
    },
    {
      icon: "fas fa-lock",
      title: "Blockchain Security",
      description: "Benefit from immutable, blockchain-secured data provenance for complete agricultural traceability."
    },
    {
      icon: "fas fa-file-invoice",
      title: "One-click Reporting",
      description: "Generate comprehensive regulatory reports and detailed audit trails with a single click."
    },
    {
      icon: "fas fa-network-wired", 
      title: "Self-optimizing Nodes",
      description: "Achieve peak operational efficiency with intelligent, self-optimizing agricultural processing nodes."
    },
    {
      icon: "fas fa-brain",
      title: "Secure Multi-party Computation",
      description: "Enable secure, collaborative data analysis with multiple stakeholders while preserving privacy."
    }
  ];

  const subnodes = [
    {
      icon: "fas fa-seedling",
      title: "YieldNode™",
      description: "Specialized nodes for optimizing agricultural yield data processing, ensuring maximum productivity and resource utilization."
    },
    {
      icon: "fas fa-search-location",
      title: "SoilScan™", 
      description: "Advanced subnode for granular soil analysis and real-time environmental data collection, enabling precision agriculture."
    },
    {
      icon: "fas fa-bug",
      title: "PestDetect™",
      description: "Intelligent detection and tracking of agricultural pests with AI-driven insights, minimizing crop damage and chemical use."
    },
    {
      icon: "fas fa-barcode",
      title: "CropTrace™",
      description: "Comprehensive traceability for crop origin and lifecycle management, providing transparent, farm-to-fork insights."
    }
  ];

  const packages = [
    {
      id: "starter",
      name: "🌱 Agriculture & Biotech Starter Package",
      price: "30.52",
      description: "Unlock powerful features for Starter success.",
      features: [
        "Basic API Access",
        "Standard Analytics Dashboard",
        "Community Support", 
        "Up to 5 Users",
        "50 GB Data Storage"
      ]
    },
    {
      id: "pro", 
      name: "🌱 Agriculture & Biotech Pro Package",
      price: "76.30",
      description: "Unlock powerful features for Pro success.",
      features: [
        "Full API Access",
        "Advanced Analytics Dashboard",
        "Priority Support",
        "Up to 25 Users",
        "500 GB Data Storage",
        "Real-time Compliance Monitoring",
        "YieldNode™ Access"
      ],
      highlight: true
    },
    {
      id: "enterprise",
      name: "🌱 Agriculture & Biotech Enterprise Package", 
      price: "299.00",
      description: "Complete enterprise agricultural solution.",
      features: [
        "Unlimited API Access",
        "Custom Analytics Dashboard",
        "24/7 Dedicated Support",
        "Unlimited Users",
        "10 TB Data Storage",
        "All Subnodes Access",
        "Custom Integration Support",
        "White-label Options"
      ]
    }
  ];

  return (
    <main>
      {/* MindLift Hero Section */}
      <section className="mindlift-hero">
        <h1>🌐 VaultMesh™ | AgroChain™ Core Protocol Overview</h1>
        <p>
          AgroChain™ is a powerful FAA.zone™ framework empowering the Agriculture & Biotech sector 
          with advanced automation and data management. It connects effortlessly to the PulseGrid™ 
          for optimized workflow and compliance.
        </p>
        <Link href="#pricing" className="cta-button">
          View Pricing →
        </Link>
      </section>

      {/* Key Features */}
      <section className="section">
        <div className="container mx-auto px-4">
          <h2>Key Features</h2>
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

      {/* Why Trust VaultMesh */}
      <section className="section">
        <div className="container mx-auto px-4 text-center">
          <h2>Why Trust 🌐 VaultMesh™?</h2>
          <div className="max-w-4xl mx-auto space-y-6">
            <p className="text-lg" style={{ color: 'var(--muted-text)' }}>
              At <strong>VaultMesh™</strong>, we are the architects of the core infrastructure that powers the entire FAA.zone™ ecosystem. 
              Our purpose is to provide a <strong>robust, immutable, and universally accessible fabric</strong> for critical information 
              and distributed processes, enabling global compliance, efficiency, and innovation across heavily regulated sectors.
            </p>
            <p className="text-lg" style={{ color: 'var(--muted-text)' }}>
              We specialize in <strong>Decentralized Data Integrity</strong>, <strong>Secure Data Orchestration</strong>, 
              and building <strong>Scalable & Resilient Infrastructure</strong>. Our solutions offer <strong>Verifiable Trust & Identity</strong> 
              and comprehensive <strong>Compliance & Audit Trails</strong>.
            </p>
            <div className="mt-8">
              <p className="text-lg font-semibold" style={{ color: 'var(--text-color-primary)' }}>Built on principles by:</p>
              <p className="text-xl font-bold mt-2" style={{ color: 'var(--mindlift-purple)' }}>Heyns Schoeman™</p>
              <p className="text-md" style={{ color: 'var(--muted-text)' }}>
                Founder | FAA Global™ | FAA.zone™ 🌍<br />
                "Sustain. Protect. Empower."
              </p>
              <Link href="/about" className="cta-button mt-4">
                Learn More About Us
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* VaultMesh Subnodes */}
      <section className="section">
        <div className="container mx-auto px-4">
          <h2>VaultMesh™ Subnodes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {subnodes.map((subnode, index) => (
              <div key={index} className="feature-card">
                <div className="icon">
                  <i className={subnode.icon}></i>
                </div>
                <h4>{subnode.title}</h4>
                <p>{subnode.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAA Metadata & Real-Time Metrics */}
      <section className="section">
        <div className="container mx-auto px-4">
          <h2>FAA Metadata & Real-Time Metrics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="feature-card">
              <h4>FAA Metadata & Compliance</h4>
              <ul className="space-y-2 mt-4">
                <li><strong>Product ID:</strong> AGROC-2537</li>
                <li><strong>VaultID:</strong> VAULT-9869</li>
                <li><strong>Signal Echo Layer:</strong> Layer Beta v4.3</li>
                <li><strong>Deployment Zone:</strong> Zone E 8</li>
                <li><strong>Security Rating:</strong> FAA-SEC B+</li>
                <li><strong>Active Nodes:</strong> 493</li>
                <li><strong>Last Audit:</strong> 2025-08-04</li>
                <li><strong>Compliance Status:</strong> Active & Certified</li>
              </ul>
            </div>
            <div className="feature-card">
              <h4>Real-Time Metrics Overview</h4>
              <ul className="space-y-2 mt-4">
                <li><strong>Current Pulse Activity:</strong> 65.08 pulses/sec</li>
                <li><strong>Data Volume Processed (24h):</strong> 108.02 TB</li>
                <li><strong>Latency Average:</strong> 40.82 ms</li>
              </ul>
              <h5 className="font-semibold mt-6 mb-3" style={{ color: 'var(--text-color-primary)' }}>
                VaultTrace™ Ledger Entries:
              </h5>
              <ul className="space-y-1">
                <li>#7756 - AGROC Pulse Tx - Confirmed</li>
                <li>#6954 - AGRIC Data Sync - Completed</li>
                <li>#7848 - Node Activation Confirm - Offline</li>
                <li>#3206 - VaultTrace™ Audit - Passed</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="section">
        <div className="container mx-auto px-4">
          <h2>Flexible Pricing for Every Operation</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {packages.map((pkg, index) => (
              <div key={index} className={`pricing-card ${pkg.highlight ? 'highlight' : ''}`}>
                <h3>{pkg.name}</h3>
                <div className="price">${pkg.price}</div>
                <div className="price-description">
                  Unlock powerful features for {pkg.id === 'enterprise' ? 'Enterprise' : pkg.id} success.
                </div>
                <ul className="space-y-2 mb-8">
                  {pkg.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <i className="fas fa-check-circle mr-2" style={{ color: 'var(--primary-blue)' }}></i>
                      {feature}
                    </li>
                  ))}
                </ul>
                
                <div className="mt-auto">
                  <div className="mb-4">
                    <label htmlFor={`${pkg.id}-quantity`} className="block text-sm font-medium mb-2">
                      Quantity:
                    </label>
                    <select id={`${pkg.id}-quantity`} className="w-full p-2 border rounded">
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                      <option value="5">5</option>
                    </select>
                  </div>
                  
                  <PayPalButton
                    amount={pkg.price}
                    currency="USD"
                    intent="capture"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="section bg-red-50 text-red-800 text-center">
        <div className="container mx-auto px-4">
          <p className="text-sm">
            <strong>Disclaimer:</strong> This is a demonstration of VaultMesh™ AgroChain™ protocol capabilities. 
            Actual implementation may vary based on specific agricultural requirements and regulatory compliance needs.
          </p>
        </div>
      </section>
    </main>
  );
}
