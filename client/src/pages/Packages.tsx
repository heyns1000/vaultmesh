import { Link, useParams } from "wouter";
import PayPalButton from "../components/PayPalButton";

export default function Packages() {
  const { tier } = useParams();

  const packages = [
    {
      id: "starter",
      name: "🌱 Agriculture & Biotech Starter Package",
      price: "$30.52",
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
      price: "$76.30",
      description: "Unlock powerful features for Pro success.",
      features: [
        "Full API Access",
        "Advanced Analytics Dashboard",
        "Priority Support",
        "Up to 25 Users", 
        "500 GB Data Storage",
        "Custom Integrations"
      ],
      highlight: true
    },
    {
      id: "enterprise",
      name: "🌱 Agriculture & Biotech Enterprise Package",
      price: "$299.00", 
      description: "Complete enterprise solution.",
      features: [
        "Unlimited API Access",
        "Custom Analytics Dashboard",
        "24/7 Dedicated Support",
        "Unlimited Users",
        "10 TB Data Storage", 
        "White-label Options",
        "Custom Development"
      ]
    }
  ];

  if (tier) {
    const selectedPackage = packages.find(p => p.id === tier);
    
    if (!selectedPackage) {
      return (
        <main className="section">
          <div className="container mx-auto px-4 text-center">
            <h2>Package Not Found</h2>
            <p>The requested package could not be found.</p>
            <Link href="/packages" className="cta-button mt-4">
              Back to Packages
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
              <span>Subscribe to</span><br />
              {selectedPackage.name}
            </h2>
            <p className="text-lg mb-8">{selectedPackage.description}</p>
          </div>
        </section>

        <section className="section">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              <div className={`pricing-card ${selectedPackage.highlight ? 'highlight' : ''}`}>
                <h3>{selectedPackage.name}</h3>
                <div className="price">{selectedPackage.price}</div>
                <div className="price-description">per month</div>
                <ul className="space-y-2 mb-8">
                  {selectedPackage.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <i className="fas fa-check-circle mr-2" style={{ color: 'var(--primary-blue)' }}></i>
                      {feature}
                    </li>
                  ))}
                </ul>
                
                <div className="mt-8">
                  <h4 className="text-lg font-semibold mb-4 text-center">Complete Your Purchase</h4>
                  <PayPalButton
                    amount={selectedPackage.price.replace('$', '')}
                    currency="USD"
                    intent="capture"
                  />
                </div>
              </div>
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
            🌐 Global <span>💰 Packages</span><br />
            Choose Your Plan
          </h2>
          <p className="text-lg mb-8">
            Select the perfect VaultMesh™ package for your organization's needs. 
            All plans include our core security and mesh networking features.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {packages.map((pkg, index) => (
              <div key={index} className={`pricing-card ${pkg.highlight ? 'highlight' : ''}`}>
                <h3>{pkg.name}</h3>
                <div className="price">{pkg.price}</div>
                <div className="price-description">per month</div>
                <ul className="space-y-2 mb-8">
                  {pkg.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <i className="fas fa-check-circle mr-2" style={{ color: 'var(--primary-blue)' }}></i>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link href={`/subscribe/${pkg.id}`} className="cta-button w-full">
                  {pkg.id === 'enterprise' ? 'Contact Sales' : 'Subscribe Now'}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container mx-auto px-4 text-center">
          <h3>Not Sure Which Package to Choose?</h3>
          <p className="mb-8">
            Our team can help you select the right VaultMesh™ package based on your specific requirements.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/contact" className="cta-button">
              Contact Sales
            </Link>
            <Link href="/terminal" className="cta-button-secondary">
              Try Terminal
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
