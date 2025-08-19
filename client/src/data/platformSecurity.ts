// Platform Security Configuration for VaultMesh Terminal
export const secureplatforms = {
  // Financial Platforms - High Security
  financial: [
    'fnb.co.za',
    'paypal.com',
    'xero.com',
    'sageone.co.za',
    'absa.co.za',
    'standardbank.co.za',
    'nedbank.co.za',
    'capitecbank.co.za'
  ],
  
  // Development Platforms - Access Control
  development: [
    'replit.com',
    'github.com',
    'gitlab.com',
    'vercel.com',
    'netlify.com',
    'heroku.com',
    'digitalocean.com',
    'hetzner.com',
    'aws.amazon.com'
  ],
  
  // AI/ML Platforms - API Security
  ai: [
    'gemini.google.com',
    'openai.com',
    'anthropic.com',
    'huggingface.co',
    'cohere.ai'
  ],
  
  // Email/Communication - Privacy Protected
  communication: [
    'gmail.com',
    'outlook.com',
    'zoho.com',
    'protonmail.com'
  ]
};

export const getPlatformType = (url: string): string | null => {
  const lowercaseUrl = url.toLowerCase();
  
  for (const [type, platforms] of Object.entries(secureplatforms)) {
    if (platforms.some(platform => lowercaseUrl.includes(platform))) {
      return type;
    }
  }
  
  return null;
};

export const isPlatformSecure = (url: string): boolean => {
  return getPlatformType(url) !== null;
};

export const getSecurityMessage = (url: string): { title: string; message: string; icon: string } => {
  const platformType = getPlatformType(url);
  
  const messages = {
    financial: {
      title: "Financial Platform Security",
      message: "Banking and payment platforms block embedding to protect your financial data and prevent fraud.",
      icon: "🏦"
    },
    development: {
      title: "Development Platform Security", 
      message: "Code platforms require direct access to protect repositories and prevent unauthorized access.",
      icon: "⚡"
    },
    ai: {
      title: "AI Platform Security",
      message: "AI platforms block embedding to protect API keys and ensure secure model interactions.",
      icon: "🤖"
    },
    communication: {
      title: "Communication Privacy",
      message: "Email and messaging platforms protect your privacy by blocking iframe embedding.",
      icon: "📧"
    }
  };
  
  return messages[platformType as keyof typeof messages] || {
    title: "Security Restriction",
    message: "This platform blocks iframe embedding for security reasons.",
    icon: "🔒"
  };
};