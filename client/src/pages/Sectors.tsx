import { useParams, Link } from "wouter";

export default function Sectors() {
  const { sector } = useParams();

  const sectors = [
    {
      id: "tech",
      name: "Technology",
      icon: "💻",
      description: "Advanced technology solutions for digital transformation",
      features: [
        "Cloud Infrastructure",
        "AI/ML Integration",
        "DevOps Automation",
        "Security Frameworks"
      ]
    },
    {
      id: "finance",
      name: "Finance",
      icon: "💰",
      description: "Secure financial technology and blockchain solutions",
      features: [
        "Digital Payments",
        "Blockchain Integration",
        "Risk Management",
        "Compliance Automation"
      ]
    },
    {
      id: "health",
      name: "Healthcare",
      icon: "🏥",
      description: "Healthcare technology and data management solutions",
      features: [
        "Electronic Health Records",
        "Telemedicine Platforms",
        "Medical Data Analytics",
        "HIPAA Compliance"
      ]
    },
    {
      id: "energy",
      name: "Energy",
      icon: "⚡",
      description: "Smart energy management and renewable solutions",
      features: [
        "Smart Grid Technology",
        "Energy Analytics",
        "Renewable Integration",
        "Carbon Tracking"
      ]
    },
    {
      id: "agriculture",
      name: "Agriculture",
      icon: "🌱",
      description: "Advanced agricultural technology and data solutions",
      features: [
        "Precision Farming",
        "Crop Monitoring",
        "Supply Chain Tracking",
        "Weather Analytics"
      ]
    },
    {
      id: "transport",
      name: "Transportation",
      icon: "🚀",
      description: "Transportation and logistics optimization solutions",
      features: [
        "Fleet Management",
        "Route Optimization",
        "Autonomous Systems",
        "Logistics Analytics"
      ]
    }
  ];

  if (sector) {
    const selectedSector = sectors.find(s => s.id === sector);
    
    if (!selectedSector) {
      return (
        <main className="section">
          <div className="container mx-auto px-4 text-center">
            <h2>Sector Not Found</h2>
            <p>The requested sector could not be found.</p>
            <Link href="/sectors" className="cta-button mt-4">
              Back to Sectors
            </Link>
          </div>
        </main>
      );
    }

    return (
      <main>
        <section className="hero-section">
          <div className="hero-content">
            <h2>
              <span>{selectedSector.icon}</span><br />
              {selectedSector.name} Solutions
            </h2>
            <p className="text-lg mb-8">{selectedSector.description}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-md">
              <Link href="/terminal" className="cta-button">
                Access Terminal
              </Link>
              <Link href="/contact" className="cta-button-secondary">
                Contact Sales
              </Link>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container mx-auto px-4">
            <h3>Key Features</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {selectedSector.features.map((feature, index) => (
                <div key={index} className="feature-card">
                  <div className="icon">
                    <i className="fas fa-check-circle"></i>
                  </div>
                  <h4>{feature}</h4>
                  <p>Industry-leading solutions tailored for {selectedSector.name.toLowerCase()} sector requirements.</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container mx-auto px-4 text-center">
            <h3>Ready to Get Started?</h3>
            <p className="mb-8">Discover how VaultMesh™ can transform your {selectedSector.name.toLowerCase()} operations.</p>
            <div className="flex gap-4 justify-center">
              <Link href="/packages" className="cta-button">
                View Packages
              </Link>
              <Link href="/sectors" className="cta-button-secondary">
                Explore Other Sectors
              </Link>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main>
      <section className="hero-section">
        <div className="hero-content">
          <h2>
            Industry <span>Sectors</span><br />
            We Serve
          </h2>
          <p className="text-lg mb-8">
            VaultMesh™ provides specialized solutions across multiple industries, 
            each tailored to meet specific sector requirements and regulations.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container mx-auto px-4">
          <h3>Choose Your Sector</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sectors.map((sectorItem, index) => (
              <Link 
                key={index}
                href={`/sectors/${sectorItem.id}`}
                className="feature-card block hover:no-underline"
              >
                <div className="icon text-center">
                  <span className="text-4xl">{sectorItem.icon}</span>
                </div>
                <h4 className="text-center">{sectorItem.name}</h4>
                <p className="text-center">{sectorItem.description}</p>
                <div className="mt-4">
                  <ul className="space-y-1">
                    {sectorItem.features.slice(0, 3).map((feature, featureIndex) => (
                      <li key={featureIndex} className="text-sm">• {feature}</li>
                    ))}
                  </ul>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
